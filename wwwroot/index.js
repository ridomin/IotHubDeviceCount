(()=>{

function showDevicesList() {
    fetch('/api/deviceList')
        .then((resp)=>{return resp.json()})
        .then((json)=>{
            //console.log(json)
            devices = json.map((d)=>{return {id:d.deviceId, time:d.lastActivityTime, state:d.connectionState}})
            console.log(devices)
            var app = new Vue({
                el: '#listDevices',
                data: {
                    devices: devices
                }
            })
        })
}

fetch('/api/connection-string')
    .then((resp)=>{return resp.json()})
    .then((json)=>{
        connectionstring.value=json
        if (json.length<10) {
            connectionstring.value="set connection string"
        } else {
            setInterval(()=>{
                currentTime.innerText=new Date().toLocaleTimeString()
                fetch('/api/deviceCount')
                    .then((resp)=>{return resp.json()})
                    .then((json)=>{
                        numDevices.innerText=json
                        numDevices.onclick=showDevicesList
                    })
                }, 1000)
            }
        })
})()