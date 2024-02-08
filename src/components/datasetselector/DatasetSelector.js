import React, { useState, useEffect } from "react";
import {AppContext} from '../app/context'


import './DatasetSelector.css'


// should use a prop

function DatasetSelector() {

    const [ state, dispatch ] = React.useContext(AppContext)

    

    return (
        <div className='DatasetSelectorContainer'>
            <div className='DatasetSelector'>
                {state.collections.map( (coll)  => (
                    <div key={coll.code} className={(state.dataset === coll.code)?'CircleButtonSelected':'CircleButton'}>
                        <img className='DatasetIcon' src={coll.logo} alt={coll.code} onClick={
                            () => dispatch({ type: "set_dataset", value: [coll.code, coll.satellites, coll.cycle, coll.defaultFreetext?coll.defaultFreetext:coll.code, coll.windowSize]})
                        } /></div>
                    ))}
                </div>
        </div>
        
    )

}

export default DatasetSelector;
