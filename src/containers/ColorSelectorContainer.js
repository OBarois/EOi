
import React, { useEffect } from "react";
import { useGlobal } from 'reactn';

import { HuePicker } from 'react-color';
import './ColorSelector.css'


function ColorSelectorContainer() {


    const [ appcolor, setAppcolor ] = useGlobal('appColor');

    // useEffect(() => {
    //     console.log('Mission changed to: '+ mission)
    // }, [mission]);
    
    const handleChangeComplete = (color) => {
        document.documentElement.style.setProperty('--color', color.hex);
        //setAppcolor(color.hex );
      };
    
    //console.log('mission rendering')
    return (
        <div className='ColorSelector'>
            <HuePicker color={appcolor} onChangeComplete={handleChangeComplete }/>
        </div>
    )
    // <AlphaPicker />  
}

export default ColorSelectorContainer;



