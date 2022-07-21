import React, {useEffect, useState } from 'react';
import { useClock } from "./useClock"
import { useKey } from 'rooks'
import { Icon } from '@iconify/react'

// npm install --save-dev @iconify/react @iconify-icons/ic
import roundFastForward from '@iconify-icons/ic/round-fast-forward';
import roundFastRewind from '@iconify-icons/ic/round-fast-rewind';

import roundPlayArrow from '@iconify-icons/ic/round-play-arrow';
import roundPause from '@iconify-icons/ic/round-pause';

import useHandleDoubleTap from '../../../../hooks/useHandleDoubleTap'




import './DateController.css';

function DateController({startdate, onDateChange, onStateChange, animated, lefthanded}) {

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
    },[playing, onStateChange, start, stop]);

    useEffect(() => {
        console.log('animated: '+animated)
    },[animated]);

    // useEffect(() => {
    //     console.log('lefthanded: '+lefthanded)
    // },[lefthanded]);

    useEffect(() => {
        // console.log("date from useclock :"+date)
        onDateChange(date)
        //forceDate(date)
        //setAppdate({appdate: new Date(date)})
    },[date, onDateChange]);

    useEffect(() => {
        // console.log(" force date: "+startdate)
        if(startdate !== null) forceDate(startdate)
        
        //forceDate(date)
        //setAppdate({appdate: new Date(date)})
    },[startdate, forceDate]);

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
        <div className={lefthanded?'DateControllerL':'DateController'} >
                <div className={speed>0?'controlbutton shadow':'controlbutton shadow flipped'}>
                    <Icon icon={playing?roundPause:roundPlayArrow} onClick={handleTap} className='controlbutton shadow'/>
                </div>
                <div className={lefthanded?'speedbarL':'speedbar'}>
                    <Icon icon={roundFastRewind} onClick={decreaseSpeed} className='smallcontrolbutton shadow Backward' style={{display:playing?'block':'none'}}/>
                    <span className='Speed' style={{display:playing?'block':'none'}}>x{Math.abs(speed)}</span>
                    <Icon icon={roundFastForward} onClick={increaseSpeed} className='smallcontrolbutton shadow Forward' style={{display:playing?'block':'none'}}/>
                </div>
        </div>
    )
}
export default DateController


