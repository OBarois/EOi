import React, {useCallback} from 'react'
import { Icon } from '@iconify/react';
import {AppContext} from '../app/context'

import outlineRemoveRedEye from '@iconify-icons/ic/outline-remove-red-eye';

import './ViewProductControl.css' 

function ViewProductControl({active}) {

    const [ state, dispatch ] = React.useContext(AppContext)
    
    const handleClick = useCallback( (event) => {
        event.stopPropagation()
        dispatch({type:'gotoclosestitem'})
    }, [])

    return (
        <div className={state.leftHanded?'ViewProductControlL':'ViewProductControl'} style={{display:active?'flex':'none'}}>
            <Icon icon={outlineRemoveRedEye} width='40px' onClick={handleClick}/>            
        </div>
     )
}

export default ViewProductControl
