import React from "react"
import { reducer, initialState } from "./reducer"
import  { useState, useEffect, useRef } from "react";
import { useDebounce } from '../../hooks/useDebounce'

export const AppContext = React.createContext({
  state: initialState,
  dispatch: () => null
})

export const AppProvider = ({ children }) => {

    // let savedState = JSON.parse(window.sessionStorage.getItem("eoi_state"))
    // console.log(savedState)
  const [state, dispatch] = React.useReducer(reducer, initialState)

  const debouncedstate = useDebounce(state, 1000)

  // useEffect(() => {
  // }, []);


  // useEffect(() => {
  //   console.log('saving session')
  //   let savedstate = Object.assign({}, debouncedstate)
  //   delete  savedstate.selectedProduct
  //   delete  savedstate.closestItem
    

  //   window.sessionStorage.setItem("eoi_state", JSON.stringify(savedstate));
  // }, [debouncedstate]);

  return (
    <AppContext.Provider value={[ state, dispatch ]}>
    	{ children }
    </AppContext.Provider>
  )
}