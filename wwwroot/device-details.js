/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable max-classes-per-file */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
(() => {
  class CommandParam {
    constructor(name, schema) {
      this.name = name;
      this.schema = schema;
    }
  }

  class Detail {
    constructor(schema, name, description) {
      this.schema = schema;
      this.name = name;
      this.description = description;
      this.commandParam = undefined;
    }

    addCommandParam(name, schema) {
      this.commandParam = new CommandParam(name, schema);
    }
  }

  class InterfaceData {
    constructor(urn, name) {
      this.urn = urn;
      this.name = name;
      this.details = [];
    }
  }

  const deviceDetails = new Vue({
    el: '#deviceDetails',
    data: {
      deviceId: '',
      pnpInterfaces: [],
    }
  });

  const params = new URLSearchParams(location.search);
  deviceDetails.deviceId = params.get('deviceId');

  fetch(`/api/getInterfaces?deviceId=${deviceDetails.deviceId}`)
    .then((interfaceResponse) => interfaceResponse.json())
    .then((interfaceMap) => {
      for (const name in interfaceMap) {
        const urn = interfaceMap[name];
        const newInterface = new InterfaceData(urn, name);
        deviceDetails.pnpInterfaces.push(newInterface);

        fetch(`/api/getInterfaceDetails?urn=${urn}`)
          .then((propResponse) => propResponse.json())
          .then((details) => {
            details.forEach((detail) => {
              const newDetail = new Detail(detail['@type'], detail.name, detail.description);
              if (newDetail.schema === 'Command' && !!detail.request) {
                newDetail.addCommandParam(detail.request.name, detail.request.schema);
              }
              newInterface.details.push(newDetail);
            });
          });
      }
    });
})();

// Runs the command from the source form
function runCommand(form) {
  // Clear the result form ahead of running the command
  form.result.value = '';

  // Determine if the parameter needs to be wrapped in quotation marks
  let param = '';
  if (form.param) {
    if (form.schema.value === 'string' && !form.param.value.startsWith('"')) {
      param = `"${form.param.value}"`;
    } else {
      param = form.param.value;
    }
  }
  const uri = encodeURI(`/api/runCommand?deviceId=${form.deviceId.value}&interfaceName=${form.interfaceName.value}&command=${form.command.value}&param=${param}`);

  fetch(
    uri,
    {
      method: 'POST'
    })
    .then((response) => response.json())
    .then((json) => {
      form.result.value = JSON.stringify(json);
    });

  // Prevent the page from navigating or refreshing
  form.onsubmit.arguments[0].returnValue = false;
}