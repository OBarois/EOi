import React, {useRef} from 'react'
import { useGlobal } from 'reactn'

import './App.css'
import Earth from '../earth'
import { useHotkeys } from 'react-hotkeys-hook'
import ControlPanel from "../controlpanel"
import MissionSelectorContainer from "../../containers/MissionSelectorContainer"
import MapSelectorContainer from "../../containers/MapSelectorContainer"
import ColorSelectorContainer from "../../containers/ColorSelectorContainer"
import AltitudeLabelContainer from "../../containers/AltitudeLabelContainer"

import DateManagerContainer from '../../containers/DateManagerContainer'
import useFullscreen from "@rooks/use-fullscreen"


function App() {
    
    

    const [ mission,  ] = useGlobal('mission');
    // const [ mapSettings, ] = useGlobal('mapSettings')

    const container = useRef();
    const {
        // isEnabled,
        toggle
        // onChange,
        // onError,
        // request,
        // exit,
        // isFullscreen,
        // element
    } = useFullscreen();

    useHotkeys("f", ()=>{toggle(container.current)} )  



    return (
        <div className="App" ref={container} id="container">
             {/* <FullScreen handle={fshandle}> */}
                <Earth id="globe" />
                {/* <DateManager startdate={startdate} onDateChange={changeDate} onFinalDateChange={finalChangeDate} animated={searching}/> */}
                <DateManagerContainer></DateManagerContainer>
                <AltitudeLabelContainer/>
                <ControlPanel active="true" >
                    {/* <div class='logo'><img  src='./images/ESA_logo_2020_White.png' height="40" ></img></div> */}
                    <div className='logo'><img alt='' src='./images/EOi_logo.png' height="150" ></img></div>
                
                    <MissionSelectorContainer></MissionSelectorContainer>
                    <MapSelectorContainer ></MapSelectorContainer>
                    <ColorSelectorContainer></ColorSelectorContainer>
                </ControlPanel>
                <div className='MissionLabel'>{mission}</div>
            {/* </FullScreen> */}
        </div>
    )
}

export default App;
