import React from 'react';
import {AppContext} from '../app/context'

import './GenericLabel.css' 

function AltitudeLabel() {

    // const [altitude, ] = useGlobal('altitude')
    const [ state,  ] = React.useContext(AppContext)


    const formatLat = (lat) => {
        return (state.altitude >= 10000)?Math.floor(state.altitude / 1000)+ ' Km' : Math.floor(state.altitude)+ ' m'
    }

    return (
        <div className='GenericLabel'>{formatLat(state.altitude)}</div>
     )
}

export default AltitudeLabel;
