import React, {useState, useEffect, useCallback} from 'react'
import { Icon } from '@iconify/react';
import {AppContext} from '../app/context'
import outlineFilterAlt from '@iconify-icons/ic/outline-filter-alt';
import baselineFilterAlt from '@iconify-icons/ic/baseline-filter-alt';





import './FilterProductControl.css' 

function FilterProductControl({active}) {

    const [ state, dispatch ] = React.useContext(AppContext)
    const [ filter, setfilter ] = useState(state.filter)
    
    const handleClick = useCallback( (event) => {
        event.stopPropagation()
        dispatch({type:'set_filter'})
    },[])

    useEffect(() => {
        console.log('filter')
        setfilter(state.filter)
    },[state.filter])


    return (
        <div className={state.leftHanded?'FilterProductControlL':'FilterProductControl'} style={{display:active?'flex':'none'}}>
            <Icon icon={filter.length === 0 || filter == null ?outlineFilterAlt:baselineFilterAlt} width='40px' onClick={handleClick}/>            
        </div>
     )
}

export default FilterProductControl
