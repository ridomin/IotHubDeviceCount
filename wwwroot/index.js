(()=>{

function getHubNameFrom(connectionstring){
    const hubRegex = /(?<=HostName=).*(?=;SharedAccessKeyName)/i.exec(connectionstring)
    const hubName = hubRegex.length > 0 ? hubRegex[0] : ''
    return hubName
}

function bind(hubName,devices) {
    var app = new Vue({
        el: '#deviceList',
        data: {
            hub: hubName,
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
        formConnectionString.collapse('show')
    } else {
        hubName = getHubNameFrom(json)
        //  setInterval(()=>{

            fetch('/api/deviceList')
                .then( resp => resp.json())
                .then( devices => bind(hubName,devices))
            
          //      }, 5000)
            }
        })
})()