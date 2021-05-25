import React, {  useGlobal, useRef, useEffect } from 'reactn'
import { Icon, InlineIcon } from '@iconify/react';

import outlineRemoveRedEye from '@iconify-icons/ic/outline-remove-red-eye';

import './ViewProductControl.css' 

function ViewProductControl({active}) {
    const [ selectedProduct, setselectedProduct] = useGlobal('selectedProduct')
    const [ closestItem, setclosestItem] = useGlobal('closestItem')
    const closestitem = useRef(closestItem)

    const handleClick = () => {
        let selection = []
        if(closestItem) {
            console.log('selected a product')
            selection[0] = closestitem.current
            setselectedProduct(selection)
        }
    }

    useEffect(() => {
        closestitem.current=closestItem
     }, [closestItem]);
 

    return (
        <div className='ViewProductControl' style={{display:closestItem !== null?'flex':'none'}}>
            <Icon icon={outlineRemoveRedEye} width='40px' onClick={handleClick}/>            
        </div>
     )
}

export default ViewProductControl
