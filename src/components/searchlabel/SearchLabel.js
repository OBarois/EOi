import React from 'react';
import {AppContext} from '../app/context'

import './SearchLabel.css' 

function SearchLabel() {

    const [ state,  ] = React.useContext(AppContext)

    return (
        <div className='SearchLabel'>{state.resultDesc.totalLoaded === 0?'':state.resultDesc.totalLoaded+'/'+state.resultDesc.totalResults}</div>
     )
}

export default SearchLabel
