// import WorldWind from 'webworldwind-esa';
import wwx from 'webworldwind-x';
import satConfig from './satConfig'
// import SatelliteModel from './wwwx/shapes/satellites/Model';
import SatelliteModelLayer from './wwwxx/layer/SatelliteModelLayer'
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
// const options = {
//     rotations: layerConfig.satData.rotations,
//     preRotations: layerConfig.satData.preRotations,
//     scale: layerConfig.satData.scale,
//     translations: layerConfig.satData.translations,
//     ignoreLocalTransforms: layerConfig.satData.ignoreLocalTransforms,
// }
// const layer = new SatelliteModelLayer({key: layerKey, time: time, onLayerChanged}, options);
// layer.setRerender(() => wwd.redraw());
// getModel(`${layerConfig.satData.filePath}${layerConfig.satData.fileName}`, layerKey).then(
//     (model) => {
//         const satrec = EoUtils.computeSatrec(layerConfig.satData.tleLineOne, layerConfig.satData.tleLineTwo);
//         const position = EoUtils.getOrbitPosition(satrec, new Date(time));
//         layer.setModel(model, options, position)
//         layer.setTle([layerConfig.satData.tleLineOne, layerConfig.satData.tleLineTwo]);
//     }
// );

// export default SentinelCloudlessLayer;
// const {
//     Position,
// } = WorldWind;
const {
    EoUtils,
} = wwx;

var satelliteLayers = []

    for(let i=0 ; i<satConfig.length ; i++) {
        console.log(satConfig[i].name)

        const options = {
            rotations: satConfig[i].rotations,
            preRotations: satConfig[i].preRotations,
            scale: satConfig[i].scale,
            translations: satConfig[i].translations,
            ignoreLocalTransforms: satConfig[i].ignoreLocalTransforms
        }

        let layer = new SatelliteModelLayer({key: satConfig[i].key, time: new Date(), }, options)

        const satrec = EoUtils.computeSatrec(satConfig[i].tleLineOne, satConfig[i].tleLineTwo);
        const position = EoUtils.getOrbitPosition(satrec, new Date());

        fetch(satConfig[i].filePath).then(response => {
            return response.json();
        }).then(satelliteData => {
            layer.setModel(satelliteData, {
                rotations: satConfig[i].rotations,
                preRotations: satConfig[i].preRotations,
                scale: satConfig[i].scale,
                translations: satConfig[i].translations,
                ignoreLocalTransforms: satConfig[i].ignoreLocalTransforms
            }, position );
        });

        // layer.setModel(model, options, position)
        layer.setTle([satConfig[i].tleLineOne, satConfig[i].tleLineTwo]);


        satelliteLayers.push(layer)
    }


export default satelliteLayers