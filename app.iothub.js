const hub = require('azure-iothub')
const dtService = require('azure-iot-digitaltwins-service')
const moment = require('moment')

const DTClient = require('./rest-client/dtclient').DTClient

function getDeviceList(connectionString, cb) {
    const registry = hub.Registry.fromConnectionString(connectionString)
    const queryText = `select deviceId,
                              lastActivityTime,
                              connectionState,
                              status,
                              properties.reported.[[$iotin:deviceinfo]].manufacturer.value as manufacturer
                       from devices
                       where capabilities.iotEdge != true`;
    const query = registry.createQuery(queryText)
    query.nextAsTwin((err, devices) => {
        if (err) {
            console.error(`Failed to query devices due to ${err}`);
        } else {
            const devicesInfo = devices.map((d) => {
                const elapsed = moment(d.lastActivityTime)
                return {
                    id: d.deviceId,
                    time: elapsed.isBefore('2019-01-01', 'year') ? '' : elapsed.fromNow(),
                    lastActivityTime: d.lastActivityTime,
                    state: d.connectionState,
                    status: d.status,
                    manufacturer: d.manufacturer
                }
            })
            console.log(`Found ${devicesInfo.length} registered devices.`)
            cb(devicesInfo)
        }
    })
}

async function getInterfaces(connectionString, deviceId) {
    const credentials = new dtService.IoTHubTokenCredentials(connectionString)
    const digitalTwinServiceClient = new dtService.DigitalTwinServiceClient(credentials)
    let dt = null
    try {
        dt = await digitalTwinServiceClient.getDigitalTwin(deviceId)
    } catch (err) {
        console.log(err)
        return
    }
    return dt
        .interfaces
        .urn_azureiot_ModelDiscovery_DigitalTwin
        .properties
        .modelInformation
        .reported
        .value
        .interfaces
}

async function getInterfaceDetails(connectionString, urn) {
    const credentials = new dtService.IoTHubTokenCredentials(connectionString)
    const digitalTwinServiceClient = new dtService.DigitalTwinServiceClient(credentials)
    let response
    try {
        response = await digitalTwinServiceClient.getModel(urn)
    } catch (err) {
        console.log(err)
        return
    }
    return response.contents
}

async function runCommand(connectionString, deviceId, interfaceName, command, param) {
    const credentials = new dtService.IoTHubTokenCredentials(connectionString)
    const digitalTwinServiceClient = new dtService.DigitalTwinServiceClient(credentials)
    const cmdParam = JSON.parse(param)
    let response
    try {
        response = await digitalTwinServiceClient.invokeCommand(deviceId, interfaceName, command, cmdParam)
    } catch (err) {
        console.log(err)
        return
    }
    return response.result
}

async function getModelId(connectionString, deviceId) {
    const dtClient = new DTClient(connectionString)
    const twinResponse = await dtClient.getDigitalTwin(deviceId)
    const twin = twinResponse._response.parsedBody
    //console.log(twin)
    console.log(twin.$metadata.$model)
    return twin //.$metadata.$model
}

module.exports = { getDeviceList, getInterfaces, getInterfaceDetails, runCommand, getModelId }
