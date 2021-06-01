// import WorldWind from 'webworldwind-esa';
import wwwx from 'webworldwind-x';
import satConfig from './satConfig'
import OrbitLayer from './OrbitLayer'
// import Orbits from './wwwxx/util/Orbits';
// import Orbits from './wwwxx/shapes/Orbits'


const {
    EoUtils,
} = wwwx;

var orbitLayers = []

    for(let i=0 ; i<satConfig.length ; i++) {
        console.log(satConfig[i].name)


        let satstart = satConfig[i].launchDate
        let satend = new Date(satstart.getTime())
        let layerKey = satConfig[i].key
        satend.setUTCFullYear( satend.getUTCFullYear()+20 )
        let satrec = EoUtils.computeSatrec(satConfig[i].tleLineOne, satConfig[i].tleLineTwo);
        // let satrec = {tle1: satConfig[i].tleLineOne, tle2: satConfig[i].tleLineTwo}
        let layer = new OrbitLayer({key: layerKey, satRec: satrec, time: new Date(), currentTime: new Date(), opacity: 0.7})
        
        layer.timeRange = [satstart, satend]
        layer.displayName = 'Orbit'



        orbitLayers.push(layer)
    }


export default orbitLayers