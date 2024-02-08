import wellknown from 'wellknown';

export default function CDSEOdataToGeojson(response,startIndex) {

    function gmlToWkt(gmlfootprint) {
        let coord = gmlfootprint.slice(gmlfootprint.indexOf('<gml:coordinates>')+17,gmlfootprint.indexOf('</gml:coordinates>'))
        let coordlist = coord.replaceAll(',',' ')
        let coordarray = coordlist.split(' ')
        let wkt = 'MULTIPOLYGON((('
        for(let i=0; i< coordarray.length; i+=2) {
            wkt = wkt + coordarray[i+1] + ' ' + coordarray[i] + ','
        }
        wkt = wkt.slice(0,-1)
        wkt = wkt+')))'
        return wkt
    }
    
    function mapFromHubOpenSearch(item) {    
        function reshuffle(array) {
            let json = {};
            for(let i=0; i < array.length; i++) {
                json[array[i].name] =  array[i].content;
            }
            return json;
        }

        try {
            // let hubItem = {};
            // if(item.date) Object.assign(hubItem,reshuffle(item.date));
            // if(item.int) Object.assign(hubItem,reshuffle(item.int));
            // if(item.double) Object.assign(hubItem,reshuffle(item.double));
            // if(item.str) Object.assign(hubItem,reshuffle(item.str));


            // var sizeArray = hubItem.size.split(" ");
            // var sizeInBytes;
            // switch (sizeArray[1]) {
            //     case "B":
            //         sizeInBytes = Math.round(parseFloat(sizeArray[0]));
            //         break;
            //     case "MB":
            //         sizeInBytes = Math.round(parseFloat(sizeArray[0])*1024);
            //         break;
            //     case "GB":
            //         sizeInBytes = Math.round(parseFloat(sizeArray[0])*1024*1024);
            //         break;
            //     case "TB":
            //         sizeInBytes = Math.round(parseFloat(sizeArray[0])*1024*1024*1024);
            //         break;
            //     default: 
            //         sizeInBytes = Math.round(parseFloat(sizeArray[0]));
            //         break;

            // }
            

            // console.log(gmlToWkt(hubItem.gmlfootprint))

            let defaultgeometry = { type: "Point",coordinates: [0,0]}

                // ignore items without a geometry
                let geometry = item.GeoFootprint?item.GeoFootprint:defaultgeometry

            var newItem = {
                id: item.Id,
                geometry: geometry,
                type: "Feature",
                properties: {
                    updated: new Date(item.PublicationDate),
                    title: item.Name,
                    name: item.Name,
                    uuid: item.Id,
                    date: item.ContentDate.Start  +'/'+ item.ContentDate.End,
                    downloadUrl: null,
                    // quicklookUrl: 'https://catalogue.dataspace.copernicus.eu/odata/v1/Assets('+item.Id+")/$value",
                    quicklookUrl: item.Assets[0].DownloadLink,
                    // links: {
                    //     data: [{
                    //         href: item.link[0].href,
                    //     }]
                    // },
                    earthObservation: {
                        parentIdentifier: "",
                        status: "ARCHIVED",
                        acquisitionInformation: [{
                            platform: {
                                platformShortName: "any",
                                platformSerialIdentifier: "any"
                            },
                            sensor: {
                                instrument: "any",
                                operationalMode: "any"
                            },
                            acquisitionParameter: {
                                acquisitionStartTime: new Date(item.ContentDate.Start),
                                // acquisitionStopTime: parseInt(item.ContentDate.End.substr(0, 4))<2100?new Date(item.ContentDate.End):new Date(),
                                acquisitionStopTime: new Date(item.ContentDate.End),
                                relativePassNumber: 0,
                                orbitNumber: 0,
                                startTimeFromAscendingNode: null,
                                stopTimeFromAscendingNode: null,
                                orbitDirection: null

                            }
                        }],
                        productInformation: {
                            productType: null,
                            //timeliness: indexes["product"]["Timeliness Category"],
                            tile: null,
                            size: item.ContentLength
                        }
                    }
                }
            }
            return newItem;
        } catch (err) {
            console.log("error parsing item from PRIP: "+err.message);
            return null;
        }
    }

    let features = [];
    // console.log(response.value)
    try {

            if(Array.isArray(response.value)) {
                // console.log(response.value[0])
                features = response.value.filter(it => it !== null).map( item =>  mapFromHubOpenSearch(item)).filter(it => it !== null);
            } else {
                features = []
            }
                

        
    } catch (err) {
        console.log(response);
        console.log("Error: ");
        console.log(err);
        // features = []
    }
    //console.log(JSON.stringify(features));
    let geojson = {   
            type: "FeatureCollection",
            id: "search",
            properties: {
                totalResults: response["@odata.count"] - (response.value.length - features.length),
                // totalResults: response.value.length,
                startIndex: startIndex,
                itemsPerPage: response.value.length,
                title: "PRIP search response",
                updated: new Date()
            },
            features: features
        };
        // console.log(JSON.stringify(geojson))
    return geojson

}
