import React, {  useGlobal } from 'reactn';
import './AltitudeLabel.css' 

function AltitudeLabelContainer() {

    const [altitude, ] = useGlobal('altitude')

    const formatLat = (lat) => {
        return (altitude >= 10000)?Math.floor(altitude / 1000)+ ' Km' : Math.floor(altitude)+ ' m'
    }

    return (
        <div className='AltitudeLabel'>{formatLat({altitude})}</div>
     )
}

export default AltitudeLabelContainer;
