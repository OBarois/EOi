//todo: replace hotkeys by rook useKey

import React, {useRef} from 'react'
import { AppProvider } from "./context"


import './App.css'
import Earth from '../earth'
import ControlPanel from "../controlpanel"
import InfoPanel from "../infopanel"
import Mood from "../mood"
import Share from "../share"
import DatasetSelector from "../datasetselector"
import MapSelector from "../mapselector"
import ColorSelectorContainer from "../../containers/ColorSelectorContainer"
import OptionsSelector from "../optionsselector"
import CollectionLabel from "../collectionlabel"
import AltitudeLabel from "../altitudelabel"
import SearchLabel from "../searchlabel"
// import GeoName from "../geoname"
import WindowSizeController from "../WindowSizeController"

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


    useKey(['f'],(e) => {if(e.target.tagName === 'BODY') toggle(container.current)})
    // useKey(['f'],()=>{toggle(container.current)})


    return (
        <AppProvider>
        <div className="App" ref={container} id="container">
             {/* <FullScreen handle={fshandle}> */}
                <Earth id="globe" />

                {/* <DateManager startdate={startdate} onDateChange={changeDate} onFinalDateChange={finalChangeDate} animated={searching}/> */}
                <DateManagerContainer/>
                <Mood/>
                <CollectionLabel/>
                <WindowSizeController/>
                <Share/>
                <SearchManagerContainer/>
                <ControlPanel active="false" >
                    {/* <div class='logo'><img  src='./images/ESA_logo_2020_White.png' height="40" ></img></div> */}
                    {/* <div className='logo'><img alt='' src='./images/EOi_logo.png' height="100" ></img></div> */}
                    <div className='horizontalContainer'>
                        <DatasetSelector></DatasetSelector>
                        <MapSelector ></MapSelector>
                        <div className='horizontalContainer'>
                            <ColorSelectorContainer></ColorSelectorContainer>
                            <OptionsSelector/>

                        </div>
                    </div>
                </ControlPanel>
                <AltitudeLabel/>
                <InfoPanel>
                    {/* <CollectionLabel/> */}
                    <SearchLabel/>
                    <ProductInfo/>

                </InfoPanel>
                {/* <FreeText/> */}
            {/* </FullScreen> */}
        </div>
        </AppProvider>
    )
}

export default App;
