(()=>{

let refresh = 5000

function createVueApp() {
    var intervalId
  
    var app = new Vue({
        el: '#deviceList',
        data: {
            hub: "not set",
            devices: {},
            now: new Date().toLocaleTimeString(),
            elapsed: ''
        },
        methods: {
            updateRefresh: function(event) {
                refresh = parseInt(prompt("Seconds to refresh", "5"), 10) * 1000
            },
            refreshDevices : function() {
                fetch('/api/deviceList')
                    .then( resp => resp.json())
                    .then( devicesDto => this.devices = devicesDto)
            },
            postConnectionString: function(event) {
                console.log(connectionstring.value)
                fetch("/api/connection-string",
                    {
                        method: 'POST',
                        headers : { 
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        body : `connectionstring=${encodeURIComponent(connectionstring.value)}`
                    })
                    .then(resp=>resp.json())
                    .then(json=>this.hub=JSON.stringify(json))
                this.refreshDevices()
                $('#formConnectionString').collapse('hide')
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
                        this.refreshDevices()
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
    return app
}

var app = createVueApp()


fetch('/api/connection-string')
    .then(resp=> resp.json())
    .then(json=>{
        if (json.length<20) {
            app.hub="<not configured>"
        } else {
            app.hub=json
            app.refreshDevices()
        }})
})()