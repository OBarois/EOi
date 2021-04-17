import WorldWind from "webworldwind-esa";

export const bgLayers = [
    {
        service: "https://tiles.maps.eox.at/wms",
        layerNames: "s2cloudless-2018",
        title: "s2cloudless-2018",
        numLevels: 19,
        format: "image/png",
        size: 256,
        sector: WorldWind.Sector.FULL_SPHERE,
        levelZeroDelta: new WorldWind.Location(90, 90)
    },
    {
        service: "https://tiles.esa.maps.eox.at/wms",
        layerNames: "s2cloudless-2018",
        title: "s2cloudless-2018 esa",
        numLevels: 19,
        format: "image/png",
        size: 256,
        sector: WorldWind.Sector.FULL_SPHERE,
        levelZeroDelta: new WorldWind.Location(90, 90)
    },
    {
        service: "https://tiles.esa.maps.eox.at/wms",
        layerNames: "osm",
        title: "osm",
        numLevels: 19,
        format: "image/png",
        size: 256,
        sector: WorldWind.Sector.FULL_SPHERE,
        levelZeroDelta: new WorldWind.Location(90, 90)
    },
    {
        service: "https://tiles.esa.maps.eox.at/wms",
        layerNames: "terrain-light",
        title: "terrain-light",
        numLevels: 19,
        format: "image/png",
        size: 256,
        sector: WorldWind.Sector.FULL_SPHERE,
        levelZeroDelta: new WorldWind.Location(90, 90)
    },
    {
        service: "https://tiles.maps.eox.at/wms",
        layerNames: "terrain",
        title: "terrain",
        numLevels: 19,
        format: "image/png",
        size: 256,
        sector: WorldWind.Sector.FULL_SPHERE,
        levelZeroDelta: new WorldWind.Location(90, 90)
    }
]
export const ovLayers = [

    {
        service: "https://tiles.maps.eox.at/wms",
        layerNames: "hydrography",
        title: "hydrography",
        numLevels: 19,
        format: "image/png",
        size: 256,
        sector: WorldWind.Sector.FULL_SPHERE,
        levelZeroDelta: new WorldWind.Location(90, 90)
    },
    {
        service: "https://tiles.maps.eox.at/wms",
        layerNames: "overlay_bright",
        title: "overlay_bright",
        numLevels: 19,
        format: "image/png",
        size: 256,
        sector: WorldWind.Sector.FULL_SPHERE,
        levelZeroDelta: new WorldWind.Location(90, 90)
    }
]


