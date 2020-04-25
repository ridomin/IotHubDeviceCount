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
    console.log(twin)
    if (!twin.$metadata.$model) {
        deviceDetails.modelId = 'This device did not announce the Model ID.'
        return
    }

    deviceDetails.modelId=twin.$metadata.$model

    // Known Model?
    const model = await getModelById(deviceDetails.modelId)
    if (!model) {
        //deviceDetails.components.push({name:'Unknown Model ID'})
        deviceDetails.modelId+='\nUnknown Model ID'
        
        // show twin instance without model

        for (const p in twin) {
            if (p.substring(0,1)!='$') { 
                const component = {urn: 'no schema', name : p, items: []}
                for (const pi in twin[p]) {
                    console.log(pi)
                    component.items.push({ '@type': '?', schema: 'string', name: pi, instance: twin[p][pi]})
                }
                deviceDetails.components.push(component)
            }
        }


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
