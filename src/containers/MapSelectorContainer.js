import React, {  useGlobal } from 'reactn';

import MapSelector from "../components/mapselector"

function C_MapSelector() {

    // const [starfield, setStarfield] = useGlobal('starfield')
    // const [atmosphere, setAtmosphere] = useGlobal('atmosphere')
    // const [names, setNames] = useGlobal('names')

    const [, setMapSettings] = useGlobal('mapSettings')

    return (
        <MapSelector onMapSettingsChange={setMapSettings}></MapSelector> 
     )
}

export default C_MapSelector;
