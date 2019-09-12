const hub = require('azure-iothub')

function getDeviceCount(connectionString, cb) {
    const registry = hub.Registry.fromConnectionString(connectionString)
    registry.list().then(function (devices) {
        cb(devices.responseBody.length)
    })
}

function getDeviceList(connectionString, cb) {
    const registry = hub.Registry.fromConnectionString(connectionString)
    registry.list().then((devices)=>{
        cb(devices.responseBody)
    })
}
module.exports = {getDeviceCount, getDeviceList}