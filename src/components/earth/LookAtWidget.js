import React, {  useGlobal } from 'reactn';
import './LookAtWidget.css' 
// npm install --save-dev @iconify/react @iconify-icons/ic
import { Icon, InlineIcon } from '@iconify/react';
import baselineFlare from '@iconify-icons/ic/baseline-flare';



function LookAtWidget({active}) {

    return (
        <div className='LookAtWidget' style={{display:active?'flex':'none'}}>
            <div className='Mire'>
                <Icon icon={baselineFlare} width='30px'/>
            </div>
            
        </div>
     )
}

export default LookAtWidget;
