const dtService = require('azure-iot-digitaltwins-service')

const getDigitalTwin = async (connectionString, deviceId) => {
  const credentials = new dtService.IoTHubTokenCredentials(connectionString)
  const digitalTwinServiceClient = new dtService.DigitalTwinServiceClient(credentials)
  const twin = await digitalTwinServiceClient.getDigitalTwin(deviceId)
  return twin._response.parsedBody
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

module.exports = { runCommand, getDigitalTwin }
