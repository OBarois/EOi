
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

    const handlePageSearch = useCallback ( (results, resultdesc) => {
      setgeojson(results)
      console.log(resultdesc)
      // setresultDesc((desc)=>{return  {
      //   ...desc,...resultdesc
      // }})
      setresultDesc(resultdesc)
    }, [])
    
    const handleSearchStart = useCallback ( () => {
      // console.log('set clear trigger')
      setclearGeojsonTrigger(Math.random())
      setresultDesc({totalResults:0, totalLoaded:0 })
      }, [])
    
      const handleSearchComplete = useCallback ( (searchDesc) => {
        console.log(searchDesc)
        if(altitude > 3000) setgoToDate(!animated?searchDesc.firstResultDate:searchDesc.lastResultDate)
        // setresultDesc(()=>{return {...resultDesc, ...searchDesc}})
    }, [])

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



