
import React, { useEffect } from "react";
import { useGlobal } from 'reactn';

// import { HuePicker } from 'react-color';
import './DemSelector.css'
import Switch from "react-switch";
// import "react-colorful/dist/index.css";


function DemSelectorContainer() {


    const [ mapset, setmapset ] = useGlobal('mapSettings');

    
    const handleDemChange = (checked) => {
        setmapset({...mapset, dem:checked})
      };
      const handleSatChange = (checked) => {
        setmapset({...mapset, satellites:checked})
      };
      const handleStarfieldChange = (checked) => {
        setmapset({...mapset, starfield:checked})
      };
      const handleAtmosphereChange = (checked) => {
        setmapset({...mapset, atmosphere:checked})
      };
    
    //console.log('mission rendering')
    return (
        <div className='DemSelector verticalContainer'>
            <div className='Selector horizontalContainer'>
                <Switch id='2' onChange={handleSatChange} checked={mapset.satellites} />
                <span className='Label'>Satellites</span>
            </div>
            <div className='Selector horizontalContainer'>
              <Switch id='1' onChange={handleDemChange} checked={mapset.dem} />
                <span className='Label'>Copernicus DEM</span>
            </div>
            <div className='Selector horizontalContainer'>
              <Switch id='1' onChange={handleStarfieldChange} checked={mapset.starfield} />
                <span className='Label'>Stars and Planets</span>
            </div>
            <div className='Selector horizontalContainer'>
              <Switch id='1' onChange={handleAtmosphereChange} checked={mapset.atmosphere} />
                <span className='Label'>Sun and Atmosphere</span>
            </div>
        </div>
    )
    // <AlphaPicker />  
}

export default DemSelectorContainer;



