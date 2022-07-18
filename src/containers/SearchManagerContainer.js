
import React, {  useCallback } from "react";
import {AppContext} from '../components/app/context'

import SearchManager from "../components/searchmanager"
import { useDebounce } from '../hooks/useDebounce';



const SearchManagerContainer = () => {

  const [ state, dispatch ] = React.useContext(AppContext)

  const debouncedsearchPoint = useDebounce(state.searchPoint, 200)
  const debouncedaltitude = useDebounce(state.altitude, 200)

  
    const handlePageSearch = useCallback ( (results, resultdesc) => {
      dispatch({ type: "onResultPage", value: {resultdesc: resultdesc, results: results} })
    }, [])
    
    const handleSearchStart = useCallback ( () => {
      dispatch({ type: "onSearchStart", value: Math.random()})
    }, [])
    
    const handleSearchComplete =  (searchDesc) => {
      dispatch({ type: "onSearchComplete", value: searchDesc})
    }

// to do: pass credentials from state
    return (
        <SearchManager 
          searchdate={new Date(state.searchDate)} 
          searchpoint={debouncedsearchPoint} 
          searchmode={state.searchMode}
          mission={state.mission} 
          altitude={debouncedaltitude} 
          onSearchStart={handleSearchStart}
          onPageSearch={handlePageSearch}
          onSearchComplete={handleSearchComplete}
        />
    )
}

export default SearchManagerContainer;



