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
        // tleLineOne: '1 39634U 14016A   22206.03053888  .00000001  00000+0  98653-5 0  9990',
        // tleLineTwo: '2 39634  98.1828 213.0548 0001302  81.4946 278.6403 14.59197888442509',
        tleLineOne: '1 39634U 14016A   23135.75055234 -.00000139  00000+0 -19716-4 0  9994',
        tleLineTwo: '2 39634  98.1823 143.5502 0001426  81.2075 278.9272 14.59196457485481',
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
        // tleLineOne: '1 40697U 15028A   22209.03279834  .00000059  00000+0  39204-4 0  9998',
        // tleLineTwo: '2 40697  98.5679 283.2380 0001239  91.6336 268.4979 14.30822892370656',
        tleLineOne: '1 40697U 15028A   23135.78094730 -.00000613  00000+0 -21723-3 0  9993',
        tleLineTwo: '2 40697  98.5701 210.7561 0001081  93.5445 266.5839 14.30810928412372',
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
        // tleLineOne: '1 41335U 16011A   22209.15666111  .00000036  00000+0  32851-4 0  9998',
        // tleLineTwo: '2 41335  98.6209 275.8640 0001147  97.0294 263.1017 14.26737212335576',
        tleLineOne: '1 41335U 16011A   23136.17745299  .00000172  00000+0  89236-4 0  9995',
        tleLineTwo: '2 41335  98.6226 203.6975 0001316 103.1271 257.0056 14.26742809377217',
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
        tleLineOne: '1 41456U 16025A   22209.21862431  .00000042  00000+0  18606-4 0  9996',
        tleLineTwo: '2 41456  98.1829 216.0238 0001369  88.6708 271.4653 14.59198877333137',
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
        // tleLineOne: '1 42063U 17013A   22209.13764023  .00000067  00000+0  42146-4 0  9991',
        // tleLineTwo: '2 42063  98.5689 283.3111 0001478  92.7207 267.4142 14.30818304281580',
        tleLineOne: '1 42063U 17013A   23136.11735053 -.00000029  00000+0  54738-5 0  9990',
        tleLineTwo: '2 42063  98.5693 211.0962 0001350 106.3618   5.3753 14.30811798323331',
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

        // tleLineOne: '1 42969U 17064A   22208.78956647 -.00000001  00000+0  20275-4 0  9995',
        // tleLineTwo: '2 42969  98.7323 147.9939 0001240  83.7357 276.3960 14.19543785248044',
        tleLineOne: '1 42969U 17064A   23135.66826956  .00000093  00000+0  64630-4 0  9994',
        tleLineTwo: '2 42969  98.7022  76.1729 0001376  82.7461 277.3871 14.19557123289458',

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
        // tleLineOne: '1 43437U 18039A   22208.77883229  .00000033  00000+0  31691-4 0  9991',
        // tleLineTwo: '2 43437  98.6268 275.5208 0001599 102.2196 257.9163 14.26737935221584',
        tleLineOne: '1 43437U 18039A   23136.15029073  .00000164  00000+0  85856-4 0  9990',
        tleLineTwo: '2 43437  98.6287 203.7069 0001035  82.6596 277.4702 14.26731362263279',
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
    {
        key: 'env',
        name: 'ENVISAT',
        shortName: 'Envisat',
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
        tleLineOne: '1 27386U 02009A   22208.94689716  .00000035  00000+0  24922-4 0  9991',
        tleLineTwo: '2 27386  98.1855 188.1604 0001389  88.0150 331.3538 14.38141701 69354',
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
        launchDate: new Date('2002-03-01T21:02:00.000Z'),
        retirementDate: new Date('2012-05-09T21:55:00.000Z'),

    }
];

export const getSatConfigByKey = (satKey) => {
    return satConfig.find((s) => s.key === satKey);
};


export default satConfig;