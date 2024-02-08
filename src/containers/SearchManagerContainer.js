
import React, {  useState, useCallback } from "react";
import {AppContext} from '../components/app/context'

import SearchManager from "../components/searchmanager"
import { useDebounce } from '../hooks/useDebounce';



const SearchManagerContainer = () => {

  const [ state, dispatch ] = React.useContext(AppContext)

  const debouncedsearchPoint = useDebounce(state.searchPoint, 200)
  const debouncedaltitude = useDebounce(state.altitude, 200)

 
  
  const getcredential = (key) => {
    for(let i=0; i < state.credentials.length; i++) {
        if(state.credentials[i].key === key) {
            return {user:state.credentials[i].user,pass:state.credentials[i].pass}
        }
    }
    return {user:"",pass:""}
}

    const getcollection = (code) => {
        for(let i=0; i < state.collections.length; i++) {
            if(state.collections[i].code === code) {
                return state.collections[i]
            }
        }
        return null
    }


  
    const handlePageSearch = useCallback ( (results, resultdesc) => {
      dispatch({ type: "onResultPage", value: {resultdesc: resultdesc, results: results} })
    }, [dispatch])
    
    const handleSearchStart = useCallback ( () => {
      dispatch({ type: "onSearchStart", value: Math.random()})
    }, [dispatch])
    
    const handleClearResult = useCallback ( () => {
      dispatch({ type: "clearResult"})
    }, [dispatch])
    
    const handleSearchComplete = useCallback (  (searchDesc) => {
      dispatch({ type: "onSearchComplete", value: searchDesc})
    }, [dispatch])

    const handleCredentials = useCallback ( (dataset) => {
      console.log(dataset)
      // let key = getcollection(state.dataset).templateUrl.split("/")[2]
      let key = dataset.templateUrl.split("/")[2]
      let credential = getcredential(key)
      console.log(key)
      let user = window.prompt("Please enter your username for \n"+key,credential.user?credential.user:'')
      let pass = window.prompt("Please enter your password for \n"+key,credential.pass?credential.pass:'')
      dispatch({ type: "set_credentials", value: {key: key, user:user, pass:pass}})
      return
    }, [dispatch])


    return (
        <SearchManager 
          searchdate={state.searchDate} 
          searchpoint={debouncedsearchPoint} 
          searchmode={state.searchMode}
          searchWinStart={state.searchWinStart}
          searchWinEnd={state.searchWinEnd}
          dataset={getcollection(state.dataset)} 
          freetext={state.freetext}
          trigger={state.searchtrigger}
          credentials={state.credentials}
          altitude={debouncedaltitude} 
          onClearResult={handleClearResult}
          onSearchStart={handleSearchStart}
          onPageSearch={handlePageSearch}
          onSearchComplete={handleSearchComplete}
          on401={handleCredentials}
          lefthanded={state.leftHanded}
        />
    )
}

export default SearchManagerContainer;



