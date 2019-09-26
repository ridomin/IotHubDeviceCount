(()=>{

function createVueApp() {
    var intervalId
  
    var app = new Vue({
        el: '#deviceList',
        data: {
            hub: "not set",
            devices: {},
            now: new Date().toLocaleTimeString(),
            elapsed: '',
            refresh: 5000,
            refreshEnabled: false
        },
        methods: {
            updateRefresh: function(event) {
                this.refresh = parseInt(prompt("Seconds to refresh", "5"), 10) * 1000
                if (isNaN(refresh)) this.refresh=5000
            },
            refreshDevices : function() {
                
                fetch('/api/deviceList')
                    .then( resp => resp.json())
                    .then( devicesDto => this.devices = devicesDto)
            },
            postConnectionString: function(event) {
                console.log(connectionstring.value)
                if (connectionstring.value.length>0){
                    fetch("/api/connection-string",
                        {
                            method: 'POST',
                            headers : { 
                                "Content-Type": "application/x-www-form-urlencoded"
                            },
                            body : `connectionstring=${encodeURIComponent(connectionstring.value)}`
                        })
                        .then(resp=>resp.json())
                        .then(text=> {
                            this.hub=text
                        })
                    this.refreshDevices()
                    $('#formConnectionString').collapse('hide')
                }
            },
            toggleAutoRefresh : function(event) {
                this.refreshEnabled=event.srcElement.checked
                if (this.refreshEnabled) {
                 intervalTime = new Date()   
                 intervalId = setInterval(()=>{
                    currentTime = new Date()
                    this.elapsed = Math.round((this.refresh-Math.abs(currentTime-intervalTime))/1000) + 1 //moment(currentTime).from(intervalTime)
                    if (currentTime-intervalTime>this.refresh){
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