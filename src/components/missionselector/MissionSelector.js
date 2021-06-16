import React, { useState, useEffect } from "react";
import {AppContext} from '../app/context'


import { useKey } from 'rooks'
import './MissionSelector.css'


// should use a prop

function MissionSelector() {

    const [ state, dispatch ] = React.useContext(AppContext)

    
    useKey(['1'],()=>dispatch({ type: "set_mission", value: 'S1'}))
    useKey(['2'],()=>dispatch({ type: "set_mission", value: 'S2'}))
    useKey(['3'],()=>dispatch({ type: "set_mission", value: 'S3/SLSTR'}))
    useKey(['5'],()=>dispatch({ type: "set_mission", value: 'S5P'}))
    useKey(['6'],()=>dispatch({ type: "set_mission", value: 'ENVISAT'}))

    return (
        <div className='MissionSelectorContainer'>
            <div className='MissionSelector'>
                <div className={(state.mission === 'S1')?'CircleButtonSelected':'CircleButton'}><img className='MissionIcon' src='./images/s1_black.png' alt='' onClick={() => dispatch({ type: "set_mission", value: 'S1'})} /></div>
                <div className={(state.mission === 'S1A')?'CircleButtonSelected':'CircleButton'}><img className='MissionIcon' src='./images/s1_black.png' alt='' onClick={() => dispatch({ type: "set_mission", value: 'S1A'})} /></div>
                <div className={(state.mission === 'S1B')?'CircleButtonSelected':'CircleButton'}><img className='MissionIcon' src='./images/s1_black.png' alt='' onClick={() => dispatch({ type: "set_mission", value: 'S1B'})} /></div>
                <div className={(state.mission === 'S2')?'CircleButtonSelected':'CircleButton'}><img className='MissionIcon' src='./images/s2_black.png' alt='' onClick={() => dispatch({ type: "set_mission", value: 'S2'})} /></div>
                <div className={(state.mission === 'S2A')?'CircleButtonSelected':'CircleButton'}><img className='MissionIcon' src='./images/s2_black.png' alt='' onClick={() => dispatch({ type: "set_mission", value: 'S2A'})} /></div>
                <div className={(state.mission === 'S2B')?'CircleButtonSelected':'CircleButton'}><img className='MissionIcon' src='./images/s2_black.png' alt='' onClick={() => dispatch({ type: "set_mission", value: 'S2B'})} /></div>
                <div className={(state.mission === 'S3')?'CircleButtonSelected':'CircleButton'}><img className='MissionIcon' src='./images/s3_black.png' alt='' onClick={() => dispatch({ type: "set_mission", value: 'S3'})} /></div>
                <div className={(state.mission === 'S3/SLSTR')?'CircleButtonSelected':'CircleButton'}><img className='MissionIcon' src='./images/s3_black.png' alt='' onClick={() => dispatch({ type: "set_mission", value: 'S3/SLSTR'})} /></div>
                <div className={(state.mission === 'S3A/OLCI/LFR')?'CircleButtonSelected':'CircleButton'}><img className='MissionIcon' src='./images/s3_black.png' alt='' onClick={() => dispatch({ type: "set_mission", value: 'S3A/OLCI/LFR'})} /></div>
                <div className={(state.mission === 'S3B/OLCI/LFR')?'CircleButtonSelected':'CircleButton'}><img className='MissionIcon' src='./images/s3_black.png' alt='' onClick={() => dispatch({ type: "set_mission", value: 'S3B/OLCI/LFR'})} /></div>
                <div className={(state.mission === 'S3A/OLCI/RBT')?'CircleButtonSelected':'CircleButton'}><img className='MissionIcon' src='./images/s3_black.png' alt='' onClick={() => dispatch({ type: "set_mission", value: 'S3A/OLCI/RBT'})} /></div>
                <div className={(state.mission === 'S3B/OLCI/RBT')?'CircleButtonSelected':'CircleButton'}><img className='MissionIcon' src='./images/s3_black.png' alt='' onClick={() => dispatch({ type: "set_mission", value: 'S3B/OLCI/RBT'})} /></div>
                <div className={(state.mission === 'S3/SRAL')?'CircleButtonSelected':'CircleButton'}><img className='MissionIcon' src='./images/s3_black.png' alt='' onClick={() => dispatch({ type: "set_mission", value: 'S3/SRAL'})} /></div>
                <div className={(state.mission === 'S5P')?'CircleButtonSelected':'CircleButton'}><img className='MissionIcon' src='./images/s5p_black.png' alt='' onClick={() => dispatch({ type: "set_mission", value: 'S5P'})} /></div>
                <div className={(state.mission === 'ENVISAT/MERIS/FRS')?'CircleButtonSelected':'CircleButton'}><img className='MissionIcon' src='./images/s5p_black.png' alt='' onClick={() => dispatch({ type: "set_mission", value: 'ENVISAT/MERIS/FRS'})}/></div>
                <div className={(state.mission === 'ENVISAT')?'CircleButtonSelected':'CircleButton'}><img className='MissionIcon' src='./images/s5p_black.png' alt='' onClick={() => dispatch({ type: "set_mission", value: 'ENVISAT'})} /></div>
            </div>   
        </div>
    )
}

export default MissionSelector;
