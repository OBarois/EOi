import React from "react"
import { reducer, initialState } from "./reducer"

export const AppContext = React.createContext({
  state: initialState,
  dispatch: () => null
})

export const AppProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState)

  return (
    <AppContext.Provider value={[ state, dispatch ]}>
    	{ children }
    </AppContext.Provider>
  )
}