import {getDigitalTwin, getModelById} from './apiClient.js'

(async ()=> {

    const deviceDetails = new Vue({
        el: '#deviceDetails',
        data: {
            deviceId: '',
            modelId: '',
            components: []
        }
    })

    const params = new URLSearchParams(location.search)
    deviceDetails.deviceId = params.get('deviceId')

    // Has Model ID?
    const twin = await getDigitalTwin(deviceDetails.deviceId)
    if (!twin.$metadata.$model) {
        deviceDetails.modelId = 'This device did not announce the Model ID.'
        return
    }

    deviceDetails.modelId=twin.$metadata.$model

    // Known Model?
    const model = await getModelById(deviceDetails.modelId)
    if (!model) {
        deviceDetails.components.push({name:'Unknown Model ID'})
        return
    }

    for (let i = 0; i < model.contents.length; i++) {
        const c = model.contents[i];
        const component = {urn: c['schema'], name : c['name'], items: []}
        deviceDetails.components.push(component)

        const componentModel = await getModelById(component.urn)

        for (let i = 0; i <  componentModel.contents.length; i++) {
            const item = componentModel.contents[i];
            const instance = twin[component.name]
            if (instance[item.name]) {
              item.instance = instance[item.name]
              item.instanceMD = JSON.stringify(instance['$metadata'])
            }
            component.items.push(item)
        }
    }

})().catch(err=>console.log(err))
