const hub = require('azure-iothub')
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
module.exports = {getDeviceList}