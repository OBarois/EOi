import React from 'react';
import {AppContext} from '../app/context'

import './GenericLabel.css' 

function CollectionLabel() {

    // const [altitude, ] = useGlobal('altitude')
    const [ state,  ] = React.useContext(AppContext)

    return (
        <div className='GenericLabel'>{state.dataset}</div>
     )
}

export default CollectionLabel;
