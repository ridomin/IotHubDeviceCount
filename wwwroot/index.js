(()=>{

function getHubNameFrom(connectionstring){
    const hubRegex = /(?<=HostName=).*(?=;SharedAccessKeyName)/i.exec(connectionstring)
    const hubName = hubRegex.length > 0 ? hubRegex[0] : ''
    return hubName
}

let loadedTime = new Date()
let _hubName = ""
const REFRESH_TIMER = 5000

function createVueApp(devices) {
    var intervalId
    var app = new Vue({
        el: '#deviceList',
        data: {
            hub: _hubName,
            devices: devices,
            now: new Date().toLocaleTimeString(),
            elapsed: ''
        },
        methods: {
            toggleAutoRefresh : function(event) {
                if (event.srcElement.checked) {
                 intervalTime = new Date()   
                 intervalId = setInterval(()=>{
                     currentTime = new Date()
                     this.elapsed = Math.round(Math.abs((REFRESH_TIMER-(currentTime-intervalTime))/1000)) //moment(currentTime).from(intervalTime)
                    if (currentTime-intervalTime>REFRESH_TIMER){
                        console.log("timer")
                        intervalTime = currentTime
                        fetch('/api/deviceList')
                        .then( resp => resp.json())
                        .then( devicesDto => devices = devicesDto)
                    } else {
                        //console.log("wait")
                    }
                    }, 1000)
                } else {
                    clearInterval(intervalId)                        
                }
            }
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
        _hubName = getHubNameFrom(json)
        fetch('/api/deviceList')
            .then( resp => resp.json())
            .then( devices => createVueApp(devices))           
        }
    })
})()