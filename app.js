const express = require('express'),
      app = express(),
      router = express.Router()

const hub = require('azure-iothub')
const port = 3000
const connectionString = 'HostName=StrangerThings.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=XFgZcgv+lJSGfqO2RhMTn6ljpy7s4Zm0qf94GSYrRR8='

app.use('/api', router)
app.use(express.static('wwwroot'))  

app.get('/hw', (req, res) => res.send('Hello World!'))
router.get('/', function (req, res, next){
    res.sendFile('index.html', {root: __dirname + "wwwroot/index.html"})
})

router.get('/deviceCount', function(req, res) {
    const registry = hub.Registry.fromConnectionString(connectionString)
    registry.getRegistryStatistics(function (err, stats) {
        if (err) console.error(err.message)
        res.json(stats.enabledDeviceCount)
    })
})

app.listen(port, () => console.log(`Express app listening on port ${port}!`));
