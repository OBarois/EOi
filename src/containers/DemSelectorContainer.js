
import React, { useEffect } from "react";
import { useGlobal } from 'reactn';

// import { HuePicker } from 'react-color';
import './DemSelector.css'
import Switch from "react-switch";
// import "react-colorful/dist/index.css";


function DemSelectorContainer() {


    const [ mapset, setmapset ] = useGlobal('mapSettings');

    
    const handleChange = (checked) => {
        setmapset({...mapset, dem:checked})
      };
    
    //console.log('mission rendering')
    return (
        <div className='DemSelector horizontalContainer'>
            <Switch onChange={handleChange} checked={mapset.dem} />
            <span>Copernicus DEM</span>
        </div>
    )
    // <AlphaPicker />  
}

export default DemSelectorContainer;



