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
        console.log(mapSet)
    }, [mapSet, onMapSettingsChange]);


    
    //console.log('mission rendering')
    return (
        <div className='MapSelector'>
            <div className='CircleButton'><img className={(mapSettings.atmosphere)?'MapIcon':'MapIconSelected'} draggable="false" src='./images/atmosphere.png' alt='' onClick={toggleAtmosphere} /></div>
            <div className='CircleButton'><img className='MapIcon' draggable="false" src='./images/starfield.png' alt='' onClick={toggleStarfield} /></div>
            <div className='CircleButton'><img className='MapIcon' draggable="false" src='./images/names.png' alt='' onClick={toggleNames} /></div>
            <div className='CircleButton'><img className='MapIcon' draggable="false" src='./images/names.png' alt='' onClick={toggleBg} /></div>
           
        </div>
    )
}

export default MapSelector;
