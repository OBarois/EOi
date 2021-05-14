import React, { useState, useEffect } from "react";

import { useHotkeys } from 'react-hotkeys-hook';
import './MissionSelector.css'


// should use a prop

function MissionSelector({mission, onMissionChange}) {


    // const [mission, setMission] = useState(initialmission)
    
    useHotkeys("1",()=>{onMissionChange('S1')}) 
    useHotkeys("2",()=>{onMissionChange('S2')}) 
    useHotkeys("3",()=>{onMissionChange('S3')}) 
    useHotkeys("5",()=>{onMissionChange('S5P')}) 
    useHotkeys("6",()=>{onMissionChange('ENVISAT')})

    // useEffect(() => {
    //     console.log('Mission changed to: '+ mission)
    //     onMissionChange(mission)
    // }, [mission]);
    
    
    //console.log('mission rendering')
    return (
        <div className='MissionSelector'>
            <div className={({mission} == 'S1')?'CircleButtonSelected':'CircleButton'}><img className='MissionIcon' src='./images/s1_black.png' alt='' onClick={() => onMissionChange('S1')} /></div>
            <div className={({mission} == 'S2')?'CircleButtonSelected':'CircleButton'}><img className='MissionIcon' src='./images/s2_black.png' alt='' onClick={() => onMissionChange('S2')} /></div>
            <div className={({mission} == 'S3')?'CircleButtonSelected':'CircleButton'}><img className='MissionIcon' src='./images/s3_black.png' alt='' onClick={() => onMissionChange('S3')} /></div>
            <div className={({mission} == 'S5P')?'CircleButtonSelected':'CircleButton'}><img className='MissionIcon' src='./images/s5p_black.png' alt='' onClick={() => onMissionChange('S5P')} /></div>
           
            
        </div>
    )
}

export default MissionSelector;
