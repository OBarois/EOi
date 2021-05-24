import React, {  useGlobal } from 'reactn';
import './LookAtWidget.css' 

function LookAtWidget({active}) {

    return (
        <div className='LookAtWidget' style={{display:active?'flex':'none'}}>
            <div className='Mire'>.</div>
            
        </div>
     )
}

export default LookAtWidget;
