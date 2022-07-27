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
    let satstart, satend = null
    for(let i=0 ; i<satConfig.length ; i++) {
        satstart = new Date(satConfig[i].launchDate.getTime())
        if(satConfig[i].retirementDate == null) {
            satend = new Date(satstart.getTime())
            satend.setUTCFullYear( satend.getUTCFullYear()+20 )
        } else {
            satend = new Date(satConfig[i].retirementDate.getTime())
        }


        let layerKey = satConfig[i].key
        let satrec = EoUtils.computeSatrec(satConfig[i].tleLineOne, satConfig[i].tleLineTwo);
        // let satrec = {tle1: satConfig[i].tleLineOne, tle2: satConfig[i].tleLineTwo}
        let layer = new OrbitLayer({key: layerKey, satRec: satrec, time: new Date(), currentTime: new Date(), opacity: 0.7})
        
        layer.timeRange = [satstart, satend]
        layer.displayName = 'Orbit'
        orbitLayers.push(layer)
    }


export default orbitLayers