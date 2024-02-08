import React, {useCallback} from 'react'
import { Icon } from '@iconify/react';
import {AppContext} from '../app/context'

import outlineRemoveRedEye from '@iconify-icons/ic/outline-remove-red-eye';
import baselineArrowCircleRight from '@iconify-icons/ic/baseline-arrow-circle-right';
import baselineArrowCircleLeft from '@iconify-icons/ic/baseline-arrow-circle-left';

import './ViewProductControl.css' 

function ViewProductControl({active}) {

    const [ state, dispatch ] = React.useContext(AppContext)
    
    const previous = useCallback( (event) => {
        event.stopPropagation()
        dispatch({type:'gotopreviousitem'})
        // dispatch({type:'gotopreviousitem'})
    }, [])

    const closest = useCallback( (event) => {
        event.stopPropagation()
        dispatch({type:'gotoclosestitem'})
        // dispatch({type:'gotopreviousitem'})
    }, [])

    const next = useCallback( (event) => {
        event.stopPropagation()
        dispatch({type:'gotonextitem'})
    }, [])

    return (
        <div className={state.leftHanded?'ViewProductControlL':'ViewProductControl'} style={{display:active?'flex':'none'}}>
            <Icon icon={baselineArrowCircleLeft} width='50px' onClick={previous}/>      
            {/* <Icon icon={outlineRemoveRedEye} width='40px' onClick={closest}/>       */}
            <Icon icon={baselineArrowCircleRight} width='50px' onClick={next}/>      
        </div>
     )
}

export default ViewProductControl
