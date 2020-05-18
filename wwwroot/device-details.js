import { getDigitalTwin2, getModelById } from './apiClient.js'

(async () => {
  const deviceDetails = new Vue({
    el: '#deviceDetails',
    data: {
      deviceId: '',
      modelId: '',
      components: []
    }
  })

  const params = new URLSearchParams(window.location.search)
  deviceDetails.deviceId = params.get('deviceId')
  deviceDetails.modelId = params.get('modelId')

  const twin = await getDigitalTwin2(deviceDetails.deviceId)
  const model = await getModelById(deviceDetails.modelId)
  for (let i = 0; i < model.contents.length; i++) {
    const c = model.contents[i]
    const component = { urn: c.schema, name: c.name, items: [] }
    deviceDetails.components.push(component)

    const componentModel = await getModelById(component.urn)

    for (let i = 0; i < componentModel.contents.length; i++) {
      const contentItem = componentModel.contents[i]
      const instance = twin[component.name]
      if (instance && instance[contentItem.name]) {
        contentItem.instance = instance[contentItem.name]
        contentItem.instanceMD = JSON.stringify(instance.$metadata)
      }
      const item = {
        type: contentItem['@type'],
        name: contentItem.name,
        schema: `[${contentItem.schema}]`,
        instance: contentItem.instance,
        instanceMD: contentItem.instanceMD
      }
      if (item.type === 'Command' && contentItem.request) {
        item.commandParam = { name: contentItem.request.name, schema: contentItem.request.schema }
      }
      component.items.push(item)
    }
  }
})().catch(err => console.log(err))
