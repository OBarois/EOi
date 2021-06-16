import React from 'react'
import { Icon } from '@iconify/react';
import {AppContext} from '../app/context'

import outlineRemoveRedEye from '@iconify-icons/ic/outline-remove-red-eye';

import './ViewProductControl.css' 

function ViewProductControl({active}) {

    const [ , dispatch ] = React.useContext(AppContext)
    
    const handleClick = (event) => {
        event.stopPropagation()
        dispatch({type:'gotoclosestitem'})
    }

    return (
        <div className='ViewProductControl' style={{display:active?'flex':'none'}}>
            <Icon icon={outlineRemoveRedEye} width='40px' onClick={handleClick}/>            
        </div>
     )
}

export default ViewProductControl
