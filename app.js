const express = require('express'),
      app = express(),
      router = express.Router()

const bodyParser = require('body-parser')
const hub = require('./iothub.js')
const port = 3000
//const connectionString = 'HostName=StrangerThings.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=XFgZcgv+lJSGfqO2RhMTn6ljpy7s4Zm0qf94GSYrRR8='
let connectionString=''

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', router)
app.use(express.static('wwwroot'))  

app.get('/hw', (req, res) => res.send('Hello World!'))
router.get('/', function (req, res, next){
    res.sendFile('index.html', {root: __dirname + "wwwroot/index.html"})
})

router.get('/connection-string', (req,res)=> {
    res.json(connectionString)
})

router.post('/connection-string',(req,res)=> {
    connectionString = req.body.connectionstring
    res.redirect('/')
})

router.get('/deviceCount', function(req, res) {
    if (connectionString.length>0) {
        hub.getDeviceCount(connectionString, (returnedDevices)=>{
            res.json(returnedDevices)
        })
    } else {
        res.json(-1)
    }
})

router.get('/deviceList', (req,res) => {
    hub.getDeviceList(connectionString, (list)=>{
        res.json(list)
    })
})

app.listen(port, () => console.log(`Express app listening on port ${port}!`));
