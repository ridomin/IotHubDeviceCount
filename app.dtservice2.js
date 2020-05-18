const DTClient = require('./rest-client/dtclient').DTClient

const getDigitalTwin2 = async (connectionString, deviceId) => {
  const dtClient = new DTClient(connectionString)
  const twinResponse = await dtClient.getDigitalTwin(deviceId)
  const twin = twinResponse._response.parsedBody
  // console.log(twin)
  console.log(twin.$metadata.$model)
  return twin // .$metadata.$model
}

module.exports = { getDigitalTwin2 }
