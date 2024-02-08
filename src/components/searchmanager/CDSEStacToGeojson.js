
export default function CDSEStacToGeojson(response,startIndex) {

    
    function mapFromHubOpenSearch(item) {    
// console.log(item)
        try {
            var downloadurl = null
            // var quicklookurl = null
            var quicklookurl = item.assets.QUICKLOOK?item.assets.QUICKLOOK.href:null
            // console.log(quicklookurl)
            // for (let i = 0; i < item.properties.link.length; i++) {
            //     if (item.properties.link[i]['@']['title'] === 'Download') downloadurl = item.properties.link[i]['@']['href']
            //     if (item.properties.link[i]['@']['title'] === 'Quicklook') quicklookurl = item.properties.link[i]['@']['href']
            // }
                // ignore items without a geometry
                let geometry = {}
                if (item.geometry == null) {
                    geometry = {type: "Point",
                    coordinates: [
                                 0,
                                 0
                               ]}
                } else {
                    geometry = item.geometry
                    // if(geometry.type == "LineString") return null
                    // delete geometry.crs
                    // console.log(item.Footprint.type+":")
                    // console.log(geometry.coordinates)
                }

            

                var newItem = {
                    id: item.id,
                    geometry: geometry,
                    type: "Feature",
                    properties: {
                        updated: null,
                        title: item.id,
                        name: item.id,
                        uuid: item.id,
                        date: item.properties.start_datetime,
                        downloadUrl: null,
                        quicklookUrl: quicklookurl,
                        // links: {
                        //     data: [{
                        //         href: item.link[0].href,
                        //     }]
                        // },
                        earthObservation: {
                            parentIdentifier: null,
                            status: "ARCHIVED",
                            acquisitionInformation: [{
                                // platform: {
                                //     platformShortName: item.properties.EarthObservation.procedure.EarthObservationEquipment.platform.Platform.shortName,
                                //     platformSerialIdentifier: null
                                // },
                                // sensor: {
                                //     instrument: item.properties.EarthObservation.procedure.EarthObservationEquipment.instrument.Instrument.shortName,
                                //     operationalMode: item.properties.EarthObservation.procedure.EarthObservationEquipment.sensor.Sensor.operationalMode
                                // },
                                acquisitionParameter: {
                                    acquisitionStartTime: new Date(item.properties.start_datetime),
                                    acquisitionStopTime: new Date(item.properties.end_datetime),
                                    // relativePassNumber: item.properties.AdditionalAttributes.IntegerAttributes.relativeOrbitNumber,
                                    // orbitNumber: item.properties.AdditionalAttributes.IntegerAttributes.orbitNumber,
                                    startTimeFromAscendingNode: null,
                                    stopTimeFromAscendingNode: null,
                                    orbitDirection: null
    
                                }
                            }],
                            productInformation: {
                                productType: item.properties.productType,
                                //timeliness: indexes["product"]["Timeliness Category"],
                                // downloadUrl: item.assets.products.href,
                                quicklookUrl: null,
            
                                size: null
                            }
                        }
                    }
                }
     
            return newItem;
        } catch (err) {
            console.log("error parsing item from cdse stac: "+err.message);
            return {};
        }
    }

    let features = [];
    console.log(response.features)

    try {
        if( response.features ) {
            if(Array.isArray(response.features)) {
                console.log('features is an  array')
                features = response.features.map( item =>  mapFromHubOpenSearch(item)).filter(item => item != {});
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
                // totalResults: response.features.length,
                totalResults: response.features.length == 0 ? 0: 1000, // since we don't know, we limit to the max number accepted by the App...
                startIndex: startIndex,
                itemsPerPage: response.features.length,
                title: 'CDSE Stac search',
                updated: null
            },
            features: features
        };
    
    return geojson

}
