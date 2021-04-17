import WorldWind from 'webworldwind-esa';
import SatelliteModel from './wwwx/shapes/satellites/Model';

// const Location = WorldWind.Location,
//     Sector = WorldWind.Sector,
//     WmsLayer = WorldWind.WmsLayer;

// class modelsLayer extends Layer {
//     constructor(){
//         super({
//             service: "https://tiles.maps.eox.at/wms",
//             layerNames: "s2cloudless-2018",
//             title: "Sentinel Cloudless Layer",
//             sector: new Sector(-90, 90, -180, 180),
//             levelZeroDelta: new Location(45, 45),
//             numLevels: 19,
//             format: "image/jpg",
//             opacity: 1,
//             size: 256,
//             version: "1.3.0"
//         });
//     }
// }

// export default SentinelCloudlessLayer;
const {
    Position,
    RenderableLayer
} = WorldWind;

const modelsLayer = new RenderableLayer('Model');
fetch('./data/sentinel1/s1.json').then(response => {
    return response.json();
}).then(satelliteData => {
    modelsLayer.addRenderable(new SatelliteModel(satelliteData, {
        rotations: {
            x: 0,
            y: 0,
            z: 0,
            headingAxis: [0, 0, 1],
            headingAdd: -90,
            headingMultiply: 1
        },
        preRotations: {
            x: 0,
            y: 0,
            z: 0
        },
        scale: 500000,
        translations: {
            x: -0.1,
            y: -0.1,
            z: 0
        },
        ignoreLocalTransforms: true
    }, new Position(51, 14, 100000)));
});
export default modelsLayer