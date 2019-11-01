import React from 'react';
import { useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';



export default function EditSearch(props) {
  const { originTable } = props

  const showOriginOptions = () => {
    // Methode 1 forEach() on Nodelist
    let cities = document.querySelectorAll("div[name='origin']");
    cities.forEach((city)=>{
      console.dir("Showing", city);
      city.classList.remove('hide');
    });
    // Other method by mapping the NodeList to an array
    //const cityArray = [...document.querySelectorAll('.origin-city')]
    // for(let i=0; i<cityArray.length; i++){
    //   cityArray[i].style.display = 'block';
    // }
  }

  const hideOriginOptions = () => {
    // Methode 1 forEach() on Nodelist
    let cities = document.querySelectorAll("div[name='origin']");
    cities.forEach((city)=>{
      console.dir(city);
      if(!originTable[city.id].active){
        city.classList.add('hide');
      }
    });
    // Other method by mapping the NodeList to an array
    //const cityArray = [...document.querySelectorAll('.origin-city')]
    // for(let i=0; i<cityArray.length; i++){
    //   cityArray[i].style.display = 'block';
    // }
  }

  useEffect(()=>{
    hideOriginOptions();
  }

  );


  return(
    <EditSearchContainer>
      <OriginCityContainer>
        <label>YOU ARE FLYING FROM</label>
        <Row>
          {Object.keys(originTable).map((origin) => (
              originTable[origin].active ? (
                <div key={originTable[origin].city_name}>
                  <OriginCity name="origin" id={origin} onClick={showOriginOptions} className="origin-city" active>{originTable[origin].city_name}</OriginCity>
                </div>
              ) 
              : 
              (
                <Link key={originTable[origin].city_name} to={`/result/${origin}`}>
                  <OriginCity name="origin" id={origin} className="origin-city">{originTable[origin].city_name}</OriginCity>
                </Link>
              )
            ))
          }
        </Row>
      </OriginCityContainer>
    </EditSearchContainer>
  );
}

const EditSearchContainer = styled.div`
  display:flex;
  justify-content:flex-start;
  border-bottom:1px solid #eeeeee;
  padding:15px;
`;

const OriginCityContainer = styled.div`
`;

const Row = styled.div`
  display:flex;
  justify-content: start;
  flex-wrap: wrap;
  align-items:center;
  margin-top:10px;
`;

const OriginCity = styled.div`
  padding:10px;
  margin-left:5px;
  border-top-left-radius: 5px;
  border-bottom-right-radius: 5px;
  font-size: .8rem;
  background-color: none;
  border: ${props => props.active ? "1px solid #5f9ea0" : "1px solid #eeeeee"};
  :hover{
    transition: all 0.4s ease 0s;
    transform: translateY(-5px);
    border:1px solid #5f9ea0;
  }
`;