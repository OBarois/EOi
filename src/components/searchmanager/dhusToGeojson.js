import wellknown from 'wellknown';

export default function dhusToGeojson(response) {

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
            if(Array.isArray(array)) {
                for(let i=0; i < array.length; i++) {
                    json[array[i].name] =  array[i].content;
                }
            } else {
                json[array.name] = array.content
            }
            return json;
        }

        try {
            let hubItem = {};
            if(item.date) Object.assign(hubItem,reshuffle(item.date));
            if(item.int) Object.assign(hubItem,reshuffle(item.int));
            if(item.double) Object.assign(hubItem,reshuffle(item.double));
            if(item.str) Object.assign(hubItem,reshuffle(item.str));


            var sizeArray = hubItem.size.split(" ");
            var sizeInBytes;
            switch (sizeArray[1]) {
                case "B":
                    sizeInBytes = Math.round(parseFloat(sizeArray[0]));
                    break;
                case "MB":
                    sizeInBytes = Math.round(parseFloat(sizeArray[0])*1024);
                    break;
                case "GB":
                    sizeInBytes = Math.round(parseFloat(sizeArray[0])*1024*1024);
                    break;
                case "TB":
                    sizeInBytes = Math.round(parseFloat(sizeArray[0])*1024*1024*1024);
                    break;
                default: 
                    sizeInBytes = Math.round(parseFloat(sizeArray[0]));
                    break;

            }
            
            // console.log(gmlToWkt(hubItem.gmlfootprint))
            // console.log(hubItem)
            var newItem = {
                id: item.title,
                geometry: wellknown(gmlToWkt(hubItem.gmlfootprint)),
                type: "Feature",
                properties: {
                    updated: new Date(hubItem.ingestiondate),
                    title: item.title,
                    name: item.title,
                    uuid: item.id,
                    date: hubItem.beginposition  +'/'+  hubItem.endposition,
                    downloadUrl: item.link[0].href,
                    quicklookUrl: (item.link.length >= 2) ? item.link[2].href: null,
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
                                platformShortName: hubItem.platformname,
                                platformSerialIdentifier: hubItem.platformserialidentifier
                            },
                            sensor: {
                                instrument: hubItem.instrumentshortname,
                                operationalMode: hubItem.sensoroperationalmode
                            },
                            acquisitionParameter: {
                                acquisitionStartTime: new Date(hubItem.beginposition),
                                acquisitionStopTime: new Date(hubItem.endposition),
                                relativePassNumber: parseInt(hubItem.relativeorbitnumber),
                                orbitNumber: parseInt(hubItem.orbitnumber),
                                startTimeFromAscendingNode: null,
                                stopTimeFromAscendingNode: null,
                                orbitDirection: hubItem.orbitdirection

                            }
                        }],
                        productInformation: {
                            productType: hubItem.producttype,
                            //timeliness: indexes["product"]["Timeliness Category"],
                            tile: hubItem.tileid,
                            size: sizeInBytes,
                            cloudCoverPercentage: hubItem.cloudcoverpercentage
                        }
                    }
                }
            }
        
            return newItem;
        } catch (err) {
            console.log("error parsing item from dhus: "+err.message);
            return {};
        }
    }

    let features = [];
    try {
        if( response.feed.entry ) {
            if(Array.isArray(response.feed.entry)) {
                // console.log('entry is an  array')
                features = response.feed.entry.map( item =>  mapFromHubOpenSearch(item)).filter(item => item !== {});
            } else {
                features = [mapFromHubOpenSearch(response.feed.entry)]
            }
                
        } else {
            features = []
        }
        
    } catch (err) {
        console.log(response);
        console.log("Error: ");
        console.log(err);
        features = []
    }
    //console.log(JSON.stringify(features));
    let geojson = {   
            type: "FeatureCollection",
            id: "search",
            properties: {
                totalResults: response.feed["opensearch:totalResults"],
                startIndex: (response.feed["opensearch:startIndex"])?response.feed["opensearch:startIndex"]:1,
                itemsPerPage: response.feed["opensearch:itemsPerPage"],
                title: "DHuS search response",
                updated: new Date()
            },
            features: features
        };

    return geojson

}
