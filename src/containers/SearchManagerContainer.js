
import React, { useState, useEffect } from "react";
import { useGlobal } from 'reactn';
import SearchManager from "../components/searchmanager"


const SearchManagerContainer = () => {

    const [ searchDate,  ] = useGlobal('searchDate');
    const [ searchPoint,  ] = useGlobal('searchPoint');
    const [ mission,  ] = useGlobal('mission');
    const [ altitude,  ] = useGlobal('altitude');
    const [ geojson, setgeojson ] = useGlobal('geojson');

    const handlePageSearch = (results) => {
      setgeojson(results)
      };
    
    const handleSearchComplete = (results) => {
      console.log('search finished')
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



