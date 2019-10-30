import React from 'react';
import { useState, useEffect } from 'react';
// function that loads google map api
import { loadGoogleMapApi, getDestinationGeocode } from '../utils/maps/googleMapApi';
import { fetchDestinations } from '../Actions/fetchData';
import EditSearch from './Forms/EditSearch';
import mapStyles from '../css/mapStyling';
import { css } from '@emotion/core';
import PropagateLoader from 'react-spinners/PropagateLoader';

export default function FlightSelection(props){

  const override = css`
  margin: 0;
  margin-left: 10px;
  display: flex;
  justify-content: center;
  padding-top:30px;  
  padding-bottom:30px;  
`;


  const originTable = {
    "MAD": {
      "city_name": "MADRID",
      "active": false,
    },
    "MUC": {
      "city_name": "MUNICH",
      "active": false,
    },
    "PAR": {
      "city_name": "PARIS",
      "active": false,
    },
    "NYC": {
      "city_name": "NEW YORK",
      "active": false,
    },
    "LON": {
      "city_name": "LONDON",
      "active": false,
    }
  }; 
  // set the current origin to active => true
  originTable[props.match.params.ori].active = true;

  // Set curent origin in local state
  const [origin, SetOrigin] = useState(props.match.params.ori);
  const [destinations, SetDestinations] = useState(null);
  // error message
  const [errorMessage, setErrorMessage] = useState('');
  // google map
  const [defaultZoom] = useState(4);
  const [googleMap, setGoogleMap] = useState(null);
  const [mapLoaded, setmapLoaded] = useState(false);
  const [ currentCityCenter, setCurrentCityCenter ] = useState(null);


  useEffect(()=>{
    SetOrigin(props.match.params.ori)
  },[props.match.params.ori] // force to re-render the component when receiving new props
  )


  // Get the destination list based on origin
  useEffect(()=>{
    const getDestinations = async (origin) =>{
      SetDestinations(null);
      try {
          const destinationsList = await fetchDestinations(origin);
          SetDestinations(destinationsList);
      }
      catch (error) {
        setErrorMessage("an error occured while looking for your data, please try again later");
      }
    }
    getDestinations(origin);
  }, [origin]

  );
  
  
  const mapDefaultView = async () =>{
    if(currentCityCenter === originTable[origin].city_name){
      // if the origin have not changed we do not update the default view
      return;
    }
    else setCurrentCityCenter(originTable[origin].city_name)
    // we get the map centered on the current origin by default
    const center = await getDestinationGeocode(originTable[origin].city_name);

    const currentMapInstance = new googleMap.Map(document.getElementById('map'), {
      zoom:defaultZoom,
      scrollwheel:false,
      center,
      styles: mapStyles
    });
    // add the marker to the center
    new googleMap.Marker({
      map: currentMapInstance,
      position: center,
      styles: mapStyles
    });
  }

  useEffect( ()=>{
    if(googleMap){
      mapDefaultView();
    }
  }
  );

useEffect( ()=>{
    if(!mapLoaded){
      loadMap();
    }
  }, [origin, mapLoaded]
);


  const loadMap = () =>{
    const mapPromise =  loadGoogleMapApi();
    Promise.all([
      mapPromise
    ])
    .then(value =>{
      const googleMap = (value[0].maps);
      setGoogleMap(googleMap); // make it globaly accessible to the page
      setmapLoaded(true);
    }); 
  }

  const showRouteOnMap = async (destinationCity) =>{
    const from = await getDestinationGeocode(originTable[origin].city_name);

    const currentMapInstance = new googleMap.Map(document.getElementById('map'), {
      zoom:defaultZoom,
      scrollwheel:false,
      center: {lat: from.lat, lng: from.lng},
      styles: mapStyles
    });

    const to = await getDestinationGeocode(destinationCity);
    if (!from || !to) {
      // enable to get the line geocoordinate, return otherwise 
      // it breaks the display
      return;
    }

    let routeCoordinates = [
      {lat: from.lat, lng: from.lng},
      {lat: to.lat, lng: to.lng},
    ];

    const flightPath = new googleMap.Polyline({
      path: routeCoordinates,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
    flightPath.setMap(currentMapInstance);
  }
  
  return(
    <>
    <div>
      <EditSearch 
        submitAirport={props.submitAirport} 
        reRenderWithFlights={props.reRenderWithFlights}
        originTable = {originTable}
        />
    </div>
    <div className="search-result-container">
      <div className="result-list-container">
      {
        errorMessage && (
          <div className="flight-item">
            {errorMessage}
          </div>
        )

      }
      {
        destinations ? (
          destinations.data.map( 
            flight => (
              <div 
              key={flight.origin + flight.destination}
              className="flight-item"
              onMouseEnter={() => {
                showRouteOnMap(destinations.dictionaries.locations[flight.destination].detailedName);
              }}
              >
                <div className="destination-name"><h4>{destinations.dictionaries.locations[flight.destination].detailedName}</h4></div>
                
                <div className="flight-details">
                
                  <div>
                    <label>Flying on </label>
                    <div className="date-up">{flight.departureDate}</div>
                  </div>
                  <div>
                    <label>Returngin on </label>
                    <div className="date-down">{flight.returnDate}</div>
                  </div>
                  <div className="large-display">{flight.price.total} <span className="small-display">{destinations.meta.currency}</span></div>
                  
                </div>
                
              </div>
            )
          )
        )
        : (
          <div className="flight-item">
            <PropagateLoader
              css={override}
              widthUnit={'%'}
              size={10}
              color={'#5f9ea0'}
              loading={true}
            />
          </div>
        )
      }
      </div>
      <div className="result-map">
        <div className="map-container">
        <div id="map" >
        </div>
        </div>
      </div>
    </div>
    </>
  );
}