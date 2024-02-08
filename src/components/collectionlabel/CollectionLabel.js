import React, {useRef, useEffect, useCallback} from 'react';
import {AppContext} from '../app/context'

import './CollectionLabel.css' 

function CollectionLabel() {

    // const [altitude, ] = useGlobal('altitude')
    const [ state, dispatch ] = React.useContext(AppContext)

    const inputRef = useRef(null)
    

    const getcollection = (code) => {
        for(let i=0; i < state.collections.length; i++) {
            if(state.collections[i].code === code) {
                return state.collections[i]
            }
        }
        return state.collections[0]
    }



    const search =  (event) => {
        event.preventDefault()
        event.stopPropagation()
        inputRef.current.blur()
        // console.log(event.target.value)
        console.log(event)
        if(inputRef.current.value == '') {
            let collection= getcollection(state.dataset)
            inputRef.current.value = collection.defaultFreetext?collection.defaultFreetext:collection.code
        }
        dispatch({ type: "freetextsearch", value: inputRef.current.value })
    } 
    
    useEffect(() => {
        console.log(state.dataset)
        let collection= getcollection(state.dataset)
        console.log(collection)
        inputRef.current.value = collection.defaultFreetext?collection.defaultFreetext:collection.code
    }, [state.dataset])
    

    return (
        // <div className='GenericLabel'>{state.dataset}</div>


        <div className='FreeTextContainer'>
            <form onSubmit={search}>
                <label htmlFor="freetext" className='CollCode'>{getcollection(state.dataset).name}: 
                    <input ref={inputRef} id='freetext' className='FreeText' type="text" size='20' style={{width:200}}/>
                </label>
            </form>
        </div>
    )
}

export default CollectionLabel;

