import React, {  useGlobal, useRef, useEffect } from 'reactn'
import { Icon, InlineIcon } from '@iconify/react';

import outlineRemoveRedEye from '@iconify-icons/ic/outline-remove-red-eye';

import './ViewProductControl.css' 

function ViewProductControl({active}) {
    const [ selectedProduct, setselectedProduct] = useGlobal('selectedProduct')
    const [ closestItem, setclosestItem] = useGlobal('closestItem')
    const [ goToDate, setgoToDate] = useGlobal('goToDate')
    
    const [ moveToClosestItemTrigger, setmoveToClosestItemTrigger ] = useGlobal('moveToClosestItemTrigger')
    // const closestitem = useRef(closestItem)

    const handleClick = (event) => {
        event.stopPropagation()
        let selection = []
        if(closestItem) {
            console.log('Moving to closest item')
            selection[0] = closestItem
            // setselectedProduct(selection[0])
            setmoveToClosestItemTrigger(Math.random())
            setgoToDate(closestItem.timeRange[1])
            // setresetStartDateTrigger(Math.random())
        }
    }

    // useEffect(() => {
    //     closestitem.current=closestItem
    //  }, [closestItem]);
 

    return (
        <div className='ViewProductControl' style={{display:closestItem !== null?'flex':'none'}}>
            <Icon icon={outlineRemoveRedEye} width='40px' onClick={handleClick}/>            
        </div>
     )
}

export default ViewProductControl
