// tslint:disable

/// <reference path="../../typings/tsd.d.ts" />

import * as request from "superagent";
import {
    SuperAgentStatic,
    SuperAgentRequest,
    Response
} from "superagent";

export type RequestHeaders = {
    [header: string]: string;
}
export type RequestHeadersHandler = (headers: RequestHeaders) => RequestHeaders;

export type ConfigureAgentHandler = (agent: SuperAgentStatic) => SuperAgentStatic;

export type ConfigureRequestHandler = (agent: SuperAgentRequest) => SuperAgentRequest;

export type CallbackHandler = (err: any, res ? : request.Response) => void;

export type Order = {
    'id' ? : number;
    'petId' ? : number;
    'quantity' ? : number;
    'shipDate' ? : string;
    'status' ? : "placed" | "approved" | "delivered";
    'complete' ? : boolean;
} & {
    [key: string]: any;
};

export type Category = {
    'id' ? : number;
    'name' ? : string;
} & {
    [key: string]: any;
};

export type User = {
    'id' ? : number;
    'username' ? : string;
    'firstName' ? : string;
    'lastName' ? : string;
    'email' ? : string;
    'password' ? : string;
    'phone' ? : string;
    'userStatus' ? : number;
} & {
    [key: string]: any;
};

export type Tag = {
    'id' ? : number;
    'name' ? : string;
} & {
    [key: string]: any;
};

export type Pet = {
    'id' ? : number;
    'category' ? : Category;
    'name': string;
    'photoUrls': Array < string >
    ;
    'tags' ? : Array < Tag >
    ;
    'status' ? : "available" | "pending" | "sold";
} & {
    [key: string]: any;
};

export type ApiResponse = {
    'code' ? : number;
    'type' ? : string;
    'message' ? : string;
} & {
    [key: string]: any;
};

export type Response_findPetsByStatus_200 = Array < Pet >
;

export type Response_findPetsByTags_200 = Array < Pet >
;

export type Response_getInventory_200 = {} & {
    [key: string]: number;
};

export type Response_loginUser_200 = string;

export type Logger = {
    log: (line: string) => any
};

export interface ResponseWithBody < S extends number, T > extends Response {
    status: S;
    body: T;
}

export type QueryParameters = {
    [param: string]: any
};

export interface CommonRequestOptions {
    $queryParameters ? : QueryParameters;
    $domain ? : string;
    $path ? : string | ((path: string) => string);
    $retries ? : number; // number of retries; see: https://github.com/visionmedia/superagent/blob/master/docs/index.md#retrying-requests
    $timeout ? : number; // request timeout in milliseconds; see: https://github.com/visionmedia/superagent/blob/master/docs/index.md#timeouts
    $deadline ? : number; // request deadline in milliseconds; see: https://github.com/visionmedia/superagent/blob/master/docs/index.md#timeouts
}

/**
 * This is a sample server Petstore server.  You can find out more about     Swagger at [http://swagger.io](http://swagger.io) or on [irc.freenode.net, #swagger](http://swagger.io/irc/).      For this sample, you can use the api key `special-key` to test the authorization     filters.
 * @class ApiClient
 * @param {(string)} [domainOrOptions] - The project domain.
 */
export class ApiClient {

    private domain: string = "https://petstore.swagger.io/v2";
    private errorHandlers: CallbackHandler[] = [];
    private requestHeadersHandler ? : RequestHeadersHandler;
    private configureAgentHandler ? : ConfigureAgentHandler;
    private configureRequestHandler ? : ConfigureRequestHandler;

    constructor(domain ? : string, private logger ? : Logger) {
        if (domain) {
            this.domain = domain;
        }
    }

    getDomain() {
        return this.domain;
    }

    addErrorHandler(handler: CallbackHandler) {
        this.errorHandlers.push(handler);
    }

    setRequestHeadersHandler(handler: RequestHeadersHandler) {
        this.requestHeadersHandler = handler;
    }

    setConfigureAgentHandler(handler: ConfigureAgentHandler) {
        this.configureAgentHandler = handler;
    }

    setConfigureRequestHandler(handler: ConfigureRequestHandler) {
        this.configureRequestHandler = handler;
    }

    private request(method: string, url: string, body: any, headers: RequestHeaders, queryParameters: QueryParameters, form: any, reject: CallbackHandler, resolve: CallbackHandler, opts: CommonRequestOptions) {
        if (this.logger) {
            this.logger.log(`Call ${method} ${url}`);
        }

        const agent = this.configureAgentHandler ?
            this.configureAgentHandler(request.default) :
            request.default;

        let req = agent(method, url);
        if (this.configureRequestHandler) {
            req = this.configureRequestHandler(req);
        }

        req = req.query(queryParameters);

        if (this.requestHeadersHandler) {
            headers = this.requestHeadersHandler({
                ...headers
            });
        }

        req.set(headers);

        if (body) {
            req.send(body);

            if (typeof(body) === 'object' && !(body.constructor.name === 'Buffer')) {
                headers['content-type'] = 'application/json';
            }
        }

        if (Object.keys(form).length > 0) {
            req.type('form');
            req.send(form);
        }

        if (opts.$retries && opts.$retries > 0) {
            req.retry(opts.$retries);
        }

        if (opts.$timeout && opts.$timeout > 0 || opts.$deadline && opts.$deadline > 0) {
            req.timeout({
                deadline: opts.$deadline,
                response: opts.$timeout
            });
        }

        req.end((error, response) => {
            // an error will also be emitted for a 4xx and 5xx status code
            // the error object will then have error.status and error.response fields
            // see superagent error handling: https://github.com/visionmedia/superagent/blob/master/docs/index.md#error-handling
            if (error) {
                reject(error);
                this.errorHandlers.forEach(handler => handler(error));
            } else {
                resolve(response);
            }
        });
    }

    private convertParameterCollectionFormat < T > (param: T, collectionFormat: string | undefined): T | string {
        if (Array.isArray(param) && param.length >= 2) {
            switch (collectionFormat) {
                case "csv":
                    return param.join(",");
                case "ssv":
                    return param.join(" ");
                case "tsv":
                    return param.join("\t");
                case "pipes":
                    return param.join("|");
                default:
                    return param;
            }
        }

        return param;
    }

    addPetURL(parameters: {
        'body': Pet,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/pet';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        queryParameters = {};

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * Add a new pet to the store
     * @method
     * @name ApiClient#addPet
     * @param {} body - Pet object that needs to be added to the store
     */
    addPet(parameters: {
        'body': Pet,
    } & CommonRequestOptions): Promise < ResponseWithBody < 405, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/pet';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['accept'] = 'application/xml, application/json';
            headers['content-type'] = 'application/json';

            if (parameters['body'] !== undefined) {
                body = parameters['body'];
            }

            if (parameters['body'] === undefined) {
                reject(new Error('Missing required  parameter: body'));
                return;
            }

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            form = queryParameters;
            queryParameters = {};

            this.request('POST', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    updatePetURL(parameters: {
        'body': Pet,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/pet';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * Update an existing pet
     * @method
     * @name ApiClient#updatePet
     * @param {} body - Pet object that needs to be added to the store
     */
    updatePet(parameters: {
        'body': Pet,
    } & CommonRequestOptions): Promise < ResponseWithBody < 400, void > | ResponseWithBody < 404, void > | ResponseWithBody < 405, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/pet';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['accept'] = 'application/xml, application/json';
            headers['content-type'] = 'application/json';

            if (parameters['body'] !== undefined) {
                body = parameters['body'];
            }

            if (parameters['body'] === undefined) {
                reject(new Error('Missing required  parameter: body'));
                return;
            }

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            this.request('PUT', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    findPetsByStatusURL(parameters: {
        'status': Array < "available" | "pending" | "sold" >
            ,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/pet/findByStatus';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        if (parameters['status'] !== undefined) {
            queryParameters['status'] = this.convertParameterCollectionFormat(
                parameters['status'],
                'multi'
            );
        }

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * Multiple status values can be provided with comma separated strings
     * @method
     * @name ApiClient#findPetsByStatus
     * @param {array} status - Status values that need to be considered for filter
     */
    findPetsByStatus(parameters: {
        'status': Array < "available" | "pending" | "sold" >
            ,
    } & CommonRequestOptions): Promise < ResponseWithBody < 200, Response_findPetsByStatus_200 > | ResponseWithBody < 400, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/pet/findByStatus';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['accept'] = 'application/xml, application/json';

            if (parameters['status'] !== undefined) {
                queryParameters['status'] = this.convertParameterCollectionFormat(
                    parameters['status'],
                    'multi'
                );
            }

            if (parameters['status'] === undefined) {
                reject(new Error('Missing required  parameter: status'));
                return;
            }

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            this.request('GET', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    getPetByIdURL(parameters: {
        'petId': number,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/pet/{petId}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        path = path.replace(
            '{petId}',
            `${encodeURIComponent(this.convertParameterCollectionFormat(
                        parameters['petId'],
                        ''
                    ).toString())}`
        );

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * Returns a single pet
     * @method
     * @name ApiClient#getPetById
     * @param {integer} petId - ID of pet to return
     */
    getPetById(parameters: {
        'petId': number,
    } & CommonRequestOptions): Promise < ResponseWithBody < 200, Pet > | ResponseWithBody < 400, void > | ResponseWithBody < 404, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/pet/{petId}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['accept'] = 'application/xml, application/json';

            path = path.replace(
                '{petId}',
                `${encodeURIComponent(this.convertParameterCollectionFormat(
                    parameters['petId'],
                    ''
                ).toString())}`
            );

            if (parameters['petId'] === undefined) {
                reject(new Error('Missing required  parameter: petId'));
                return;
            }

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            this.request('GET', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    updatePetWithFormURL(parameters: {
        'petId': number,
        'name' ? : string,
        'status' ? : string,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/pet/{petId}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        path = path.replace(
            '{petId}',
            `${encodeURIComponent(this.convertParameterCollectionFormat(
                        parameters['petId'],
                        ''
                    ).toString())}`
        );

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        queryParameters = {};

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * Updates a pet in the store with form data
     * @method
     * @name ApiClient#updatePetWithForm
     * @param {integer} petId - ID of pet that needs to be updated
     * @param {string} name - Updated name of the pet
     * @param {string} status - Updated status of the pet
     */
    updatePetWithForm(parameters: {
        'petId': number,
        'name' ? : string,
        'status' ? : string,
    } & CommonRequestOptions): Promise < ResponseWithBody < 405, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/pet/{petId}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['accept'] = 'application/xml, application/json';
            headers['content-type'] = 'application/x-www-form-urlencoded';

            path = path.replace(
                '{petId}',
                `${encodeURIComponent(this.convertParameterCollectionFormat(
                    parameters['petId'],
                    ''
                ).toString())}`
            );

            if (parameters['petId'] === undefined) {
                reject(new Error('Missing required  parameter: petId'));
                return;
            }

            if (parameters['name'] !== undefined) {
                form['name'] = parameters['name'];
            }

            if (parameters['status'] !== undefined) {
                form['status'] = parameters['status'];
            }

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            form = queryParameters;
            queryParameters = {};

            this.request('POST', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    deletePetURL(parameters: {
        'apiKey' ? : string,
        'petId': number,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/pet/{petId}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        path = path.replace(
            '{petId}',
            `${encodeURIComponent(this.convertParameterCollectionFormat(
                        parameters['petId'],
                        ''
                    ).toString())}`
        );

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * Deletes a pet
     * @method
     * @name ApiClient#deletePet
     * @param {string} apiKey - This is a sample server Petstore server.  You can find out more about     Swagger at [http://swagger.io](http://swagger.io) or on [irc.freenode.net, #swagger](http://swagger.io/irc/).      For this sample, you can use the api key `special-key` to test the authorization     filters.
     * @param {integer} petId - Pet id to delete
     */
    deletePet(parameters: {
        'apiKey' ? : string,
        'petId': number,
    } & CommonRequestOptions): Promise < ResponseWithBody < 400, void > | ResponseWithBody < 404, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/pet/{petId}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['accept'] = 'application/xml, application/json';

            if (parameters['apiKey'] !== undefined) {
                headers['api_key'] = parameters['apiKey'];
            }

            path = path.replace(
                '{petId}',
                `${encodeURIComponent(this.convertParameterCollectionFormat(
                    parameters['petId'],
                    ''
                ).toString())}`
            );

            if (parameters['petId'] === undefined) {
                reject(new Error('Missing required  parameter: petId'));
                return;
            }

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            this.request('DELETE', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    uploadFileURL(parameters: {
        'petId': number,
        'additionalMetadata' ? : string,
        'file' ? : {},
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/pet/{petId}/uploadImage';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        path = path.replace(
            '{petId}',
            `${encodeURIComponent(this.convertParameterCollectionFormat(
                        parameters['petId'],
                        ''
                    ).toString())}`
        );

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        queryParameters = {};

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * uploads an image
     * @method
     * @name ApiClient#uploadFile
     * @param {integer} petId - ID of pet to update
     * @param {string} additionalMetadata - Additional data to pass to server
     * @param {file} file - file to upload
     */
    uploadFile(parameters: {
        'petId': number,
        'additionalMetadata' ? : string,
        'file' ? : {},
    } & CommonRequestOptions): Promise < ResponseWithBody < 200, ApiResponse >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/pet/{petId}/uploadImage';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['accept'] = 'application/json';
            headers['content-type'] = 'multipart/form-data';

            path = path.replace(
                '{petId}',
                `${encodeURIComponent(this.convertParameterCollectionFormat(
                    parameters['petId'],
                    ''
                ).toString())}`
            );

            if (parameters['petId'] === undefined) {
                reject(new Error('Missing required  parameter: petId'));
                return;
            }

            if (parameters['additionalMetadata'] !== undefined) {
                form['additionalMetadata'] = parameters['additionalMetadata'];
            }

            if (parameters['file'] !== undefined) {
                form['file'] = parameters['file'];
            }

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            form = queryParameters;
            queryParameters = {};

            this.request('POST', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    getInventoryURL(parameters: {} & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/store/inventory';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * Returns a map of status codes to quantities
     * @method
     * @name ApiClient#getInventory
     */
    getInventory(parameters: {} & CommonRequestOptions): Promise < ResponseWithBody < 200, Response_getInventory_200 >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/store/inventory';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['accept'] = 'application/json';

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            this.request('GET', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    placeOrderURL(parameters: {
        'body': Order,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/store/order';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        queryParameters = {};

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * Place an order for a pet
     * @method
     * @name ApiClient#placeOrder
     * @param {} body - order placed for purchasing the pet
     */
    placeOrder(parameters: {
        'body': Order,
    } & CommonRequestOptions): Promise < ResponseWithBody < 200, Order > | ResponseWithBody < 400, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/store/order';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['accept'] = 'application/xml, application/json';

            if (parameters['body'] !== undefined) {
                body = parameters['body'];
            }

            if (parameters['body'] === undefined) {
                reject(new Error('Missing required  parameter: body'));
                return;
            }

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            form = queryParameters;
            queryParameters = {};

            this.request('POST', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    getOrderByIdURL(parameters: {
        'orderId': number,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/store/order/{orderId}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        path = path.replace(
            '{orderId}',
            `${encodeURIComponent(this.convertParameterCollectionFormat(
                        parameters['orderId'],
                        ''
                    ).toString())}`
        );

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * For valid response try integer IDs with value >= 1 and <= 10.         Other values will generated exceptions
     * @method
     * @name ApiClient#getOrderById
     * @param {integer} orderId - ID of pet that needs to be fetched
     */
    getOrderById(parameters: {
        'orderId': number,
    } & CommonRequestOptions): Promise < ResponseWithBody < 200, Order > | ResponseWithBody < 400, void > | ResponseWithBody < 404, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/store/order/{orderId}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['accept'] = 'application/xml, application/json';

            path = path.replace(
                '{orderId}',
                `${encodeURIComponent(this.convertParameterCollectionFormat(
                    parameters['orderId'],
                    ''
                ).toString())}`
            );

            if (parameters['orderId'] === undefined) {
                reject(new Error('Missing required  parameter: orderId'));
                return;
            }

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            this.request('GET', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    deleteOrderURL(parameters: {
        'orderId': number,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/store/order/{orderId}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        path = path.replace(
            '{orderId}',
            `${encodeURIComponent(this.convertParameterCollectionFormat(
                        parameters['orderId'],
                        ''
                    ).toString())}`
        );

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * For valid response try integer IDs with positive integer value.         Negative or non-integer values will generate API errors
     * @method
     * @name ApiClient#deleteOrder
     * @param {integer} orderId - ID of the order that needs to be deleted
     */
    deleteOrder(parameters: {
        'orderId': number,
    } & CommonRequestOptions): Promise < ResponseWithBody < 400, void > | ResponseWithBody < 404, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/store/order/{orderId}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['accept'] = 'application/xml, application/json';

            path = path.replace(
                '{orderId}',
                `${encodeURIComponent(this.convertParameterCollectionFormat(
                    parameters['orderId'],
                    ''
                ).toString())}`
            );

            if (parameters['orderId'] === undefined) {
                reject(new Error('Missing required  parameter: orderId'));
                return;
            }

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            this.request('DELETE', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    createUserURL(parameters: {
        'body': User,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/user';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        queryParameters = {};

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * This can only be done by the logged in user.
     * @method
     * @name ApiClient#createUser
     * @param {} body - Created user object
     */
    createUser(parameters: {
        'body': User,
    } & CommonRequestOptions): Promise < ResponseWithBody < number, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/user';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['accept'] = 'application/xml, application/json';

            if (parameters['body'] !== undefined) {
                body = parameters['body'];
            }

            if (parameters['body'] === undefined) {
                reject(new Error('Missing required  parameter: body'));
                return;
            }

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            form = queryParameters;
            queryParameters = {};

            this.request('POST', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    createUsersWithArrayInputURL(parameters: {
        'body': Array < User >
            ,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/user/createWithArray';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        queryParameters = {};

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * Creates list of users with given input array
     * @method
     * @name ApiClient#createUsersWithArrayInput
     * @param {} body - List of user object
     */
    createUsersWithArrayInput(parameters: {
        'body': Array < User >
            ,
    } & CommonRequestOptions): Promise < ResponseWithBody < number, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/user/createWithArray';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['accept'] = 'application/xml, application/json';

            if (parameters['body'] !== undefined) {
                body = parameters['body'];
            }

            if (parameters['body'] === undefined) {
                reject(new Error('Missing required  parameter: body'));
                return;
            }

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            form = queryParameters;
            queryParameters = {};

            this.request('POST', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    createUsersWithListInputURL(parameters: {
        'body': Array < User >
            ,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/user/createWithList';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        queryParameters = {};

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * Creates list of users with given input array
     * @method
     * @name ApiClient#createUsersWithListInput
     * @param {} body - List of user object
     */
    createUsersWithListInput(parameters: {
        'body': Array < User >
            ,
    } & CommonRequestOptions): Promise < ResponseWithBody < number, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/user/createWithList';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['accept'] = 'application/xml, application/json';

            if (parameters['body'] !== undefined) {
                body = parameters['body'];
            }

            if (parameters['body'] === undefined) {
                reject(new Error('Missing required  parameter: body'));
                return;
            }

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            form = queryParameters;
            queryParameters = {};

            this.request('POST', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    loginUserURL(parameters: {
        'username': string,
        'password': string,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/user/login';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        if (parameters['username'] !== undefined) {
            queryParameters['username'] = this.convertParameterCollectionFormat(
                parameters['username'],
                ''
            );
        }

        if (parameters['password'] !== undefined) {
            queryParameters['password'] = this.convertParameterCollectionFormat(
                parameters['password'],
                ''
            );
        }

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * Logs user into the system
     * @method
     * @name ApiClient#loginUser
     * @param {string} username - The user name for login
     * @param {string} password - The password for login in clear text
     */
    loginUser(parameters: {
        'username': string,
        'password': string,
    } & CommonRequestOptions): Promise < ResponseWithBody < 200, Response_loginUser_200 > | ResponseWithBody < 400, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/user/login';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['accept'] = 'application/xml, application/json';

            if (parameters['username'] !== undefined) {
                queryParameters['username'] = this.convertParameterCollectionFormat(
                    parameters['username'],
                    ''
                );
            }

            if (parameters['username'] === undefined) {
                reject(new Error('Missing required  parameter: username'));
                return;
            }

            if (parameters['password'] !== undefined) {
                queryParameters['password'] = this.convertParameterCollectionFormat(
                    parameters['password'],
                    ''
                );
            }

            if (parameters['password'] === undefined) {
                reject(new Error('Missing required  parameter: password'));
                return;
            }

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            this.request('GET', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    logoutUserURL(parameters: {} & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/user/logout';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * Logs out current logged in user session
     * @method
     * @name ApiClient#logoutUser
     */
    logoutUser(parameters: {} & CommonRequestOptions): Promise < ResponseWithBody < number, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/user/logout';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['accept'] = 'application/xml, application/json';

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            this.request('GET', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    getUserByNameURL(parameters: {
        'username': string,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/user/{username}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        path = path.replace(
            '{username}',
            `${encodeURIComponent(this.convertParameterCollectionFormat(
                        parameters['username'],
                        ''
                    ).toString())}`
        );

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * Get user by user name
     * @method
     * @name ApiClient#getUserByName
     * @param {string} username - The name that needs to be fetched. Use user1 for testing. 
     */
    getUserByName(parameters: {
        'username': string,
    } & CommonRequestOptions): Promise < ResponseWithBody < 200, User > | ResponseWithBody < 400, void > | ResponseWithBody < 404, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/user/{username}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['accept'] = 'application/xml, application/json';

            path = path.replace(
                '{username}',
                `${encodeURIComponent(this.convertParameterCollectionFormat(
                    parameters['username'],
                    ''
                ).toString())}`
            );

            if (parameters['username'] === undefined) {
                reject(new Error('Missing required  parameter: username'));
                return;
            }

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            this.request('GET', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    updateUserURL(parameters: {
        'username': string,
        'body': User,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/user/{username}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        path = path.replace(
            '{username}',
            `${encodeURIComponent(this.convertParameterCollectionFormat(
                        parameters['username'],
                        ''
                    ).toString())}`
        );

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * This can only be done by the logged in user.
     * @method
     * @name ApiClient#updateUser
     * @param {string} username - name that need to be updated
     * @param {} body - Updated user object
     */
    updateUser(parameters: {
        'username': string,
        'body': User,
    } & CommonRequestOptions): Promise < ResponseWithBody < 400, void > | ResponseWithBody < 404, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/user/{username}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['accept'] = 'application/xml, application/json';

            path = path.replace(
                '{username}',
                `${encodeURIComponent(this.convertParameterCollectionFormat(
                    parameters['username'],
                    ''
                ).toString())}`
            );

            if (parameters['username'] === undefined) {
                reject(new Error('Missing required  parameter: username'));
                return;
            }

            if (parameters['body'] !== undefined) {
                body = parameters['body'];
            }

            if (parameters['body'] === undefined) {
                reject(new Error('Missing required  parameter: body'));
                return;
            }

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            this.request('PUT', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    deleteUserURL(parameters: {
        'username': string,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/user/{username}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        path = path.replace(
            '{username}',
            `${encodeURIComponent(this.convertParameterCollectionFormat(
                        parameters['username'],
                        ''
                    ).toString())}`
        );

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * This can only be done by the logged in user.
     * @method
     * @name ApiClient#deleteUser
     * @param {string} username - The name that needs to be deleted
     */
    deleteUser(parameters: {
        'username': string,
    } & CommonRequestOptions): Promise < ResponseWithBody < 400, void > | ResponseWithBody < 404, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/user/{username}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['accept'] = 'application/xml, application/json';

            path = path.replace(
                '{username}',
                `${encodeURIComponent(this.convertParameterCollectionFormat(
                    parameters['username'],
                    ''
                ).toString())}`
            );

            if (parameters['username'] === undefined) {
                reject(new Error('Missing required  parameter: username'));
                return;
            }

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            this.request('DELETE', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

}

export default ApiClient;