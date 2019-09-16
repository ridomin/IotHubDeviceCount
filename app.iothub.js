const hub = require('azure-iothub')
const moment = require('moment')

function getDeviceList(connectionString, cb) {
    const registry = hub.Registry.fromConnectionString(connectionString)
    registry.list().then( devices => {
        const devicesInfo = devices.responseBody.map((d)=>{
            return {
                id:d.deviceId, 
                time:moment(d.lastActivityTime).fromNow(), 
                state:d.connectionState,
                status:d.status
                }
            })
        console.log(`found ${devicesInfo.length} devices`)
        cb(devicesInfo)
        })
}
module.exports = {getDeviceList}