import wellknown from 'wellknown';

export default function eocatToGeojson(response) {

    
    function mapFromHubOpenSearch(item) {    

        try {
            var downloadurl = null
            var quicklookurl = null
            for (let i = 0; i < item.properties.link.length; i++) {
                if (item.properties.link[i]['@']['title'] == 'Download') downloadurl = item.properties.link[i]['@']['href']
                if (item.properties.link[i]['@']['title'] == 'Quicklook') quicklookurl = item.properties.link[i]['@']['href']
            }
            

            var newItem = {
                id: item.id,
                geometry: item.geometry,
                type: "Feature",
                properties: {
                    updated: item.properties.updated,
                    title: item.properties.title,
                    name: item.title,
                    uuid: item.properties.identifier,
                    date: item.properties.date,
                    downloadUrl: downloadurl,
                    quicklookUrl: quicklookurl,
                    // links: {
                    //     data: [{
                    //         href: item.link[0].href,
                    //     }]
                    // },
                    earthObservation: {
                        parentIdentifier: item.properties.EarthObservation.metaDataProperty.EarthObservationMetaData.parentIdentifier,
                        status: "ARCHIVED",
                        acquisitionInformation: [{
                            platform: {
                                platformShortName: item.properties.EarthObservation.procedure.EarthObservationEquipment.platform.Platform.shortName,
                                platformSerialIdentifier: null
                            },
                            sensor: {
                                instrument: item.properties.EarthObservation.procedure.EarthObservationEquipment.instrument.Instrument.shortName,
                                operationalMode: item.properties.EarthObservation.procedure.EarthObservationEquipment.sensor.Sensor.operationalMode
                            },
                            acquisitionParameter: {
                                acquisitionStartTime: new Date(item.properties.EarthObservation.phenomenonTime.TimePeriod.beginPosition),
                                acquisitionStopTime: new Date(item.properties.EarthObservation.phenomenonTime.TimePeriod.endPosition),
                                relativePassNumber: null,
                                orbitNumber: item.properties.EarthObservation.procedure.EarthObservationEquipment.acquisitionParameters.Acquisition.orbitNumber,
                                startTimeFromAscendingNode: null,
                                stopTimeFromAscendingNode: null,
                                orbitDirection: item.properties.EarthObservation.procedure.EarthObservationEquipment.acquisitionParameters.Acquisition.orbitDirection

                            }
                        }],
                        productInformation: {
                            productType: item.properties.EarthObservation.metaDataProperty.EarthObservationMetaData.productType,
                            //timeliness: indexes["product"]["Timeliness Category"],
                            downloadUrl: downloadurl,
                            quicklookUrl: quicklookurl,
        
                            size: null
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
        if( response.features ) {
            if(Array.isArray(response.features)) {
                console.log('features is an  array')
                features = response.features.map( item =>  mapFromHubOpenSearch(item)).filter(item => item !== {});
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
                totalResults: response.properties.totalResults,
                startIndex: response.properties.startIndex,
                itemsPerPage: response.properties.itemsPerPage,
                title: response.properties.title,
                updated: response.properties.updated
            },
            features: features
        };

    return geojson

}
