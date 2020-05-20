const getDeviceTwin = (deviceId) => {
  return new Promise((resolve, reject) => {
    fetch(`/api/getDeviceTwin?deviceId=${deviceId}`)
      .then(resp => resp.json())
      .then(twin => resolve(twin))
      .catch(err => reject(err))
  })
}

const getDigitalTwin = (deviceId) => {
  return new Promise((resolve, reject) => {
    fetch(`/api/getDigitalTwin?deviceId=${deviceId}`)
      .then(resp => resp.json())
      .then(twin => resolve(twin))
      .catch(err => reject(err))
  })
}

const getDigitalTwin2 = (deviceId) => {
  return new Promise((resolve, reject) => {
    fetch(`/api/getDigitalTwin2?deviceId=${deviceId}`)
      .then(resp => resp.json())
      .then(twin => resolve(twin))
      .catch(err => reject(err))
  })
}

const getModelById = (modelId) => {
  return new Promise((resolve, reject) => {
    fetch(`/api/getModelById?modelId=${modelId}`)
      .then(resp => resp.json())
      .then(model => resolve(JSON.parse(model)))
      .catch(err => reject(err))
  })
}

const updateTwin = (deviceId, componentName, propertyName, propertyValue) => {
  // const data = new window.FormData()
  // data.append('json', JSON.stringify({ deviceId, componentName, propertyName, propertyValue }))
  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ deviceId, componentName, propertyName, propertyValue })
  }
  return new Promise((resolve, reject) => {
    fetch('/api/updateTwin', options)
      .then(resp => resp.json())
      .then(d => resolve(d))``
      .catch(err => reject(err))
  })
}

const runCommand = (deviceId, componentName, commandName, payload) => {
  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ deviceId, componentName, commandName, payload })
  }
  return new Promise((resolve, reject) => {
    fetch('/api/runCommand', options)
      .then(resp => resp.json())
      .then(d => resolve(d))``
      .catch(err => reject(err))
  })
}

export { getDeviceTwin, getDigitalTwin, getDigitalTwin2, getModelById, updateTwin, runCommand }
