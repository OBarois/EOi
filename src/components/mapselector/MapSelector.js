import React, { useState, useEffect } from "react";

import './MapSelector.css'


// should use a prop

function MapSelector({mapSettings, onMapSettingsChange}) {


    const [mapSet, setMapSet] = useState(mapSettings)

    const toggleAtmosphere = () => setMapSet((mapSet)=>({...mapSet, atmosphere:!mapSet.atmosphere}))
    const toggleStarfield = () => setMapSet((mapSet)=>({...mapSet, starfield:!mapSet.starfield}))
    const toggleNames = () => setMapSet((mapSet)=>({...mapSet, names:!mapSet.names}))
    const toggleBg = () => setMapSet((mapSet)=>({...mapSet, background:Math.random()}))


    useEffect(() => {
        onMapSettingsChange(mapSet)
    }, [mapSet]);

    useEffect(() => {
        setMapSet(mapSettings)
    }, [mapSettings]);


    
    //console.log('mission rendering')
    return (
        <div className='MapSelector'>
            <div className={(mapSettings.atmosphere)?'CircleButtonSelected':'CircleButton'}><img className='MapIcon' draggable="false" src='./images/atmosphere.png' alt='' onClick={toggleAtmosphere} /></div>
            <div className={(mapSettings.starfield)?'CircleButtonSelected':'CircleButton'}><img className='MapIcon' draggable="false" src='./images/starfield.png' alt='' onClick={toggleStarfield} /></div>
            <div className={(mapSettings.names)?'CircleButtonSelected':'CircleButton'}><img className='MapIcon' draggable="false" src='./images/names.png' alt='' onClick={toggleNames} /></div>
            <div className='CircleButton'><img className='MapIcon' draggable="false" src='./images/names.png' alt='' onClick={toggleBg} /></div>
           
        </div>
    )
}

export default MapSelector;
