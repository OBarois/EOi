import React, {useEffect, useState, useRef} from 'react';
import { useClock } from "./useClock"
import { useHotkeys } from 'react-hotkeys-hook'
import { Icon } from '@iconify/react'

// npm install --save-dev @iconify/react @iconify-icons/ic
import roundFastForward from '@iconify-icons/ic/round-fast-forward';
import roundFastRewind from '@iconify-icons/ic/round-fast-rewind';

import roundPlayArrow from '@iconify-icons/ic/round-play-arrow';




import './DateController.css';

function DateController({startdate, onDateChange, onStateChange}) {

    // useClock must be redone to support real time increments
    const {
        date,
        togglePause,
        start,
        stop,
        reset,
        increaseSpeed,
        decreaseSpeed,
        forceDate
    } = useClock({
        autoStart: false,
        initdate: startdate
    })

    const [playing, setplaying ] = useState(false) 

    useHotkeys("t",()=>{setplaying((state)=>!state) })
    useHotkeys("r",()=>{reset() })
    useHotkeys(".",()=>{increaseSpeed() })
    useHotkeys(",",()=>{decreaseSpeed() })

    
    useEffect(() => {
        onStateChange(playing)
        if(playing === true) {
            start()
         } else stop()
    },[playing]);

    // useEffect(() => {
    //     console.log('weird')
    // },[togglePause]);

    useEffect(() => {
        // console.log("date from useclock :"+date)
        onDateChange(date)
        //forceDate(date)
        //setAppdate({appdate: new Date(date)})
    },[date, onDateChange]);

    // useEffect(() => {
    //     console.log(" force date: "+startdate)
    //     // forceDate(startdate)
    //     //forceDate(date)
    //     //setAppdate({appdate: new Date(date)})
    // },[startdate]);

    const [lastTap, setLasttap] = useState()
    const clicktimeout = useRef()
    const handleDoubleTap = () => {
        const now = Date.now();
        if (lastTap && (now - lastTap) < 300) {
            clearTimeout(clicktimeout.current)   
            reset();
        } else {
            setLasttap(now)    
            clicktimeout.current = setTimeout(() => {
                setplaying((state)=>!state)
            }, 300);
        }
      }


    //   <div className='DateController' onClick={handleDoubleTap}>


    return (
        <div className='DateController' >
            <div className='buttoncontainer'>
                <Icon icon={roundFastRewind} onClick={decreaseSpeed} className='controlbuttons'/>
                <Icon icon={roundPlayArrow} onClick={handleDoubleTap} className='controlbuttons'/>
                <Icon icon={roundFastForward} onClick={increaseSpeed} className='controlbuttons'/>
            </div>
        </div>
    )
}
export default DateController
