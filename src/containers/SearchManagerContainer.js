
import React, { useState, useEffect, useCallback } from "react";
import { useGlobal } from 'reactn';
import SearchManager from "../components/searchmanager"


const SearchManagerContainer = () => {

  const [ searchDate,  ] = useGlobal('viewDate');
  const [ goToDate, setgoToDate ] = useGlobal('goToDate');
  const [ clearGeojsonTrigger, setclearGeojsonTrigger ] = useGlobal('clearGeojsonTrigger');
  const [ searchPoint,  ] = useGlobal('searchPoint');
    const [ mission,  ] = useGlobal('mission');
    const [ altitude,  ] = useGlobal('altitude');
    const [ animated,  ] = useGlobal('animated');
    const [ geojson, setgeojson ] = useGlobal('geojson');
    const [ resultDesc, setresultDesc ] = useGlobal('resultDesc');

    const handlePageSearch = useCallback ( (results) => {
      setgeojson(results)
      }, [])
    
    const handleSearchStart = useCallback ( () => {
      // console.log('set clear trigger')
      setclearGeojsonTrigger(Math.random())
      }, [])
    
      const handleSearchComplete = (firstitemdate, lastitemdate) => {
        console.log('Search Complete: [ '+ altitude + ', '+ firstitemdate + ', ' + lastitemdate + ' ]')
        if(altitude > 3000) setgoToDate(animated?lastitemdate:firstitemdate)
        setresultDesc({...resultDesc, firstItemDate: firstitemdate, lastItemDate: lastitemdate})
    }

  //   useEffect(() => {
  //     console.log('animated: '+animated)
  // }, [animated]);

      
      return (
        <SearchManager 
          searchdate={searchDate} 
          searchpoint={searchPoint} 
          mission={mission} 
          altitude={altitude} 
          onSearchStart={handleSearchStart}
          onPageSearch={handlePageSearch}
          onSearchComplete={handleSearchComplete}
        />
    )
}

export default SearchManagerContainer;



