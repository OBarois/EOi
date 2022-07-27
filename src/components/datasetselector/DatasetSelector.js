import React, { useState, useEffect } from "react";
import {AppContext} from '../app/context'


import { useKey } from 'rooks'
import './DatasetSelector.css'


// should use a prop

function DatasetSelector() {

    const [ state, dispatch ] = React.useContext(AppContext)

    
    useKey(['0'],()=>dispatch({ type: "set_dataset", value: [state.dataset,['s1a','s1b','s2a','s2b','s3a','s3b','s5p']]}))
    useKey(['1'],()=>dispatch({ type: "set_dataset", value: [state.dataset,['s1a','s1b']]}))
    useKey(['2'],()=>dispatch({ type: "set_dataset", value: [state.dataset,['s2a','s2b']]}))
    useKey(['3'],()=>dispatch({ type: "set_dataset", value: [state.dataset,['s3a','s3b']]}))
    useKey(['5'],()=>dispatch({ type: "set_dataset", value: [state.dataset,['s5p']]}))


    return (
        <div className='DatasetSelectorContainer'>
            <div className='DatasetSelector'>
                {state.collections.map( (coll)  => (
                    <div key={coll.code} className={(state.dataset === coll.code)?'CircleButtonSelected':'CircleButton'}><img className='DatasetIcon' src={coll.logo} alt='' onClick={() => dispatch({ type: "set_dataset", value: [coll.code,coll.satellites]})} /></div>
                    ))}
                </div>
        </div>
        
    )

}

export default DatasetSelector;
