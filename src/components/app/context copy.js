import React from "react"
import { reducer } from "./reducer"
import {  initstate, getsavedstate } from "./initstate"
import  { useEffect } from "react";
import { useDebounce } from '../../hooks/useDebounce'
import JSONCrush from "jsoncrush"

export const AppContext = React.createContext({
  state: initstate(),
  dispatch: () => null
})

let istate = initstate()

export const AppProvider = ({ children }) => {

 

  const [state, dispatch] = React.useReducer(reducer, istate)

  const debouncedstate = useDebounce(state, 1000)

  // useEffect(() => {
  // }, []);


  useEffect(() => {
    // console.log('saving session')
    // let savedstate = {
    //   mission: debouncedstate.mission,
    //   altitude: debouncedstate.altitude,
    //   appColor: debouncedstate.appColor,
    //   position: debouncedstate.position,
    //   animated: debouncedstate.animated,
    //   mapSettings: debouncedstate.mapSettings,
    //   viewDate: debouncedstate.viewDate,
    //   searchDate: debouncedstate.searchDate,
    //   goToDate: debouncedstate.goToDate,
    //   credentials: debouncedstate.credentials,
    //   leftHanded: debouncedstate.leftHanded

    // }

    let savedstate = getsavedstate(debouncedstate)
    // console.log(savedstate)

    // let eoi_state = encodeURIComponent(JSONCrush.crush(savedstate))
    // let eoi_state = JSONCrush.crush(JSON.stringify(savedstate))
    window.localStorage.setItem( "eoi_state", JSON.stringify(savedstate) );
  }, [debouncedstate]);

  return (
    <AppContext.Provider value={[ state, dispatch ]}>
    	{ children }
    </AppContext.Provider>
  )
}