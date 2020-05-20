const dtService = require('azure-iot-digitaltwins-service')

const getDigitalTwin = async (connectionString, deviceId) => {
  const credentials = new dtService.IoTHubTokenCredentials(connectionString)
  const digitalTwinServiceClient = new dtService.DigitalTwinServiceClient(credentials)
  const twin = await digitalTwinServiceClient.getDigitalTwin(deviceId)
  return twin._response.parsedBody
}

const updateDigitalTwin = async (connectionString, deviceId, componentName, propertyName, propertyValue) => {
  const patch = [{
    op: 'add',
    path: '/' + componentName,
    value: { }
  }]
  patch[0].value[propertyName] = propertyValue
  patch[0].value.$metadata = {}

  const credentials = new dtService.IoTHubTokenCredentials(connectionString)
  const digitalTwinServiceClient = new dtService.DigitalTwinServiceClient(credentials)

  console.log(patch)
  const updResp = await digitalTwinServiceClient.updateDigitalTwin(deviceId, patch)
  console.log(updResp)
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

module.exports = { runCommand, getDigitalTwin, updateDigitalTwin }
