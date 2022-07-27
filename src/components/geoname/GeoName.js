import React, {useRef, useMemo} from 'react';
import {AppContext} from '../app/context'
import GeocoderGeonames from 'geocoder-geonames'

import './GeoName.css' 

function GeoName() {

    const [ state,  ] = React.useContext(AppContext)

    const geocoder = useRef(new GeocoderGeonames({
        username:      'esaeoi',
      })
    )


    const search = useMemo( (value) => {
        console.log('searching: ')
        console.log(value)
        // geocoder.current.get('search',{
        //     q: 'Berlin'
        //   })
        //   .then(function(response){
        //     console.log(response);
        //   })
        //   .catch(function(error){
        //     console.log(error);
        //   })
    },[]) 

    return (
        <div>
            {/* <form onInput={search} > */}
                <input className='GeoName' type="text" onInput={search}></input>
            {/* </form> */}
        </div>
     )
}

export default GeoName
