(()=>{

let _hubName = ""
let refresh = 5000

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
            updateRefresh: function(event) {
                refresh = parseInt(prompt("Seconds to refresh", "5"), 10) * 1000
            },
            toggleAutoRefresh : function(event) {
                if (event.srcElement.checked) {
                 intervalTime = new Date()   
                 intervalId = setInterval(()=>{
                    currentTime = new Date()
                    this.elapsed = Math.round((refresh-Math.abs(currentTime-intervalTime))/1000) + 1 //moment(currentTime).from(intervalTime)
                    if (currentTime-intervalTime>refresh){
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
            _hubName="<not configured>"
        } else {
            _hubName=json
            fetch('/api/deviceList')
                .then( resp => resp.json())
                .then( devices => createVueApp(devices))           
            }
        })
})()