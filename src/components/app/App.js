import React, {useState, useEffect, useCallback} from 'react'
import { useGlobal } from 'reactn'

import './App.css'
import Earth from '../earth'
import DateManager from '../datemanager'
import { useHotkeys } from 'react-hotkeys-hook'
import ControlPanel from "../controlpanel"
import C_MissionSelector from "../../containers/MissionSelectorContainer"
import C_MapSelector from "../../containers/MapSelectorContainer"
import HuePickerContainer from "../../containers/HuePickerContainer"

// import useToggle from 'react-use/lib/useToggle'
import { FullScreen, useFullScreenHandle } from "react-full-screen"
// import { useFullscreen } from '@straw-hat/react-fullscreen'


function App() {
    
    let initdate = new Date()
    const [viewdate, setViewdate] = useState(initdate)
    const [startdate, ] = useState(initdate)
    const [searching, setSearching] = useState(false)
    // const [collection, setCollection] = useState('S1')

    const handle = useFullScreenHandle();

    const [ mission,  ] = useGlobal('mission');
    const [ mapSettings, ] = useGlobal('mapSettings')
    const [ appColor, ] = useGlobal('appColor')

    const changeDate = (newdate) => {
        // console.log('App changeDate callback: ' + newdate.toJSON())
        setViewdate(newdate)
    }

    const finalChangeDate = (date) => {
        console.log('Final Date: ' + date.toJSON())
        // setSearching(true)
    }

    // manage full screen
    // const fullScreen = useRef()
    // fullScreen.current = false
    const toggleFullScreen = () => {
        if(!fullScreen.current) {
            fullScreen.current = true
            handle.enter()
            console.log("will enter: ")
        } else {
            fullScreen.current = false
            // handle.exit()
            console.log("will exit: ")

        }
    }
    const [fullScreen, setfullScreen] = useState(false);
    // useHotkeys("f",() => setfullScreen(isFull => !isFull)) 
    useHotkeys("f",handle.enter) 

    useEffect(() => {
        console.log('fullScreen changed to: '+fullScreen)
        // if(fullScreen == false) handle.enter()
    },[fullScreen])


    useEffect(() => {
        console.log('time to init earth')
        console.log(mapSettings)
        // if(fullScreen == false) handle.enter()
    },[])

    useEffect(() => {
        console.log('mapSettings effect')
        console.log(mapSettings)
        // if(fullScreen == false) handle.enter()
    },[mapSettings])

    useEffect(() => {
        console.log('appColor effect')
        console.log(appColor)
        // if(fullScreen == false) handle.enter()
    },[appColor])

    return (
        <div className="App" >
             <FullScreen handle={handle}>
                <div className="Earth">
                    <Earth id="globe" 
                        viewdate={viewdate} 
                        starfield={mapSettings.starfield} 
                        atmosphere={mapSettings.atmosphere} 
                        names={mapSettings.names} 
                        background={mapSettings.background} 
                        clon='0.5' 
                        clat='40' 
                    />
                </div>
                <DateManager startdate={startdate} onDateChange={changeDate} onFinalDateChange={finalChangeDate} animated={searching}/>
                <ControlPanel active="true">
                    <div class='logo'><img  src='./images/ESA_logo_2020_White.png' height="60" ></img></div>
                    <C_MissionSelector></C_MissionSelector>
                    <C_MapSelector ></C_MapSelector>
                    <HuePickerContainer></HuePickerContainer>
                </ControlPanel>
                <div className='MissionLabel'>{mission}</div>
            </FullScreen>
        </div>
    )
}

export default App;