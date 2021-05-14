import React, { useState, useEffect } from "react";

import { useHotkeys } from 'react-hotkeys-hook';
import './MissionSelector.css'


// should use a prop

function MissionSelector({initialmission, onMissionChange}) {


    const [mission, setMission] = useState(initialmission)
    const [collection, setcollection] = useState(initialmission)
    
    useHotkeys("1",()=>{setMission('S1')}) 
    useHotkeys("2",()=>{setMission('S2')}) 
    useHotkeys("3",()=>{setMission('S3/SLSTR')}) 
    useHotkeys("5",()=>{setMission('S5P')}) 
    useHotkeys("6",()=>{setMission('ENVISAT')})

    useEffect(() => {
        onMissionChange(mission)
    }, [mission]);
    
    return (
        <div className='MissionSelectorContainer'>
            <div className='MissionSelector'>
                <div className={(mission == 'S1')?'CircleButtonSelected':'CircleButton'}><img className='MissionIcon' src='./images/s1_black.png' alt='' onClick={() => setMission('S1')} /></div>
                <div className={(mission == 'S2')?'CircleButtonSelected':'CircleButton'}><img className='MissionIcon' src='./images/s2_black.png' alt='' onClick={() => setMission('S2')} /></div>
                <div className={(mission == 'S3')?'CircleButtonSelected':'CircleButton'}><img className='MissionIcon' src='./images/s3_black.png' alt='' onClick={() => setMission('S3')} /></div>
                <div className={(mission == 'S3/SLSTR')?'CircleButtonSelected':'CircleButton'}><img className='MissionIcon' src='./images/s3_black.png' alt='' onClick={() => setMission('S3/SLSTR')} /></div>
                <div className={(mission == 'S3/OLCI')?'CircleButtonSelected':'CircleButton'}><img className='MissionIcon' src='./images/s3_black.png' alt='' onClick={() => setMission('S3/OLCI')} /></div>
                <div className={(mission == 'S3/SRAL')?'CircleButtonSelected':'CircleButton'}><img className='MissionIcon' src='./images/s3_black.png' alt='' onClick={() => setMission('S3/SRAL')} /></div>
                <div className={(mission == 'S5P')?'CircleButtonSelected':'CircleButton'}><img className='MissionIcon' src='./images/s5p_black.png' alt='' onClick={() => setMission('S5P')} /></div>
                <div className={(mission == 'ENVISAT')?'CircleButtonSelected':'CircleButton'}><img className='MissionIcon' src='./images/s5p_black.png' alt='' onClick={() => setMission('ENVISAT')} /></div>
            </div>   
        </div>
    )
}

export default MissionSelector;
