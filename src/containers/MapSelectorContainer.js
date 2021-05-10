import React, {  useGlobal } from 'reactn';

import MapSelector from "../components/mapselector"

function MapSelectorContainer() {

    // const [starfield, setStarfield] = useGlobal('starfield')
    // const [atmosphere, setAtmosphere] = useGlobal('atmosphere')
    // const [names, setNames] = useGlobal('names')

    const [mapSettings, setMapSettings] = useGlobal('mapSettings')

    return (
        <MapSelector mapSettings={mapSettings} onMapSettingsChange={setMapSettings}></MapSelector> 
     )
}

export default MapSelectorContainer;
