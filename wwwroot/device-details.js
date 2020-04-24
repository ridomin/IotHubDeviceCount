/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable max-classes-per-file */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
(() => {
  class CommandParam {
    constructor (name, schema) {
      this.name = name
      this.schema = schema
    }
  }

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

  fetch(`/api/getDigitalTwin?deviceId=${deviceDetails.deviceId}`)
    .then(res=>res.json())
    .then(twin=> {
      if (!twin.$metadata.$model) {
        deviceDetails.modelId = 'This device did not announce the Model ID.'
        return
      }
      deviceDetails.modelId=twin.$metadata.$model

      fetch(`/api/getModelById?modelId=${deviceDetails.modelId}`)
        .then(res=>res.json())
        .then(json=> {
            if (!json) {
              deviceDetails.components.push({name:'Unknown Model ID'})
              return
            }
            const model = JSON.parse(json)
            if (deviceDetails.modelId!=model['@id']) {
               throw new Error("Model IDS do not match") 
            }
            for (let i = 0; i < model.contents.length; i++) {
              const c = model.contents[i];
              console.log(c['name'])
              const component = {urn: c['schema'], name : c['name'], items: []}
              deviceDetails.components.push(component)
              
              fetch(`/api/getModelById?modelId=${c['schema']}`)
                .then(res=>res.json())
                .then(json=> {
                    const items = JSON.parse(json)
                    for (let i = 0; i < items.contents.length; i++) {
                      const item = items.contents[i];
                      instance = twin[c['name']]
                      if (instance[item.name]) {
                        item.instance = instance[item.name]
                        item.instanceMD = JSON.stringify(instance['$metadata'])
                      }
                      component.items.push(item)
                    }
                })
            }
        })


      // for (const p in twin) {
      //   if ( p.substr(0, 1)!='$') {
      //     deviceDetails.components.push(new ComponentInfo('', p))
      //   }
      // }
    });
  
  // fetch(`/api/getInterfaces?deviceId=${deviceDetails.deviceId}`)
  //   .then((interfaceResponse) => interfaceResponse.json())
  //   .then((interfaceMap) => {
  //     for (const name in interfaceMap) {
  //       const urn = interfaceMap[name]
  //       const newInterface = new ComponentInfo(urn, name)
  //       deviceDetails.pnpInterfaces.push(newInterface)

  //       fetch(`/api/getInterfaceDetails?urn=${urn}`)
  //         .then((propResponse) => propResponse.json())
  //         .then((details) => {
  //           details.forEach((detail) => {
  //             const newDetail = new Detail(detail['@type'], detail.name, detail.description)
  //             if (newDetail.schema === 'Command' && !!detail.request) {
  //               newDetail.addCommandParam(detail.request.name, detail.request.schema)
  //             }
  //             newInterface.details.push(newDetail)
  //           })
  //         })
  //     }
  //   })
})()

// Runs the command from the source form
function runCommand (form) {
  // Clear the result form ahead of running the command
  form.result.value = ''

  // Determine if the parameter needs to be wrapped in quotation marks
  let param = ''
  if (form.param) {
    if (form.schema.value === 'string' && !form.param.value.startsWith('"')) {
      param = `"${form.param.value}"`
    } else {
      param = form.param.value
    }
  }
  const uri = encodeURI(`/api/runCommand?deviceId=${form.deviceId.value}&interfaceName=${form.interfaceName.value}&command=${form.command.value}&param=${param}`)

  fetch(
    uri,
    {
      method: 'POST'
    })
    .then((response) => response.json())
    .then((json) => {
      form.result.value = JSON.stringify(json)
    })

  // Prevent the page from navigating or refreshing
  form.onsubmit.arguments[0].returnValue = false
}
