"use strict";
/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_errors_1 = __importDefault(require("http-errors"));
const routeHelper_1 = __importDefault(require("./routeHelper"));
class GenericResourceRoute {
    constructor(operations, handler, authService) {
        this.operations = operations;
        this.handler = handler;
        this.router = express_1.default.Router();
        this.authService = authService;
        this.init();
    }
    init() {
        // TODO handle HTTP response code
        if (this.operations.includes('read')) {
            // READ
            this.router.get('/:id', routeHelper_1.default.wrapAsync(async (req, res) => {
                // Get the ResourceType looks like '/Patient'
                const resourceType = req.proxy.split('/')[0];
                const { id } = req.params;
                const { tenantId } = req;
                const response = await this.handler.read(resourceType, id, tenantId);
                const updatedReadResponse = await this.authService.authorizeAndFilterReadResponse({
                    operation: 'read',
                    userIdentity: res.locals.userIdentity,
                    readResponse: response,
                });
                if (updatedReadResponse.meta) {
                    res.set({
                        ETag: `W/"${updatedReadResponse.meta.versionId}"`,
                        'Last-Modified': updatedReadResponse.meta.lastUpdated,
                    });
                }
                res.send(updatedReadResponse);
            }));
        }
        // VREAD
        if (this.operations.includes('vread')) {
            this.router.get('/:id/_history/:vid', routeHelper_1.default.wrapAsync(async (req, res) => {
                // Get the ResourceType looks like '/Patient'
                const resourceType = req.proxy.split('/')[0];
                const { id, vid } = req.params;
                const { tenantId } = req;
                const response = await this.handler.vRead(resourceType, id, vid, tenantId);
                const updatedReadResponse = await this.authService.authorizeAndFilterReadResponse({
                    operation: 'vread',
                    userIdentity: res.locals.userIdentity,
                    readResponse: response,
                });
                if (updatedReadResponse.meta) {
                    res.set({
                        ETag: `W/"${updatedReadResponse.meta.versionId}"`,
                        'Last-Modified': updatedReadResponse.meta.lastUpdated,
                    });
                }
                res.send(updatedReadResponse);
            }));
        }
        // Type History
        if (this.operations.includes('history-type')) {
            this.router.get('/_history', routeHelper_1.default.wrapAsync(async (req, res) => {
                // Get the ResourceType looks like '/Patient'
                const resourceType = req.proxy.split('/')[0];
                const searchParamQuery = req.query;
                const response = await this.handler.typeHistory(resourceType, searchParamQuery);
                const updatedReadResponse = await this.authService.authorizeAndFilterReadResponse({
                    operation: 'history-type',
                    userIdentity: res.locals.userIdentity,
                    readResponse: response,
                });
                res.send(updatedReadResponse);
            }));
        }
        // Instance History
        if (this.operations.includes('history-instance')) {
            this.router.get('/:id/_history', routeHelper_1.default.wrapAsync(async (req, res) => {
                // Get the ResourceType looks like '/Patient'
                const resourceType = req.proxy.split('/')[0];
                const searchParamQuery = req.query;
                const { id } = req.params;
                const response = await this.handler.instanceHistory(resourceType, id, searchParamQuery);
                const updatedReadResponse = await this.authService.authorizeAndFilterReadResponse({
                    operation: 'history-instance',
                    userIdentity: res.locals.userIdentity,
                    readResponse: response,
                });
                res.send(updatedReadResponse);
            }));
        }
        if (this.operations.includes('search-type')) {
            // SEARCH
            this.router.get('/', routeHelper_1.default.wrapAsync(async (req, res) => {
                // Get the ResourceType looks like '/Patient'
                const resourceType = req.proxy.split('/')[0];
                const searchParamQuery = req.query;
                const allowedResourceTypes = await this.authService.getAllowedResourceTypesForOperation({
                    operation: 'search-type',
                    userIdentity: res.locals.userIdentity,
                });
                const response = await this.handler.typeSearch(resourceType, searchParamQuery, allowedResourceTypes);
                const updatedReadResponse = await this.authService.authorizeAndFilterReadResponse({
                    operation: 'search-type',
                    userIdentity: res.locals.userIdentity,
                    readResponse: response,
                });
                res.send(updatedReadResponse);
            }));
        }
        // CREATE
        if (this.operations.includes('create')) {
            this.router.post('/', routeHelper_1.default.wrapAsync(async (req, res) => {
                // Get the ResourceType looks like '/Patient'
                const resourceType = req.proxy.split('/')[0];
                const { body } = req;
                const { tenantId } = req;
                await this.authService.isWriteRequestAuthorized({
                    resourceBody: body,
                    operation: 'create',
                    userIdentity: res.locals.userIdentity,
                });
                const response = await this.handler.create(resourceType, body, tenantId);
                if (response.meta) {
                    res.set({ ETag: `W/"${response.meta.versionId}"`, 'Last-Modified': response.meta.lastUpdated });
                }
                res.status(201).send(response);
            }));
        }
        // UPDATE
        if (this.operations.includes('update')) {
            this.router.put('/:id', routeHelper_1.default.wrapAsync(async (req, res) => {
                const resourceType = req.proxy.split('/')[0];
                const { id } = req.params;
                const { body } = req;
                const { tenantId } = req;
                if (body.id === null || body.id !== id) {
                    throw new http_errors_1.default.BadRequest(`Can not update resource with ID[${id}], while the given request payload has an ID[${body.id}]`);
                }
                await this.authService.isWriteRequestAuthorized({
                    resourceBody: body,
                    operation: 'update',
                    userIdentity: res.locals.userIdentity,
                });
                const response = await this.handler.update(resourceType, id, body, tenantId);
                if (response.meta) {
                    res.set({ ETag: `W/"${response.meta.versionId}"`, 'Last-Modified': response.meta.lastUpdated });
                }
                res.send(response);
            }));
        }
        // PATCH
        if (this.operations.includes('patch')) {
            this.router.patch('/:id', routeHelper_1.default.wrapAsync(async (req, res) => {
                const resourceType = req.proxy.split('/')[0];
                const { id } = req.params;
                const { body } = req;
                if (body.id === null || body.id !== id) {
                    throw new http_errors_1.default.BadRequest(`Can not update resource with ID[${id}], while the given request payload has an ID[${body.id}]`);
                }
                await this.authService.isWriteRequestAuthorized({
                    resourceBody: body,
                    operation: 'patch',
                    userIdentity: res.locals.userIdentity,
                });
                const { tenantId } = req;
                const response = await this.handler.patch(resourceType, id, body, tenantId);
                if (response.meta) {
                    res.set({ ETag: `W/"${response.meta.versionId}"`, 'Last-Modified': response.meta.lastUpdated });
                }
                res.send(response);
            }));
        }
        // DELETE
        if (this.operations.includes('delete')) {
            this.router.delete('/:id', routeHelper_1.default.wrapAsync(async (req, res) => {
                // Get the ResourceType looks like '/Patient'
                const { tenantId } = req;
                const resourceType = req.proxy.split('/')[0];
                const { id } = req.params;
                const readResponse = await this.handler.read(resourceType, id, tenantId);
                await this.authService.isWriteRequestAuthorized({
                    resourceBody: readResponse,
                    operation: 'delete',
                    userIdentity: res.locals.userIdentity,
                });
                const response = await this.handler.delete(resourceType, id, tenantId);
                res.send(response);
            }));
        }
    }
}
exports.default = GenericResourceRoute;
//# sourceMappingURL=genericResourceRoute.js.map