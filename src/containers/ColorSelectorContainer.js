
import React, { useEffect } from "react";
import {AppContext} from '../components/app/context'

import './ColorSelector.css'
import { HexColorPicker } from "react-colorful";

function ColorSelectorContainer() {


    const [ state, dispatch ] = React.useContext(AppContext)


    useEffect(() => {
        document.documentElement.style.setProperty('--color', state.appColor);
        document.documentElement.style.setProperty('--colort', state.appColor+'66');
    }, [state.appColor]);
    
    const handleChangeComplete = (color) => {
        if(color !== null) dispatch({type: 'set_color', value: color})
        // document.documentElement.style.setProperty('--color', color);
         
        // document.documentElement.style.setProperty('--colort', color+'66');
        // setappColor(color );
        // console.log(appColor)

      };

      useEffect(() => {
        document.documentElement.style.setProperty('--color', state.appColor);
        document.documentElement.style.setProperty('--colort', state.appColor+'66');
    }, []);

    
    //console.log('mission rendering')
    return (
        <div className='ColorSelector'>
            <HexColorPicker color={state.appColor} onChange={handleChangeComplete} style={{height:'150px', width:'140px'}}/>
        </div>
    )
    // <AlphaPicker />  
}

export default ColorSelectorContainer;



