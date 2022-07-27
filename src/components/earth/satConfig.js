import WorldWind from 'webworldwind-esa';
const {
    Color
} = WorldWind;

const satConfig = [
    {
        key: 's1a',
        name: 'SENTINEL-1A',
        shortName: 'S-1A',
        satIndex: 0,
        swathTypes: ['black', 'red', 'green', 'white'],
        swathColors: [
            Color.colorFromKmlHex('ff000000'), //black
            Color.colorFromKmlHex('ff0000ff'), //red
            Color.colorFromKmlHex('ff00ff00'), //green
            Color.colorFromKmlHex('ffffffff')  //white
        ],
        swatModes: ['IW', 'EW', 'SM'],
        // tleLineOne: '1 39634U 14016A   18124.03591006  .00000001  00000-0  10014-4 0  9998',
        // tleLineTwo: '2 39634  98.1819 132.0838 0001369  78.7198 281.4156 14.59198520217480',
        tleLineOne: '1 39634U 14016A   22206.03053888  .00000001  00000+0  98653-5 0  9990',
        tleLineTwo: '2 39634  98.1828 213.0548 0001302  81.4946 278.6403 14.59197888442509',
        hasModel: true,
        filePath: './satellites/sentinel1/s1.json',
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
        ignoreLocalTransforms: true,
        launchDate: new Date('2014-04-03T21:02:00.000Z'),
    },
    {
        key: 's2a',
        name: 'SENTINEL-2A',
        shortName: 'S-2A',
        satIndex: 1,
        swathTypes: ['red', 'purple', 'white', 'darkGrey', 'green', 'greener'],
        swathColors: [
            Color.colorFromKmlHex('ff0000ff'), //red
            Color.colorFromKmlHex('ffff00ff'), //purple
            Color.colorFromKmlHex('ffffffff'), //white
            Color.colorFromKmlHex('ff7f7f7f'), //dark grey
            Color.colorFromKmlHex('ff00ff00'),  //green
            Color.colorFromKmlHex('ff00fff7')  //greener
        ],
        swatModes: ['NOBS'],
        tleLineOne: '1 40697U 15028A   18124.08865983  .00000004  00000-0  17994-4 0  9993',
        tleLineTwo: '2 40697  98.5686 199.4434 0001286  92.5669 267.5666 14.30817033149583',
        hasModel: true,
        filePath: './satellites/senti2version6/s2.json',
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
        scale: 1000000,
        translations: {
            x: 0.1,
            y: 0.385,
            z: 0.02
        },
        ignoreLocalTransforms: true,
        launchDate: new Date('2015-06-23T01:52:00.000Z'),
    },
    {
        key: 's3a',
        name: 'SENTINEL-3A',
        shortName: 'S-3A',
        satIndex: 2,
        tleLineOne: '1 41335U 16011A   18124.14356592 -.00000000  00000-0  18017-4 0  9998',
        tleLineTwo: '2 41335  98.6266 192.0005 0001035 100.1921 259.9376 14.26736754115121',
        hasModel: true,
        filePath: './satellites/Sentinel3/s3.json',
        rotations: {
            x: 0, //0
            y: 0, //180
            z: 0, //165
            headingAxis: [0, 0, 1], //0,0,1
            headingAdd: 180, //-20
            headingMultiply: 1 //1
        },
        preRotations: {
            x: 0,
            y: 180,
            z: 0
        },
        scale: 1000000,
        translations: {
            x: 0.01, //-0.01
            y: 1.98, //1.9
            z: 0.07 //-0.07
        },
        ignoreLocalTransforms: true,
        launchDate: new Date('2016-02-16T17:57:00.000Z'),
    },
    {
        key: 's1b',
        name: 'SENTINEL-1B',
        shortName: 'S-1B',
        satIndex: 3,
        swathTypes: ['black', 'red', 'green', 'white'],
        swathColors: [
            Color.colorFromKmlHex('ff000000'), //black
            Color.colorFromKmlHex('ff0000ff'), //red
            Color.colorFromKmlHex('ff00ff00'), //green
            Color.colorFromKmlHex('ffffffff')  //white
        ],
        swatModes: ['IW', 'EW', 'SM'],
        tleLineOne: '1 41456U 16025A   18124.13828432 -.00000022  00000-0  49756-5 0  9992',
        tleLineTwo: '2 41456  98.1817 132.0102 0001487  82.9964 277.1419 14.59197806107664',
        hasModel: true,
        filePath: './satellites/sentinel1/s1.json',
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
        ignoreLocalTransforms: true,
        launchDate: new Date('2016-04-25T21:02:00.000Z'),
        retirementDate: new Date('2022-04-01T21:55:00.000Z'),
    },
    {
        key: 's2b',
        name: 'SENTINEL-2B',
        shortName: 'S-2B',
        satIndex: 4,
        swathTypes: ['blue'],
        swathColors: [
            Color.colorFromKmlHex('ffffff00'),
        ],
        swatModes: ['NOBS'],
        tleLineOne: '1 42063U 17013A   18124.12358125  .00000002  00000-0  17497-4 0  9994',
        tleLineTwo: '2 42063  98.5687 199.4702 0001382  97.5073 262.6270 14.30817718 60503',
        groundPosition: {latitude: 5.2079, longitude: -52.7724, altitude: 0},
        hasModel: true,
        filePath: './satellites/senti2version6/s2.json',
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
        scale: 1000000,
        translations: {
            x: 0.1,
            y: 0.385,
            z: 0.02
        },
        ignoreLocalTransforms: true,
        launchDate: new Date('2017-03-07T01:49:00.000Z'),
    },
    {
        key: 's5p',
        name: 'SENTINEL-5P',
        shortName: 'S-5P',
        satIndex: 5,
        swathTypes: [],
        swathColors: [],

        tleLineOne: '1 42969U 17064A   18123.85141871 -.00000009  00000-0  16636-4 0  9994',
        tleLineTwo: '2 42969  98.7352  64.1585 0001101  78.1817 281.9482 14.19565315 28712',

        groundPosition: {latitude: 62.927860, longitude: 40.574830, altitude: 0},
        hasModel: true,
        filePath: './satellites/sentinel5p/s5p.json',
        rotations: {
            x: 0,
            y: 0,
            z: 0,
            headingAxis: [0, 0, 1],
            headingAdd: -90,
            headingMultiply: 1
        },
        preRotations: {
            x: 180 + 30,
            y: 0,
            z: 0
        },
        scale: 70000,
        translations: {
            x: 0.5,
            y: 0.4,
            z: -1.2
        },
        ignoreLocalTransforms: true,
        launchDate: new Date('2017-10-13T09:27:00.000Z'),
    },
    {
        key: 's3b',
        name: 'SENTINEL-3B',
        shortName: 'S-3B',
        satIndex: 6,
        tleLineOne: '1 43437U 18039A   18122.61596633  .00002473  00000-0  10753-2 0  9999',
        tleLineTwo: '2 43437  98.6226 190.4610 0008811 292.4467  67.5830 14.24954518   977',
        groundPosition: {
            latitude: 62.925556,
            longitude: 40.577778,
            altitude: 0,
        },
        hasModel: true,
        filePath: 'satellites/Sentinel3/s3.json',
        rotations: {
            x: 0, //0
            y: 0, //180
            z: 0, //165
            headingAxis: [0, 0, 1], //0,0,1
            headingAdd: 180, //-20
            headingMultiply: 1 //1
        },
        preRotations: {
            x: 0,
            y: 180,
            z: 0
        },
        scale: 1000000,
        translations: {
            x: 0.01, //-0.01
            y: 1.98, //1.9
            z: 0.07 //-0.07
        },
        ignoreLocalTransforms: true,
        launchDate: new Date('2018-04-25T17:57:00.000Z'),
    },
];

export const getSatConfigByKey = (satKey) => {
    return satConfig.find((s) => s.key === satKey);
};


export default satConfig;