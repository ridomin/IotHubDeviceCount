"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var msRest = require("@azure/ms-rest-js");
var iothub_token_credentials_1 = require("./iothub_token_credentials");
var DTClient = /** @class */ (function (_super) {
    __extends(DTClient, _super);
    function DTClient(connString) {
        var _this = this;
        var creds = new iothub_token_credentials_1.IoTHubTokenCredentials(connString);
        var options = {
            deserializationContentTypes: {
                json: [
                    'application/ld+json',
                    'application/json',
                    'text/json'
                ]
            }
        };
        _this = _super.call(this, creds, options) || this;
        _this.apiVersion = '2020-05-31-preview';
        _this.credentials = creds;
        _this.baseUri = 'https://' + creds.getHubName();
        return _this;
    }
    DTClient.prototype.getDigitalTwin = function (digitalTwinId) {
        var digitalTwinIdParam = {
            parameterPath: "digitalTwinId",
            mapper: {
                required: true,
                serializedName: "digitalTwinId",
                type: {
                    name: "String"
                }
            }
        };
        var apiVersion = {
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
        var getDTOpSpec = {
            httpMethod: "GET",
            path: '/digitalTwins/{digitalTwinId}',
            urlParameters: [digitalTwinIdParam],
            queryParameters: [apiVersion],
            responses: {
                200: {
                    bodyMapper: {
                        serializedName: "parsedResponse",
                        type: {
                            name: "Object"
                        }
                    }
                },
                "default": {}
            },
            serializer: new msRest.Serializer()
        };
        return this.sendOperationRequest({ digitalTwinId: digitalTwinId }, getDTOpSpec);
    };
    return DTClient;
}(msRest.ServiceClient));
exports.DTClient = DTClient;
