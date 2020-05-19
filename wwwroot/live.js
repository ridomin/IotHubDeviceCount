
const protocol = document.location.protocol.startsWith('https') ? 'wss://' : 'ws://'
const webSocket = new WebSocket(protocol + window.location.host)


;(async () => {
  const app = new Vue({
    el: '#app',
    data: {
      deviceId: '',
      currentTemp: '',
      targetTemp: ''
    }
  })
  app.deviceId = new URLSearchParams(window.location.search).get('deviceId')
})()
