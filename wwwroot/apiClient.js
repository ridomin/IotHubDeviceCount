const getDeviceTwin = (deviceId) =>  {
    return new Promise((resolve, reject) => {
        fetch(`/api/getDeviceTwin?deviceId=${deviceId}`)
            .then(resp=>resp.json())
            .then(twin=>resolve(twin))
            .catch(err=>reject(err))
    })
}

const getDigitalTwin = (deviceId) =>  {
    return new Promise((resolve, reject) => {
        fetch(`/api/getDigitalTwin?deviceId=${deviceId}`)
            .then(resp=>resp.json())
            .then(twin=>resolve(twin))
            .catch(err=>reject(err))
    })
}

const getDigitalTwin2 = (deviceId) =>  {
    return new Promise((resolve, reject) => {
        fetch(`/api/getDigitalTwin2?deviceId=${deviceId}`)
            .then(resp=>resp.json())
            .then(twin=>resolve(twin))
            .catch(err=>reject(err))
    })
}

const getModelById = (modelId) => {
    return new Promise((resolve, reject) => {
        fetch(`/api/getModelById?modelId=${modelId}`)
            .then(resp=>resp.json())
            .then(model=>resolve(JSON.parse(model)))
            .catch(err=>reject(err))
    })
}

export { getDeviceTwin, getDigitalTwin,  getDigitalTwin2, getModelById}