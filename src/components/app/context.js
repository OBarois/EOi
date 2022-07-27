// export { AppContext } from './App'

import React from "react"
import { reducer } from "./reducer"
import {  initstate,  getsavedstate } from "./initstate"
import  { useEffect } from "react";
import { useDebounce } from '../../hooks/useDebounce'
import JSONCrush from "jsoncrush"

export const AppContext = React.createContext(null)

const istate = initstate()

export const AppProvider = ({ children }) => {

 

  const [state, dispatch] = React.useReducer(reducer, istate)

  const debouncedstate = useDebounce(state, 1000)

  // useEffect(() => {
  // }, []);


  useEffect(() => {
    window.localStorage.setItem( "eoi_state", JSON.stringify(getsavedstate(debouncedstate)) );
  }, [debouncedstate]);

  return (
    <AppContext.Provider value={[ state, dispatch ]}>
    	{ children }
    </AppContext.Provider>
  )
}