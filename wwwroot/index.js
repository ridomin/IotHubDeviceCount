(()=>{

function createVueApp() {
    var intervalId
  
    var app = new Vue({
        el: '#deviceList',
        data: {
            hub: "not set",
            devices: {},
            deviceStatus : {},
            elapsed: '5',
            refresh: 5000,
            refreshEnabled: false,
            loading : false
        },
        methods: {
            updateRefresh: function(event) {
                let interval = parseInt(prompt("Seconds to refresh", this.refresh /1000), 10) * 1000
                if (isNaN(interval)) interval=5000
                this.refresh = interval
            },
            refreshCount: function(){
                this.deviceStatus.Disconnected =  this.devices.filter(d=>d.state==='Disconnected').length
                this.deviceStatus.Connected = this.devices.filter(d=>d.state==='Connected').length
                this.deviceStatus.Total = this.devices.length
                this.loading=false
            },
            refreshDevices : function() {
                this.loading = true;
                fetch('/api/deviceList')
                    .then( resp => resp.json())
                    .then( devicesDto => {
                        this.devices = devicesDto
                        this.refreshCount()
                    })
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
                        .then(text=> this.hub=text)
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