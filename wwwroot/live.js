(async () => {
  Vue.component('app', {
    template: '#app-template',
    data: () => {
      const params = new URLSearchParams(window.location.search)
      return {
        deviceId: params.get('deviceId')
      }
    }
  })

  const app = new Vue({
    el: '#app'
  })
  console.log(app)
})()
