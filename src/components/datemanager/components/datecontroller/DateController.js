import React, {useEffect, useState} from 'react';
import { useClock } from "./useClock"
import { useKey } from 'rooks'
import { Icon } from '@iconify/react'

// npm install --save-dev @iconify/react @iconify-icons/ic
import roundFastForward from '@iconify-icons/ic/round-fast-forward';
import roundFastRewind from '@iconify-icons/ic/round-fast-rewind';

import roundPlayArrow from '@iconify-icons/ic/round-play-arrow';

import useHandleDoubleTap from '../../../../hooks/useHandleDoubleTap'




import './DateController.css';

function DateController({startdate, onDateChange, onStateChange, animated}) {

    // useClock must be redone to support real time increments
    const {
        date,
        speed,
        start,
        stop,
        reset,
        increaseSpeed,
        decreaseSpeed,
        forceDate
    } = useClock({
        initdate: startdate
    })

    const [playing, setplaying ] = useState(animated) 

    useKey(["t"],()=>{setplaying((state)=>!state) })
    useKey(["r"],()=>{reset() })
    useKey(["."],()=>{increaseSpeed() })
    useKey([","],()=>{decreaseSpeed() })

    
    useEffect(() => {
        onStateChange(playing)
        if(playing === true) {
            start()
         } else stop()
    },[playing]);

    useEffect(() => {
        console.log('animated: '+animated)
    },[animated]);

    useEffect(() => {
        // console.log("date from useclock :"+date)
        onDateChange(date)
        //forceDate(date)
        //setAppdate({appdate: new Date(date)})
    },[date,onDateChange]);

    useEffect(() => {
        console.log(" force date: "+startdate)
        if(startdate !== null) forceDate(startdate)
        
        //forceDate(date)
        //setAppdate({appdate: new Date(date)})
    },[startdate]);

    const {handleTap} = useHandleDoubleTap(()=>{setplaying((state)=>!state)}, reset)

//     <div className='buttoncontainer'>
//     <Icon icon={roundFastRewind} onClick={decreaseSpeed} className='smallcontrolbutton shadow' style={{display:playing?'block':'none'}}/>
// </div>
// <div className='buttoncontainer'>
//     <Icon icon={roundPlayArrow} onClick={handleTap} className='controlbutton shadow'/>
// </div>
// <div className='buttoncontainer'>
//     <Icon icon={roundFastForward} onClick={increaseSpeed} className='smallcontrolbutton shadow' style={{display:playing?'block':'none'}}/>
// </div>


    return (
        <div className='DateController ' >
                <Icon icon={roundFastRewind} onClick={decreaseSpeed} className='smallcontrolbutton shadow' style={{display:playing?'block':'none'}}/>
                <div className={speed>0?'':'flipped'}>
                    <Icon icon={roundPlayArrow} onClick={handleTap} className='controlbutton shadow'/>
                </div>
                <span className='Speed' style={{display:playing?'block':'none'}}>x{Math.abs(speed)}</span>
                <Icon icon={roundFastForward} onClick={increaseSpeed} className='smallcontrolbutton shadow' style={{display:playing?'block':'none'}}/>
        </div>
    )
}
export default DateController


