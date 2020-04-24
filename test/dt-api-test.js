const hub = require('azure-iothub')
const dtService = require('azure-iot-digitaltwins-service')

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
    // return dt
    //     .interfaces
    //     .urn_azureiot_ModelDiscovery_DigitalTwin
    //     .properties
    //     .modelInformation
    //     .reported
    //     .value
    //     .modelId
}

(async () => {
    //const cs = 'HostName=pnp-intcus11-test-12.private.azure-devices-int.net;SharedAccessKeyName=iothubowner;SharedAccessKey=WZitqxzKOVWNOQhH0uCDFZ2yucnYisz2jDMbvJ6sJQs='
    //var list = await getInterfaces(cs, 'rido-pp')

    const cs = '';

    console.log(list)
})();

