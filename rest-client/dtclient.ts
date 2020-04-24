import * as msRest  from '@azure/ms-rest-js'
import {IoTHubTokenCredentials} from './iothub_token_credentials'

export type DigitalTwinGetResponse = {
    body: any;
    _response: msRest.HttpResponse & {
        bodyAsText: string;
        parsedBody: any;
      };
  };

export class DTClient extends msRest.ServiceClient {
    apiVersion?: string;
    credentials: msRest.ServiceClientCredentials

    constructor(connString: string) {
        let creds = new IoTHubTokenCredentials(connString)
        let options : msRest.ServiceClientOptions = {
            deserializationContentTypes: { // application/ld+json isn't supported by autorest by default, which is why we need these options
                json: [
                'application/ld+json',
                'application/json',
                'text/json'
                ]
            }
        }
        super(creds, options)
        this.apiVersion = '2020-05-31-preview'
        this.credentials = creds
        this.baseUri = 'https://' + creds.getHubName()
    }
    getDigitalTwin(digitalTwinId: string) : Promise<DigitalTwinGetResponse> {
        let digitalTwinIdParam: msRest.OperationURLParameter = {
            parameterPath: "digitalTwinId",
            mapper: {
              required: true,
              serializedName: "digitalTwinId",
              type: {
                name: "String"
              }
            }
        }

        let apiVersion: msRest.OperationQueryParameter = {
            parameterPath: "apiVersion",
            mapper: {
              required: true,
              serializedName: "api-version",
              defaultValue: '2020-05-31-preview',
              type: {
                name: "String"
              }
            }
          };


        //let serializer : msRest.Serializer = new msRest.Serializer(Mappers)
        let getDTOpSpec: msRest.OperationSpec = {
            httpMethod : "GET",
            path: '/digitalTwins/{digitalTwinId}',
            urlParameters: [digitalTwinIdParam],
            queryParameters: [apiVersion],
            responses : {
                200: {
                  bodyMapper: {
                    serializedName: "parsedResponse",
                    type: {
                      name: "Object"
                    }
                  }
                },
                default: {}
            },
            serializer : new msRest.Serializer()
        }
        return this.sendOperationRequest({digitalTwinId}, getDTOpSpec) as Promise<DigitalTwinGetResponse>             
    }
}