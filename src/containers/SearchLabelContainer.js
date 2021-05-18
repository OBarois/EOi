import React, {  useGlobal } from 'reactn';
import './GenericLabel.css' 

function SearchLabelContainer() {

    const [resultDesc, ] = useGlobal('resultDesc')


    return (
        <div className='GenericLabel'>{resultDesc.totalLoaded === 0?'':resultDesc.totalLoaded+'/'+resultDesc.totalResults}</div>
     )
}

export default SearchLabelContainer;
