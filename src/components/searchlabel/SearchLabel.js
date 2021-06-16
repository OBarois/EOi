import React from 'react';
import {AppContext} from '../app/context'

import './GenericLabel.css' 

function SearchLabel() {

    const [ state,  ] = React.useContext(AppContext)

    return (
        <div className='GenericLabel'>{state.resultDesc.totalLoaded === 0?'':state.resultDesc.totalLoaded+'/'+state.resultDesc.totalResults}</div>
     )
}

export default SearchLabel
