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
        }
    })

    const params = new URLSearchParams(location.search)
    deviceDetails.deviceId = params.get('deviceId')
    deviceDetails.modelId = params.get('modelId')

})()