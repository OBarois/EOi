import React, { useEffect } from "react";
import { useGlobal } from 'reactn';

import { HuePicker, AlphaPicker } from 'react-color';
import './colorpicker.css'


// should use a prop

function ColorPicker({appcolor}) {


    const [ acolor, setAcolor ] = useState(appcolor);

    useEffect(() => {
        console.log('appcolor changed to: '+ mission)
    }, [appcolor]);
    
    const handleChangeComplete = (color) => {
        document.documentElement.style.setProperty('--color', color.hex);
        //setAppcolor(color.hex );
      };
    
    //console.log('mission rendering')
    return (
        <div className='ColorSelector'>
            <HuePicker color={acolor} onChangeComplete={handleChangeComplete }/>
            
            
        </div>
    )
    // <AlphaPicker />  
}

export default ColorPicker;
