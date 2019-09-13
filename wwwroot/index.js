(()=>{
spinner.style.display='block'    
fetch('/api/connection-string')
    .then((resp)=>{return resp.json()})
    .then((json)=>{
        connectionstring.value=json
        if (json.length<10) {
            connectionstring.value="set connection string"
        } else {
          //  setInterval(()=>{
            fetch('/api/deviceList')
                .then((resp)=>{return resp.json()})
                .then((devices)=>{
                    var app = new Vue({
                        el: '#listDevices',
                        data: {
                            devices: devices,
                            now: new Date().toLocaleTimeString()
                        }
                    })
                })
          //      }, 5000)
            }
        })
spinner.style.display='none'            
})()