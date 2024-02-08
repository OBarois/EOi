import React from 'react'
import {AppContext} from '../app/context'
import './ProductInfo.css' 

function ProductInfo() {

    const [ state,  ] = React.useContext(AppContext)


    return (
        <div className='ProductInfo Small'>{state.closestItem?state.closestItem.closest.userProperties.title:''}</div>
     )
}

export default ProductInfo

