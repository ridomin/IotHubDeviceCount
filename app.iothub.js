const hub = require('azure-iothub')
const dtService = require('azure-iot-digitaltwins-service');
const moment = require('moment')

function getDeviceList(connectionString, cb) {
    const registry = hub.Registry.fromConnectionString(connectionString)
    const queryText = "select deviceId, lastActivityTime, connectionState, status, properties.reported.[[$iotin:deviceinfo]].manufacturer.value as manufacturer from devices";
    const query = registry.createQuery(queryText)
    query.nextAsTwin((err,devices) => {
        if (err) {
            console.error(`Failed to query devices due to ${err}`);
          } else {
            const devicesInfo = devices.map((d)=>{
                return {
                    id:d.deviceId, 
                    time:moment(d.lastActivityTime).fromNow(), 
                    lastActivityTime:d.lastActivityTime,
                    state:d.connectionState,
                    status:d.status,
                    manufacturer:d.manufacturer
                    }
                })
                console.log(`found ${devicesInfo.length} devices`)
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

module.exports = {getDeviceList, getInterfaces, getInterfaceDetails, runCommand}