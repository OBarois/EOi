
import React from "react";
import {AppContext} from '../app/context'

import './OptionsSelector.css'
import Switch from "react-switch";

function OptionsSelector() {

    const [ state, dispatch ] = React.useContext(AppContext)

    
    const handleDemChange = (checked) => {
      dispatch({ type: "set_dem", value: checked})
    }
    const handleSatChange = (checked) => {
      dispatch({ type: "toggle_satellites" })
    }
    const handleStarfieldChange = (checked) => {
      dispatch({ type: "toggle_starfield"})
    }
    const handleAtmosphereChange = (checked) => {
      dispatch({ type: "toggle_atmosphere"})
    }
    const handleQuicklooksChange = (checked) => {
      dispatch({ type: "toggle_quicklooks"})
    }
    
    const handleLeftHanded = (checked) => {
      dispatch({ type: "toggle_lefthanded"})
    }
    
    //console.log('mission rendering')
    return (
        <div className='DemSelectorContainer'>
          <div className='verticalContainer DemSelector' >
            <div className='Selector horizontalContainer'>
                <Switch id='satellites' onChange={handleSatChange} checked={state.mapSettings.satellites} />
                <span className='Label'>Satellites</span>
            </div>
            <div className='Selector horizontalContainer'>
              <Switch id='dem' onChange={handleDemChange} checked={state.mapSettings.dem} />
                <span className='Label'>Copernicus DEM</span>
            </div>
            <div className='Selector horizontalContainer'>
              <Switch id='starfield' onChange={handleStarfieldChange} checked={state.mapSettings.starfield} />
                <span className='Label'>Stars and Planets</span>
            </div>
            <div className='Selector horizontalContainer'>
              <Switch id='atmosphere' onChange={handleAtmosphereChange} checked={state.mapSettings.atmosphere} />
                <span className='Label'>Sun and Atmosphere</span>
            </div>
            <div className='Selector horizontalContainer'>
              <Switch id='quicklooks' onChange={handleQuicklooksChange} checked={state.mapSettings.quicklooks} />
                <span className='Label'>Quicklooks</span>
            </div>
            <div className='Selector horizontalContainer'>
              <Switch id='lefthanded' onChange={handleLeftHanded} checked={state.leftHanded} />
                <span className='Label'>Left Handed UI</span>
            </div>
            <div height='200px' flexgrow='2'>&nbsp;</div>
          </div>
        </div>
    )
}

export default OptionsSelector



