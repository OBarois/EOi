import React from "react";
import {AppContext} from '../app/context'
import { Icon } from '@iconify/react';
import roundLayers from '@iconify/icons-ic/round-layers';
import twotoneLayers from '@iconify/icons-ic/twotone-layers';
import baselineBlurOn from '@iconify/icons-ic/baseline-blur-on';
import baselineExplore from '@iconify/icons-ic/baseline-explore';


import './MapSelector.css'


// should use a prop

function MapSelector() {

    const [ state, dispatch ] = React.useContext(AppContext)

    const toggleAtmosphere = () => dispatch({ type: "toggle_atmosphere" })
    const toggleStarfield = () => dispatch({ type: "toggle_starfield" })
    const toggleNames = () => dispatch({ type: "toggle_names" })
    const toggleOverlay = () => dispatch({ type: "toggle_overlay" })
    const toggleBg = () => dispatch({ type: "toggle_background" })
    const togglePr = () => dispatch({ type: "toggle_projection" })


    
    //console.log('mission rendering')
    return (
        <div className='MapSelectorContainer'>
            <div className='MapSelector'>
                <div className={(state.mapSettings.atmosphere)?'CircleButtonSelected':'CircleButton'}><img className='MapIcon' draggable="false" src='./images/atmosphere.png' alt='' onClick={toggleAtmosphere} /></div>
                <div className={(state.mapSettings.starfield)?'CircleButtonSelected':'CircleButton'}><img className='MapIcon' draggable="false" src='./images/starfield.png' alt='' onClick={toggleStarfield} /></div>
                {/* <div className={(state.mapSettings.names)?'CircleButtonSelected':'CircleButton'}><Icon icon={baselineExplore}  onClick={toggleNames} width='50px'/></div> */}
                <div className='CircleButton'><Icon icon={roundLayers}  onClick={toggleBg} width='50px'/></div>
                <div className='CircleButton'><Icon icon={twotoneLayers}  onClick={toggleOverlay} width='50px'/></div>
                <div className='CircleButton'><Icon icon={baselineBlurOn}  onClick={togglePr} width='50px'/></div>

                
                {/* <div className={(state.mapSettings.names)?'CircleButtonSelected':'CircleButton'}><img className='MapIcon' draggable="false" src='./images/names.png' alt='' onClick={toggleNames} /></div> */}
                {/* <div className='CircleButton'><img className='MapIcon' draggable="false" src='./images/names.png' alt='' onClick={toggleBg} /></div> */}
                {/* <div className='CircleButton'><img className='MapIcon' draggable="false" src='./images/names.png' alt='' onClick={toggleOverlay} /></div> */}
                {/* <div className='CircleButton'><img className='MapIcon' draggable="false" src='./images/names.png' alt='' onClick={togglePr} /></div> */}
            </div>
        </div>
    )
}

export default MapSelector;
