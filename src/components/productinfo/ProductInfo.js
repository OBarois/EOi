import React from 'react'
import {AppContext} from '../app/context'
import './GenericLabel.css' 

function ProductInfo() {

    const [ state,  ] = React.useContext(AppContext)


    return (
        <div className='GenericLabel Small'>{state.closestItem?state.closestItem.userProperties.title:''}</div>
     )
}

export default ProductInfo

