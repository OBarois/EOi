import React, {useEffect, useState} from 'react';
import { useClock } from "./useClock"
import { useHotkeys } from 'react-hotkeys-hook'


import './DateController.css';

function DateController({startdate, onDateChange}) {

    // useClock must be redone to support real time increments
    const {
        date,
        // playing,
        togglePause,
        reset,
        increaseSpeed,
        decreaseSpeed,
        // forceDate
    } = useClock({
        autoStart: false,
        initdate: startdate
    })



    useHotkeys("t",togglePause)
    useHotkeys("r",()=>{reset() })
    useHotkeys(".",increaseSpeed)
    useHotkeys(",",decreaseSpeed)

    


    useEffect(() => {
        // console.log("date from useClock: "+new Date(date).toJSON())
        onDateChange(date)
        //forceDate(date)
        //setAppdate({appdate: new Date(date)})
    },[date]);

    // useEffect(() => {
    //     // console.log("date from datemanager: "+new Date(date).toJSON())
    //     // forceDate(startdate)
    //     //forceDate(date)
    //     //setAppdate({appdate: new Date(date)})
    // },[startdate]);

    const [lastTap, setLasttap] = useState()
    const handleDoubleTap = () => {
        const now = Date.now();
        if (lastTap && (now - lastTap) < 400) {
          reset();
        } else {
            setLasttap(now)
            togglePause()
        }
      }


    return (
        <div className='DateController' onClick={handleDoubleTap}/>
    )
}
export default DateController
