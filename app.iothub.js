const hub = require('azure-iothub')
const dtService = require('azure-iot-digitaltwins-service')
const moment = require('moment')

const DTClient = require('./rest-client/dtclient').DTClient

const getDeviceList = (connectionString, cb) => {
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

const runCommand = async (connectionString, deviceId, interfaceName, command, param) => {
    const credentials = new dtService.IoTHubTokenCredentials(connectionString)
    const digitalTwinServiceClient = new dtService.DigitalTwinServiceClient(credentials)
    let cmdParam = {}
    if (param) {
        cmdParam = JSON.parse(param)
    }
    const response = await digitalTwinServiceClient.invokeCommand(deviceId, interfaceName, command, cmdParam)
    return response.result
}

const getDigitalTwin = async (connectionString, deviceId) =>  {
    const dtClient = new DTClient(connectionString)
    const twinResponse = await dtClient.getDigitalTwin(deviceId)
    const twin = twinResponse._response.parsedBody
    //console.log(twin)
    console.log(twin.$metadata.$model)
    return twin //.$metadata.$model
}

module.exports = { getDeviceList,  runCommand, getDigitalTwin }