
import React, { useState, useEffect, useCallback } from "react";
import { useGlobal } from 'reactn';
import SearchManager from "../components/searchmanager"
import { useDebounce } from '../hooks/useDebounce';



const SearchManagerContainer = () => {

  const [ searchDate,  ] = useGlobal('searchDate');
  const [ goToDate, setgoToDate ] = useGlobal('goToDate');
  const [ , setclearResultsTrigger ] = useGlobal('clearResultsTrigger')
  const [ searchPoint,  ] = useGlobal('searchPoint');
  const [ animated,  ] = useGlobal('animated');
  const [ mission,  ] = useGlobal('mission');
  const [ altitude,  ] = useGlobal('altitude');
  const [ pointSearchMaxAltitude,  ] = useGlobal('pointSearchMaxAltitude');
  const [ geojson, setgeojson ] = useGlobal('geojson');
  const [ resultDesc, setresultDesc ] = useGlobal('resultDesc');
  const [ selectedProduct, setselectedProduct] = useGlobal('selectedProduct')
  const [ closestItem, setclosestItem] = useGlobal('closestItem')


  const [anim, setanim] = useState(animated)

  const debouncedsearchPoint = useDebounce(searchPoint, 200)
  const debouncedaltitude = useDebounce(altitude, 200)

  
    const handlePageSearch = useCallback ( (results, resultdesc) => {
      setgeojson(results)
      // console.log(resultdesc)
      // setresultDesc((desc)=>{return  {
      //   ...desc,...resultdesc
      // }})
      setresultDesc(resultdesc)
    }, [])
    
    const handleSearchStart = useCallback ( () => {
      // console.log('set clear trigger')
      setclearResultsTrigger(Math.random())
      setresultDesc({totalResults:0, totalLoaded:0 })
      }, [])
    
    const handleSearchComplete =  (searchDesc) => {
      if(altitude > pointSearchMaxAltitude) {
        setgoToDate(!animated?searchDesc.firstResultDate:searchDesc.lastResultDate)
      } else {
        if(animated) setgoToDate(searchDesc.lastResultDate)
      }
      // setresultDesc(()=>{return {...resultDesc, ...searchDesc}})
    }

  //   useEffect(() => {
  //     setanim(animated)
  // }, [animated]);


    return (
        <SearchManager 
          searchdate={searchDate} 
          searchpoint={debouncedsearchPoint} 
          mission={mission} 
          altitude={debouncedaltitude} 
          onSearchStart={handleSearchStart}
          onPageSearch={handlePageSearch}
          onSearchComplete={handleSearchComplete}
        />
    )
}

export default SearchManagerContainer;



