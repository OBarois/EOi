//todo: replace hotkeys by rook useKey

import React, {useRef} from 'react'
import { AppProvider } from "./context"


import './App.css'
import Earth from '../earth'
import ControlPanel from "../controlpanel"
import InfoPanel from "../infopanel"
// import MissionSelectorContainer from "../../containers/MissionSelectorContainer"
import MissionSelector from "../missionselector"

// import MapSelectorContainer from "../../containers/MapSelectorContainer"
import MapSelector from "../mapselector"
import ColorSelectorContainer from "../../containers/ColorSelectorContainer"
import OptionsSelector from "../optionsselector"
import CollectionLabel from "../collectionlabel"
import AltitudeLabel from "../altitudelabel"
import SearchLabel from "../searchlabel"

import DateManagerContainer from '../../containers/DateManagerContainer'
import SearchManagerContainer from '../../containers/SearchManagerContainer'
import { useFullscreen } from 'rooks';
import { useKey } from 'rooks'
import ProductInfo from '../productinfo/ProductInfo'

function App() {
    
    


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

    useKey(['f'],()=>{toggle(container.current)})

    return (
        <AppProvider>
        <div className="App" ref={container} id="container">
             {/* <FullScreen handle={fshandle}> */}
                <Earth id="globe" />
                {/* <DateManager startdate={startdate} onDateChange={changeDate} onFinalDateChange={finalChangeDate} animated={searching}/> */}
                <DateManagerContainer/>
                <SearchManagerContainer/>
                <ControlPanel active="false" >
                    {/* <div class='logo'><img  src='./images/ESA_logo_2020_White.png' height="40" ></img></div> */}
                    {/* <div className='logo'><img alt='' src='./images/EOi_logo.png' height="100" ></img></div> */}
                    <div className='horizontalContainer'>
                        <MissionSelector></MissionSelector>
                        <MapSelector ></MapSelector>
                        <div className='horizontalContainer'>
                        <div class='logo'><a href="https://scihub.copernicus.eu/dhus/odata/v1/Products('5d8ad17d-78ad-46a0-8cb0-17a0f7af35a2')/Products('Quicklook')/$value">Connect</a></div>

                            <ColorSelectorContainer></ColorSelectorContainer>
                            <OptionsSelector/>
                        </div>
                    </div>
                </ControlPanel>
                <InfoPanel>
                    <CollectionLabel/>
                    <AltitudeLabel/>
                    <SearchLabel/>
                    <ProductInfo/>

                </InfoPanel>
            {/* </FullScreen> */}
        </div>
        </AppProvider>
    )
}

export default App;
