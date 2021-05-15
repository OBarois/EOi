import React, {useEffect, useState} from 'react';
import { useClock } from "./useClock"
import { useHotkeys } from 'react-hotkeys-hook'
import { Icon } from '@iconify/react'

// npm install --save-dev @iconify/react @iconify-icons/ic
import roundFastForward from '@iconify-icons/ic/round-fast-forward';
import roundFastRewind from '@iconify-icons/ic/round-fast-rewind';

import roundPlayArrow from '@iconify-icons/ic/round-play-arrow';




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
        forceDate
    } = useClock({
        autoStart: false,
        initdate: startdate
    })



    useHotkeys("t",togglePause)
    useHotkeys("r",()=>{reset() })
    useHotkeys(".",increaseSpeed)
    useHotkeys(",",decreaseSpeed)

    


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
    const handleDoubleTap = () => {
        const now = Date.now();
        if (lastTap && (now - lastTap) < 400) {
          reset();
        } else {
            setLasttap(now)
            togglePause()
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
