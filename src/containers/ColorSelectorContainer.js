
import React, { useEffect } from "react";
import { useGlobal } from 'reactn';

// import { HuePicker } from 'react-color';
import './ColorSelector.css'
import { HexColorPicker } from "react-colorful";
// import "react-colorful/dist/index.css";


function ColorSelectorContainer() {


    const [ appcolor, setAppcolor ] = useGlobal('appColor');

    useEffect(() => {
        console.log('color: '+appcolor)
        document.documentElement.style.setProperty('--color', appcolor);
        document.documentElement.style.setProperty('--colort', appcolor+'66');
    }, [appcolor]);
    
    const handleChangeComplete = (color) => {
        if(!color) return
        console.log('set color: '+color)
        document.documentElement.style.setProperty('--color', color);
         
        document.documentElement.style.setProperty('--colort', color+'66');
        setAppcolor(color.hex );
      };
    
    //console.log('mission rendering')
    return (
        <div className='ColorSelector'>
            <HexColorPicker color={appcolor} onChange={handleChangeComplete}/>
        </div>
    )
    // <AlphaPicker />  
}

export default ColorSelectorContainer;



