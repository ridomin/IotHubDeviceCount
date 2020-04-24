const ServiceClient = require('@azure/ms-rest-js').ServiceClient

const client = new ServiceClient(null, null)
const req = {
    url: 'https://pnp-intcus11-test-12.private.azure-devices-int.net/digitaltwins/rido-pp/interfaces?api-version=2020-05-31-preview',
    method: 'GET'   
}
client.sendRequest(req).then(r=> console.log(r))