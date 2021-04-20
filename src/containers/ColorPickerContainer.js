import React, {  useGlobal } from 'reactn';

import ColorPicker from "../components/colorpicker"

function C_ColorPicker() {

    // const [starfield, setStarfield] = useGlobal('starfield')
    // const [atmosphere, setAtmosphere] = useGlobal('atmosphere')
    // const [names, setNames] = useGlobal('names')

    const [color, setColor] = useGlobal('appcolor')

    return (
        <ColorPicker onMapSettingsChange={setMapSettings}></ColorPicker> 
     )
}

export default C_ColorPicker;
