import React, {useRef} from 'react'
import { useGlobal } from 'reactn'

import './App.css'
import Earth from '../earth'
import { useHotkeys } from 'react-hotkeys-hook'
import ControlPanel from "../controlpanel"
import MissionSelectorContainer from "../../containers/MissionSelectorContainer"
import MapSelectorContainer from "../../containers/MapSelectorContainer"
import ColorSelectorContainer from "../../containers/ColorSelectorContainer"
import DemSelectorContainer from "../../containers/DemSelectorContainer"
import AltitudeLabelContainer from "../../containers/AltitudeLabelContainer"

import DateManagerContainer from '../../containers/DateManagerContainer'
import SearchManagerContainer from '../../containers/SearchManagerContainer'
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
                <DateManagerContainer/>
                <SearchManagerContainer/>
                <AltitudeLabelContainer/>
                <ControlPanel active="false" >
                    {/* <div class='logo'><img  src='./images/ESA_logo_2020_White.png' height="40" ></img></div> */}
                    {/* <div className='logo'><img alt='' src='./images/EOi_logo.png' height="100" ></img></div> */}
                    {/* <div className='verticalContainer'> */}
                        <MissionSelectorContainer></MissionSelectorContainer>
                        <MapSelectorContainer ></MapSelectorContainer>
                        <div className='horizontalContainer'>
                            <DemSelectorContainer></DemSelectorContainer>
                            <ColorSelectorContainer></ColorSelectorContainer>
                        </div>
                    {/* </div> */}
                </ControlPanel>
                <div className='MissionLabel'>{mission}</div>
            {/* </FullScreen> */}
        </div>
    )
}

export default App;
