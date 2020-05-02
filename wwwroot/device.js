import * as apiClient from './apiClient.js'

(async ()=> {

    const deviceDetails = new Vue({
        el: '#deviceDetails',
        data: {
            deviceId: '',
            modelId: '',
            showTwin: false,
            toggleIcon: '-',
            twin: '{}',
            hasModelId: false, 
            knownModelId: false
        },
        filters: {
            pretty: function(value) {
              return JSON.stringify(JSON.parse(value), null, 2);
            }
        },
        methods: {
            toggleTwin : function() {
                this.showTwin = !this.showTwin
                this.toggleIcon = (this.toggleIcon==='+') ? '-' : '+'
            },
            loadDeviceTwin: async function() {
                const deviceTwin = await apiClient.getDeviceTwin(this.deviceId)
                this.twin = JSON.stringify(deviceTwin)
                this.showTwin = true
                this.toggleIcon = '-'
            },
            loadDigitalTwin: async function() {
                const  digitalTwin = await apiClient.getDigitalTwin(this.deviceId)
                this.twin = JSON.stringify(digitalTwin)
                this.showTwin = true
                this.toggleIcon = '-'
            },
            loadDigitalTwin2: async function() {
                const  digitalTwin2 = await apiClient.getDigitalTwin2(this.deviceId)
                this.twin = JSON.stringify(digitalTwin2)
                if (digitalTwin2.$metadata && digitalTwin2.$metadata.$model) {
                    this.modelId = digitalTwin2.$metadata.$model
                    this.hasModelId = true
                } else {
                    this.modelId = "not found in $metadata"
                }
                this.showTwin = true
                this.toggleIcon = '-'
            },
            loadModel: async function() {
                const modelContent = await apiClient.getModelById(this.modelId)
                if (modelContent) {
                    this.twin = JSON.stringify(modelContent)
                    this.knownModelId = true
                }  else {
                    this.twin = JSON.stringify("Unknown ModelID")
                }
            }
        }
    })

    const params = new URLSearchParams(location.search)
    deviceDetails.deviceId = params.get('deviceId')

})()