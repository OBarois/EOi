import React from 'reactn';
import './LookAtWidget.css' 
// npm install --save-dev @iconify/react @iconify-icons/ic
import { Icon } from '@iconify/react';
// import baselineFlare from '@iconify-icons/ic/baseline-flare';
import focusIcon from '@iconify-icons/et/focus';





function LookAtWidget({active}) {

    return (
        <div className='LookAtWidget' style={{display:active?'flex':'none'}}>
            <div className='Mire'>
                <Icon icon={focusIcon} width='30px' height='40px'/>
            </div>
            
        </div>
     )
}

export default LookAtWidget;
