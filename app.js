const express = require('express'),
      app = express(),
      router = express.Router()

const bodyParser = require('body-parser')
const hub = require('./app.iothub.js')
const port = 3000

let connectionString=''

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', router)
app.use(express.static('wwwroot'))  

router.get('/', (req, res, next) => res.sendFile('index.html', {root: __dirname + "wwwroot/index.html"}))
router.get('/connection-string', (req,res)=> res.json(connectionString))
router.post('/connection-string',(req,res)=> {
    connectionString = req.body.connectionstring
    res.redirect('/')
})

router.get('/deviceList', (req,res) => {
    if (connectionString.length>0) {
        hub.getDeviceList(connectionString, (list)=>{
            res.json(list)
        })
    } else {
        res.json({})
    }
})
app.listen(port, () => console.log(`IoT Express app listening on port ${port}`));
