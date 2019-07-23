import React from 'react';

import MainSearchForm from './Forms/MainSearchForm'

export default function flightSelection(props){

    return(
      <>
      <div className="search-form">
        <MainSearchForm submitAirport={props.submitAirport} currentMode={props.currentMode}/>
      </div>
      <div className="search-result-container">
        <div className="result-list-container">
        {
          props.destinations.data.map( 
            flight => (
              <div 
              key={flight.origin + flight.destination}
              className="flight-item"
              >
                <h4>{props.destinations.dictionaries.locations[flight.destination].detailedName}</h4>
                <div className="flight-details">
                
                  <div>
                    <label>Flying on </label>
                    <div className="date">{flight.departureDate}</div>
                  </div>
                  <div>
                    <label>Returngin on </label>
                    <div className="date">{flight.returnDate}</div>
                  </div>
                  <span className="large-display">{flight.price.total} &euro;</span>
                  
                </div>
                
              </div>
            )
          )
        }
        </div>
        <div className="result-map-container">

        </div>
      </div>
      </>
    );
}