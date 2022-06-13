import React, { useState, useEffect } from "react";
import {AppContext} from '../app/context'


import { useKey } from 'rooks'
import './MissionSelector.css'


// should use a prop

function MissionSelector() {

    const [ state, dispatch ] = React.useContext(AppContext)

    
    useKey(['1'],()=>dispatch({ type: "set_mission", value: 'S1'}))
    useKey(['2'],()=>dispatch({ type: "set_mission", value: 'S2'}))
    useKey(['3'],()=>dispatch({ type: "set_mission", value: 'S3/SLSTR'}))
    useKey(['5'],()=>dispatch({ type: "set_mission", value: 'S5P'}))
    useKey(['6'],()=>dispatch({ type: "set_mission", value: 'ENVISAT'}))


    return (
        <div className='MissionSelectorContainer'>
            <div className='MissionSelector'>
                {state.collections.map( (coll,idx)  => (
                    <div key={coll.code} className={(state.mission === coll.code)?'CircleButtonSelected':'CircleButton'}><img className='MissionIcon' src={coll.logo} alt='' onClick={() => dispatch({ type: "set_mission", value: coll.code})} /></div>
                    ))}
                </div>
        </div>
        
    )

}

export default MissionSelector;
