import React, { useState, useEffect } from "react";

import { useHotkeys } from 'react-hotkeys-hook';
import './MapSelector.css'


// should use a prop

function MapSelector({onMapSettingsChange}) {


    const [mapSettings, setMapSettings] = useState({starfield: true, names: true, atmosphere: true})
    const toggleAtmosphere = () => setMapSettings((mapSettings)=>({...mapSettings, atmosphere:!mapSettings.atmosphere}))
    const toggleStarfield = () => setMapSettings((mapSettings)=>({...mapSettings, starfield:!mapSettings.starfield}))
    const toggleNames = () => setMapSettings((mapSettings)=>({...mapSettings, names:!mapSettings.names}))
    const toggleBg = () => setMapSettings((mapSettings)=>({...mapSettings, background:Math.random()}))

    useHotkeys("a",toggleAtmosphere)  
    useHotkeys("s",toggleStarfield)  
    useHotkeys("n",toggleNames)  

    useEffect(() => {
        onMapSettingsChange(mapSettings)
        console.log(mapSettings)
    }, [mapSettings, onMapSettingsChange]);


    
    //console.log('mission rendering')
    return (
        <div className='MapSelector'>
            <div className='CircleButton'><img className='MapIcon' draggable="false" src='./images/atmosphere.png' alt='' onClick={toggleAtmosphere} /></div>
            <div className='CircleButton'><img className='MapIcon' draggable="false" src='./images/starfield.png' alt='' onClick={toggleStarfield} /></div>
            <div className='CircleButton'><img className='MapIcon' draggable="false" src='./images/names.png' alt='' onClick={toggleNames} /></div>
            <div className='CircleButton'><img className='MapIcon' draggable="false" src='./images/names.png' alt='' onClick={toggleBg} /></div>
           
        </div>
    )
}

export default MapSelector;
