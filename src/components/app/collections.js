export const collections = [
    {
        code: "S1",
        templateUrl: 'https://scihub.copernicus.eu/dhus/search?q=( footprint:"Intersects({polygon})" AND beginposition:[{start} TO {end}] AND platformname:Sentinel-1 AND producttype:GRD)&start={startindex}&rows=100&orderby=beginposition desc&format=json',
        name: 'Sentinel-1 GRD' ,
        logo: './images/s1_black.png',
        type: 'DHUS',
        startIndexOrigin: 0,
        dateOff: " beginposition:[{start} TO {end}] AND",
        areaOff: ' footprint:"Intersects({polygon})" AND',
        windowSize: 1000 * 60 * 60 * 18 
    },
    {
        code: 'S1A',
        templateUrl: 'https://scihub.copernicus.eu/dhus/search?q=( footprint:"Intersects({polygon})" AND beginposition:[{start} TO {end}] AND platformname:Sentinel-1 AND filename:S1A* AND producttype:GRD)&start={startindex}&rows=100&orderby=beginposition desc&format=json',
        name: 'Sentinel-1A GRD' ,
        logo: './images/s1_black.png',
        type: 'DHUS',
        startIndexOrigin: 0,
        dateOff: ' beginposition:[{start} TO {end}] AND',
        areaOff:  ' footprint:"Intersects({polygon})" AND',
        windowSize: 1000 * 60 * 60 * 18 
    },
    {
        code: 'S1B',
        templateUrl: 'https://scihub.copernicus.eu/dhus/search?q=( footprint:"Intersects({polygon})" AND beginposition:[{start} TO {end}] AND platformname:Sentinel-1 AND filename:S1B* AND producttype:GRD)&start={startindex}&rows=100&orderby=beginposition desc&format=json',
        name: 'Sentinel-1B GRD' ,
        logo: './images/s1_black.png',
        type: 'DHUS',
        startIndexOrigin: 0,
        dateOff: ' beginposition:[{start} TO {end}] AND',
        areaOff:  ' footprint:"Intersects({polygon})" AND',
        windowSize: 1000 * 60 * 60 * 18 
    },
    {
        code: 'S2',
        templateUrl: 'https://scihub.copernicus.eu/dhus/search?q=( footprint:"Intersects({polygon})" AND beginposition:[{start} TO {end}] AND platformname:Sentinel-2 AND filename:*MSIL1C*)&start={startindex}&rows=100&orderby=beginposition desc&format=json',
        name: 'Sentinel-2 A/B Level 1C',
        logo: './images/s2_black.png',
        type: 'DHUS',
        startIndexOrigin: 0,
        dateOff: ' beginposition:[{start} TO {end}] AND',
        areaOff:  ' footprint:"Intersects({polygon})" AND',
        windowSize: 1000 * 60 * 60 *3
    },
    {
        code: 'S2A',
        templateUrl: 'https://scihub.copernicus.eu/dhus/search?q=( footprint:"Intersects({polygon})" AND beginposition:[{start} TO {end}] AND platformname:Sentinel-2 AND filename:S2A_MSIL1C*)&start={startindex}&rows=100&orderby=beginposition desc&format=json',
        name: 'Sentinel-2 A/B Level 1C',
        logo: './images/s2_black.png',
        type: 'DHUS',
        startIndexOrigin: 0,
        dateOff: ' beginposition:[{start} TO {end}] AND',
        areaOff:  ' footprint:"Intersects({polygon})" AND',
        windowSize: 1000 * 60 * 60 * 3
    },
    {
        code: 'S2B',
        templateUrl: 'https://scihub.copernicus.eu/dhus/search?q=( footprint:"Intersects({polygon})" AND beginposition:[{start} TO {end}] AND platformname:Sentinel-2 AND filename:S2B_MSIL1C*)&start={startindex}&rows=100&orderby=beginposition desc&format=json',
        name: 'Sentinel-2 A/B Level 1C',
        logo: './images/s2_black.png',
        type: 'DHUS',
        startIndexOrigin: 0,
        dateOff: ' beginposition:[{start} TO {end}] AND',
        areaOff:  ' footprint:"Intersects({polygon})" AND',
        windowSize: 1000 * 60 * 60 * 3
    },
    {
        code: 'S3',
        templateUrl: 'https://scihub.copernicus.eu/dhus/search?q=( footprint:"Intersects({polygon})" AND beginposition:[{start} TO {end}] AND platformname:Sentinel-3 AND (producttype:OL_1_LFR___ OR producttype:SL_1_RBT___ OR producttype:SR_1_SRA___))&start={startindex}&rows=100&orderby=beginposition desc&format=json',
        name: 'Sentinel-3 A/B, OLCI/SLSTR/SRAL' ,
        logo: './images/s3_black.png',
        type: 'DHUS',
        startIndexOrigin: 0,
        dateOff: ' beginposition:[{start} TO {end}] AND',
        areaOff:  ' footprint:"Intersects({polygon})" AND',
        windowSize: 1000 * 60 * 60 * 24
    },
    {
        code: 'S3A/OLCI/LFR',
        templateUrl: 'https://scihub.copernicus.eu/dhus/search?q=( footprint:"Intersects({polygon})" AND beginposition:[{start} TO {end}] AND platformname:Sentinel-3 AND filename:S3A_*  AND (producttype:OL_2_LFR___))&start={startindex}&rows=100&orderby=beginposition desc&format=json',
        name: 'Sentinel-3 A, OLCI/LFR' ,
        logo: './images/s3_black.png',
        type: 'DHUS',
        startIndexOrigin: 0,
        dateOff: ' beginposition:[{start} TO {end}] AND',
        areaOff:  ' footprint:"Intersects({polygon})" AND',
        windowSize: 1000 * 60 * 60 * 24
    },
    {
        code: 'S3B/OLCI/LFR',
        templateUrl: 'https://scihub.copernicus.eu/dhus/search?q=( footprint:"Intersects({polygon})" AND beginposition:[{start} TO {end}] AND platformname:Sentinel-3 AND filename:S3B_* AND (producttype:OL_2_LFR___))&start={startindex}&rows=100&orderby=beginposition desc&format=json',
        name: 'Sentinel-3 B, OLCI/LFR' ,
        logo: './images/s3_black.png',
        type: 'DHUS',
        startIndexOrigin: 0,
        dateOff: ' beginposition:[{start} TO {end}] AND',
        areaOff:  ' footprint:"Intersects({polygon})" AND',
        windowSize: 1000 * 60 * 60 * 24
    },
    {
        code: 'S3A/OLCI/RBT',
        templateUrl: 'https://scihub.copernicus.eu/dhus/search?q=( footprint:"Intersects({polygon})" AND beginposition:[{start} TO {end}] AND platformname:Sentinel-3 AND filename:S3A_*  AND (producttype:SL_1_RBT___))&start={startindex}&rows=100&orderby=beginposition desc&format=json',
        name: 'Sentinel-3 A, OLCI/RBT' ,
        logo: './images/s3_black.png',
        type: 'DHUS',
        startIndexOrigin: 0,
        dateOff: ' beginposition:[{start} TO {end}] AND',
        areaOff:  ' footprint:"Intersects({polygon})" AND',
        windowSize: 1000 * 60 * 60 * 24
    },
    {
        code: 'S3B/SLSTR/RBT',
        templateUrl: 'https://scihub.copernicus.eu/dhus/search?q=( footprint:"Intersects({polygon})" AND beginposition:[{start} TO {end}] AND platformname:Sentinel-3 AND filename:S3B_* AND (producttype:SL_1_RBT___))&start={startindex}&rows=100&orderby=beginposition desc&format=json',
        name: 'Sentinel-3 B, SLSTR/RBT' ,
        logo: './images/s3_black.png',
        type: 'DHUS',
        startIndexOrigin: 0,
        dateOff: ' beginposition:[{start} TO {end}] AND',
        areaOff:  ' footprint:"Intersects({polygon})" AND',
        windowSize: 1000 * 60 * 60 * 24
    },
    {
        code: 'S3/SLSTR',
        templateUrl: 'https://scihub.copernicus.eu/dhus/search?q=( footprint:"Intersects({polygon})" AND beginposition:[{start} TO {end}] AND platformname:Sentinel-3 AND (producttype:SL_1_RBT___))&start={startindex}&rows=100&orderby=beginposition desc&format=json',
        name: 'Sentinel-3 A/B, SLSTR' ,
        logo: './images/s3_black.png',
        type: 'DHUS',
        startIndexOrigin: 0,
        dateOff: ' beginposition:[{start} TO {end}] AND',
        areaOff:  ' footprint:"Intersects({polygon})" AND',
        windowSize: 1000 * 60 * 60 * 24
    },
    {
        code: 'S3/SRAL',
        templateUrl: 'https://scihub.copernicus.eu/dhus/search?q=( footprint:"Intersects({polygon})" AND beginposition:[{start} TO {end}] AND platformname:Sentinel-3 AND (producttype:SR_1_SRA___))&start={startindex}&rows=100&orderby=beginposition desc&format=json',
        name: 'Sentinel-3 A/B, SRAL' ,
        logo: './images/s3_black.png',
        type: 'DHUS',
        startIndexOrigin: 0,
        dateOff: ' beginposition:[{start} TO {end}] AND',
        areaOff:  ' footprint:"Intersects({polygon})" AND',
        windowSize: 1000 * 60 * 60 * 24
    },
    {
        code: 'S5P',
        templateUrl: 'https://scihub.copernicus.eu/dhus/search?q=( footprint:"Intersects({polygon})" AND beginposition:[{start} TO {end}] AND platformname:Sentinel-5 precursor AND (producttype:L1B_RA_BD1 OR (producttype:L2__NO2___ AND processingmode:Near real time)))&start={startindex}&rows=100&orderby=beginposition desc&format=json',
        name: 'S5P',
        logo: './images/s5p_black.png',
        type: 'DHUS',
        startIndexOrigin: 0,
        dateOff: ' beginposition:[{start} TO {end}] AND',
        areaOff:  ' footprint:"Intersects({polygon})" AND',
        windowSize: 1000 * 60 * 60 * 24 
    },
    {
        code: 'ENVISAT/MERIS/FRS',
        templateUrl: 'https://dhr.datahub.eodc.eu/search?q=( footprint:"Intersects({polygon})" AND beginposition:[{start} TO {end}] AND platformname:Envisat AND producttype:MER_FRS_2P) &start={startindex}&rows=100&orderby=beginposition desc&format=json',
        name: "ENVISAT/MERIS/FRS from EODC's EO Mission Data relay",
        logo: './images/s5p_black.png',
        type: 'DHUS',
        startIndexOrigin: 0,
        dateOff: ' beginposition:[{start} TO {end}] AND',
        areaOff:  ' footprint:"Intersects({polygon})" AND',
        windowSize: 1000 * 60 * 60 * 24 
    },
    {
        code: 'EOCAT-MER_FRS_2P',
        templateUrl: 'https://eocat.esa.int/api/catalogue/EOCAT-MER_FRS_2P/search?start={start}&stop={end}&geom={polygon}&format=json&count=50&startIndex={startindex}',
        startIndexOrigin: 1,
        name: 'EOCAT-MER_FRS_2P',
        logo: './images/s5p_black.png',
        type: 'EOCAT',
        dateOff: 'start={start}&stop={end}&',
        areaOff:  '&geom={polygon}',
        windowSize: 1000 * 60 * 60 * 24 * 3
    },

    {
        code: 'EOCAT-ENVISAT.ASA.IMP_1P',
        templateUrl: 'https://eocat.esa.int/api/catalogue/EOCAT-ENVISAT.ASA.IMP_1P/search?start={start}&stop={end}&geom={polygon}&format=json&count=50&startIndex={startindex}',
        startIndexOrigin: 1,
        name: 'EOCAT-ENVISAT.ASA.IMP_1P',
        logo: './images/s5p_black.png',
        type: 'EOCAT',
        dateOff: 'start={start}&stop={end}&',
        areaOff:  '&geom={polygon}',
        windowSize: 1000 * 60 * 60 * 24 * 3
    },

    {
        code: 'RefSysStac',
        templateUrl: 'https://processing.platform.ops-csc.com/native-api/stac/search?datetime={start}/{end}',
        startIndexOrigin: 1,
        name: 'RS Stac',
        type: 'STAC',
        logo: './images/s5p_black.png',
        dateOff: 'datetime={start}/{end}',
        areaOff:  ' and OData.CSC.Intersects(area=geography%27SRID=4326;{polygon}%27)',
        windowSize: 1000 * 60 * 60 * 24 * 3
    },

    {
        code: 'S1A_IW_RAW__0SDV',
        templateUrl: 'https://processing.platform.ops-csc.com/ddip/odata/v1/Products?$format=json&$count=true&$top=100&$skip={startindex}&$filter=contains(Name,%27S1A_IW_RAW__0SDV%27)%20and%20ContentDate/Start%20gt%20{start}%20and%20ContentDate/Start%20lt%20{end}&$orderby=%20ContentDate/Start%20desc',
        startIndexOrigin: 0,
        name: 'RS PRIP',
        logo: './images/s5p_black.png',
        type: 'PRIP',
        dateOff: '%20and%20ContentDate/Start%20gt%20{start}%20and%20ContentDate/Start%20lt%20{end}',
        areaOff:  ' and OData.CSC.Intersects(area=geography%27SRID=4326;{polygon}%27)',
        windowSize: 1000 * 60 * 60 * 24 * 3
    },
    {
        code: 'S3 RS',
        templateUrl: 'https://processing.platform.ops-csc.com/ddip/odata/v1/Products?$format=json&$count=true&$top=100&$skip={startindex}&$filter=contains(Name,%27S3%27)%20and%20ContentDate/Start%20gt%20{start}%20and%20ContentDate/Start%20lt%20{end}&$orderby=%20ContentDate/Start%20desc',
        startIndexOrigin: 0,
        name: 'RS PRIP',
        logo: './images/s5p_black.png',
        type: 'PRIP',
        dateOff: '%20and%20ContentDate/Start%20gt%20{start}%20and%20ContentDate/Start%20lt%20{end}',
        areaOff:  ' and OData.CSC.Intersects(area=geography%27SRID=4326;{polygon}%27)',
        windowSize: 1000 * 60 * 60 * 24 * 3
    }


]