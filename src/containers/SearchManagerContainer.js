
import React, { useState, useEffect } from "react";
import { useGlobal } from 'reactn';
import SearchManager from "../components/searchmanager"


const SearchManagerContainer = () => {

  const [ searchDate,  ] = useGlobal('searchDate');
  const [ goToDate, setgoToDate ] = useGlobal('goToDate');
  const [ searchPoint,  ] = useGlobal('searchPoint');
    const [ mission,  ] = useGlobal('mission');
    const [ altitude,  ] = useGlobal('altitude');
    const [ geojson, setgeojson ] = useGlobal('geojson');

    const handlePageSearch = (results) => {
      setgeojson(results)
      };
    
    const handleSearchComplete = (lastitemdate) => {
      if(lastitemdate) {
        setgoToDate(lastitemdate)
        console.log('search complete. Last item: '+lastitemdate)
      }
    };
      
      return (
        <SearchManager 
          searchdate={searchDate} 
          searchpoint={searchPoint} 
          mission={mission} 
          altitude={altitude} 
          onPageSearch={handlePageSearch}
          onSearchComplete={handleSearchComplete}
        />
    )
}

export default SearchManagerContainer;



