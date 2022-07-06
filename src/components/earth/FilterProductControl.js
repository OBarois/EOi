import React from 'react'
import { Icon } from '@iconify/react';
import {AppContext} from '../app/context'
import outlineFilterAlt from '@iconify-icons/ic/outline-filter-alt';
import baselineFilterAlt from '@iconify-icons/ic/baseline-filter-alt';





import './FilterProductControl.css' 

function FilterProductControl({active}) {

    const [ state, dispatch ] = React.useContext(AppContext)
    
    const handleClick = (event) => {
        event.stopPropagation()
        dispatch({type:'set_filter'})
    }

    return (
        <div className='FilterProductControl' style={{display:active?'flex':'none'}}>
            <Icon icon={state.filter.length === 0 || !state.filter ?outlineFilterAlt:baselineFilterAlt} width='40px' onClick={handleClick}/>            
        </div>
     )
}

export default FilterProductControl
