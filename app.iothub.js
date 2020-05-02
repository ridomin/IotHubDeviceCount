const hub = require('azure-iothub')

const moment = require('moment')

const getDeviceList = (connectionString, cb) => {
    const registry = hub.Registry.fromConnectionString(connectionString)
    const queryText = `select deviceId,
                              lastActivityTime,
                              connectionState,
                              status,
                              properties.reported.[[$iotin:deviceinfo]].manufacturer.value as manufacturer
                       from devices
                       where capabilities.iotEdge != true`;
    const query = registry.createQuery(queryText)
    query.nextAsTwin((err, devices) => {
        if (err) {
            console.error(`Failed to query devices due to ${err}`);
        } else {
            const devicesInfo = devices.map((d) => {
                const elapsed = moment(d.lastActivityTime)
                return {
                    id: d.deviceId,
                    time: elapsed.isBefore('2019-01-01', 'year') ? '' : elapsed.fromNow(),
                    lastActivityTime: d.lastActivityTime,
                    state: d.connectionState,
                    status: d.status,
                    manufacturer: d.manufacturer
                }
            })
            console.log(`Found ${devicesInfo.length} registered devices.`)
            cb(devicesInfo)
        }
    })
}

const getDeviceTwin = async (connectionString, deviceId) => {
    const registry = hub.Registry.fromConnectionString(connectionString)
    const twin = await registry.getTwin(deviceId)
    return twin
}


module.exports = { getDeviceList, getDeviceTwin }