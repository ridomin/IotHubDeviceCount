(()=>{

function bind(devices) {
    var app = new Vue({
        el: '#listDevices',
        data: {
            devices: devices,
            now: new Date().toLocaleTimeString()
        }
    })
}

fetch('/api/connection-string')
.then(resp=> resp.json())
.then(json=>{
    connectionstring.value=json
    if (json.length<10) {
        connectionstring.value="set connection string"
    } else {
        //  setInterval(()=>{
            spinner.style.display='block'    

            fetch('/api/deviceList')
                .then( resp => resp.json())
                .then( devices => bind(devices))
            
            spinner.style.display='none'
          //      }, 5000)
            }
        })
})()