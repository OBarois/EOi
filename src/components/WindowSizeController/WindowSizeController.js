import React from 'react';
import {AppContext} from '../app/context'
import Slider from '@mui/material/Slider'
import './WindowSizeController.css' 
import { useKey } from 'rooks'
import { useRef } from 'react';




export default function WindowSizeController() {

    const [ state, dispatch ] = React.useContext(AppContext)

    useKey(["="],()=>handleSliderChange(state.searchWindow + 1000 * 60 * 60 * 24))
    useKey(["-"],()=>handleSliderChange(state.searchWindow - 1000 * 60 * 60 * 24))

    const handleSliderChange = (event) => {
        // console.log(event)
        let day = 1000 * 60 * 60 * 24
        let value = typeof event ==="number"?Math.max(event,1000 * 60 * 60 * 24):event.target.value
        // let startdate = Math.floor((state.searchDate - (event.target.value/2))/day) * day
        // let enddate = Math.floor((state.searchDate + (event.target.value/2))/day) * day

        let searchWinDay = Math.floor(value / day) * day
        // console.log(searchWinDay/day)

        let startdate = Math.floor(state.searchDate/searchWinDay) * searchWinDay
        let enddate = startdate + searchWinDay


        dispatch({ type: "set_searchWindow", value: {win: value, wins: startdate, wine: enddate} })
    }

    // useEffect(() => {
    //     console.log(state.searchwindow)

    //     let collection= getcollection(state.dataset)
    //     console.log(collection)
    //     inputRef.current.value = collection.defaultFreetext?collection.defaultFreetext:collection.code
    // }, [state.searchwindow])



    return (
        // <Box sx={{ width: 300 }}>

        <Slider className='Slider'
            min = {1000 * 60 * 60 * 24}
            max = {1000 * 60 * 60 * 24 * 100}
            aria-label="Search Window"
            // defaultValue={state.searchWindow?state.searchwindow:1000 * 60 * 60 * 24}
            value={typeof state.searchWindow === 'number' ? state.searchWindow : 1000 * 60 * 60 * 24}
            // defaultValue = {1000 * 60 * 60 * 24}
            // getAriaValueText={valuetext}
            onChange={handleSliderChange}
            color="secondary"
      />
    // </Box>

    );
}