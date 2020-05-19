
const protocol = document.location.protocol.startsWith('https') ? 'wss://' : 'ws://'
const webSocket = new WebSocket(protocol + window.location.host)

class DeviceData {
  constructor (deviceId) {
    this.deviceId = deviceId
    this.maxLen = 50
    this.timeData = new Array(this.maxLen)
    this.temperatureData = new Array(this.maxLen)
    this.humidityData = new Array(this.maxLen)
  }

  addData (time, temperature, humidity) {
    const t = new Date(time)
    const timeString = `${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}`

    this.timeData.push(timeString)
    this.temperatureData.push(temperature)

    if (this.timeData.length > this.maxLen) {
      this.timeData.shift()
      this.temperatureData.shift()
    }
  }
}

const deviceId = new URLSearchParams(window.location.search).get('deviceId')
const deviceData = new DeviceData(deviceId)

const chartData = {
  datasets: [
    {
      fill: false,
      label: 'Temperature',
      yAxisID: 'Temperature'
    }
  ]
}

const chartOptions = {
  scales: {
    yAxes: [{
      id: 'Temperature',
      type: 'linear',
      scaleLabel: {
        labelString: 'Temperature (ºC)',
        display: true
      },
      position: 'right'
    }]
  }
}

;(async () => {
  const app = new Vue({
    el: '#app',
    data: {
      deviceId: '',
      currentTemp: '',
      targetTemp: ''
    }
  })
  app.deviceId = deviceId

  const myLineChart = new Chart(
    document.getElementById('iotChart').getContext('2d'),
    {
      type: 'line',
      data: chartData,
      options: chartOptions
    }
  )

  webSocket.onmessage = (message) => {
    const messageData = JSON.parse(message.data)
    console.log('msg received ' + messageData.IotData.temperature)
    if (messageData.IotData.temperature) {
      deviceData.addData(messageData.MessageDate, messageData.IotData.temperature, messageData.IotData.humidity)
      app.currentTemp = messageData.IotData.temperature
      chartData.labels = deviceData.timeData
      chartData.datasets[0].data = deviceData.temperatureData
      myLineChart.update()
    }
  }
})()
