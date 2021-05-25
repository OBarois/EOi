
import React, { useState, useEffect, useCallback } from "react";
import { useGlobal } from 'reactn';
import SearchManager from "../components/searchmanager"


const SearchManagerContainer = () => {

  const [ searchDate,  ] = useGlobal('viewDate');
  const [ goToDate, setgoToDate ] = useGlobal('goToDate');
  const [ clearGeojsonTrigger, setclearGeojsonTrigger ] = useGlobal('clearGeojsonTrigger');
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
      setclearGeojsonTrigger(Math.random())
      setresultDesc({totalResults:0, totalLoaded:0 })
      setselectedProduct([])
      setclosestItem(null)


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



