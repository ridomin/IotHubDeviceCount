const express = require('express')
const path = require('path')
const app = express()
const router = express.Router()

const bodyParser = require('body-parser')
const hub = require('./app.iothub.js')
const repo = require('./app.repo')
const port = 3000

let connectionString = process.env.IOTHUB_CONNECTION_STRING

if (!connectionString || connectionString.length<10){
  console.log("IOTHUB_CONNECTION_STRING not found")
}

app.use(bodyParser.urlencoded({ extended: true }))
app.use('/api', router)
app.use(express.static('wwwroot'))

router.get('/', (req, res, next) => res.sendFile('index.html', { root: path.join(__dirname, 'wwwroot/index.html') }))

router.get('/connection-string', (req, res) => {
  if (connectionString && connectionString.length > 0) {
    const hubRegex = /(?<=HostName=).*(?=;SharedAccessKeyName)/i.exec(connectionString)
    const hubName = hubRegex.length > 0 ? hubRegex[0] : ''
    res.json(hubName)
  } else {
    res.json('not configured')
  }
})

router.post('/connection-string', (req, res) => {
  connectionString = req.body.connectionstring
  if (connectionString && connectionString.length > 0) {
    const hubRegex = /(?<=HostName=).*(?=;SharedAccessKeyName)/i.exec(connectionString)
    const hubName = hubRegex.length > 0 ? hubRegex[0] : ''
    res.json(hubName)
  } else {
    res.json('not configured')
  }
})

router.get('/getDevices', (req, res) => {
  if (connectionString.length > 0) {
    hub.getDeviceList(connectionString, list => res.json(list))
  } else {
    res.json({})
  }
})

router.get('/getModelId', async (req, res) => {
  const result = await hub.getModelId(connectionString, req.query.deviceId)
  console.log(`getModelId on ${req.query.deviceId} is ${result.$metadata.$model}`)
  res.json(result)
})

router.get('/getModelById', async (req, res) => {
  const result = await repo.getModelByIdAsync(req.query.modelId)
  console.log(`Model id ${req.query.modelId} found ${result.length}`)
  res.json(result)
})

router.get('/getInterfaces', async (req, res) => {
  const result = await hub.getInterfaces(connectionString, req.query.deviceId)
  console.log(`getInterfaces on ${req.query.deviceId}`)
  res.json(result)
})

router.get('/getInterfaceDetails', async (req, res) => {
  const result = await hub.getInterfaceDetails(connectionString, req.query.urn)
  console.log(`getInterfaceDetails on ${req.query.urn}`)
  res.json(result)
})

router.post('/runCommand', async (req, res) => {
  const result = await hub.runCommand(
    connectionString,
    req.query.deviceId,
    req.query.interfaceName,
    req.query.command,
    req.query.param)

  console.log(`runCommand on ${req.query.deviceId}/${req.query.interfaceName}/${req.query.command}/${req.query.param}\r\nResponse: ${JSON.stringify(result)}`)

  res.json(result)
})

app.listen(port, () => console.log(`IoT Express app listening on port ${port}`))
