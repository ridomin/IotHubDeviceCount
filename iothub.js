const hub = require('azure-iothub')

function getDeviceCount(connectionString, cb){
    const registry = hub.Registry.fromConnectionString(connectionString)
    registry.getRegistryStatistics(function (err, stats) {
        if (err) console.error(err.message)
        cb(stats.enabledDeviceCount)
    })
}
module.exports = {getDeviceCount}