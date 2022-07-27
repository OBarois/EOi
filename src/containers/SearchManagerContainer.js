
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
    }, [dispatch])
    
    const handleSearchStart = useCallback ( () => {
      dispatch({ type: "onSearchStart", value: Math.random()})
    }, [dispatch])
    
    const handleSearchComplete = useCallback (  (searchDesc) => {
      dispatch({ type: "onSearchComplete", value: searchDesc})
    }, [dispatch])

    const handleCredentials = useCallback ( (url) => {
      let key = url.split("/")[2]
      let user = window.prompt("Please enter your username for \n"+key,"")
      let pass = window.prompt("Please enter your password for \n"+key,"")
      dispatch({ type: "set_credentials", value: {key: key, user:user, pass:pass}})
      return
    }, [dispatch])

// to do: pass credentials from state
    return (
        <SearchManager 
          searchdate={new Date(state.searchDate)} 
          searchpoint={debouncedsearchPoint} 
          searchmode={state.searchMode}
          dataset={state.dataset} 
          credentials={state.credentials}
          altitude={debouncedaltitude} 
          onSearchStart={handleSearchStart}
          onPageSearch={handlePageSearch}
          onSearchComplete={handleSearchComplete}
          on401={handleCredentials}
          lefthanded={state.leftHanded}
        />
    )
}

export default SearchManagerContainer;



