import React, {  useGlobal } from 'reactn';
import './GenericLabel.css' 

function ProductInfolContainer() {

    const [closestItem, ] = useGlobal('closestItem')


    return (
        <div className='GenericLabel Small'>{closestItem?closestItem.userProperties.title:''}</div>
     )
}

export default ProductInfolContainer;
