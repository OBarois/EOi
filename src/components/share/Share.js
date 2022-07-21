import React, {useCallback} from 'react'
import { Icon } from '@iconify/react';
import {AppContext} from '../app/context'
import JSONCrush from "jsoncrush"


import outlineIosShare from '@iconify/icons-ic/outline-ios-share';

import './Share.css' 

function Share({active}) {

    const [ state, dispatch ] = React.useContext(AppContext)
    
    const handleClick = useCallback( (event) => {
        let newloc = window.location.href.split('?')[0]
        let savedstate = JSON.parse(window.localStorage.getItem("eoi_state"))
        newloc = newloc + '?s=' + encodeURIComponent(JSONCrush.crush(JSON.stringify(savedstate)))
        console.log(newloc)
        navigator.share({url:newloc, text:'Share with love by EOi'})
    }, [])

    return (
        <div className={state.leftHanded?'ShareL':'Share'} >
            <Icon icon={outlineIosShare} width='40px' onClick={handleClick}/>            
        </div>
     )
}

export default Share
