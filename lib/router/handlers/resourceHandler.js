"use strict";
/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bundleGenerator_1 = __importDefault(require("../bundle/bundleGenerator"));
const operationsGenerator_1 = __importDefault(require("../operationsGenerator"));
const validator_1 = __importDefault(require("../validation/validator"));
class ResourceHandler {
    constructor(dataService, searchService, historyService, fhirVersion, serverUrl) {
        this.validator = new validator_1.default(fhirVersion);
        this.dataService = dataService;
        this.searchService = searchService;
        this.historyService = historyService;
        this.serverUrl = serverUrl;
    }
    async create(resourceType, resource, tenantId) {
        this.validator.validate(resourceType, resource);
        const createResponse = await this.dataService.createResource({ resourceType, resource, tenantId });
        return createResponse.resource;
    }
    async update(resourceType, id, resource, tenantId) {
        this.validator.validate(resourceType, resource);
        const updateResponse = await this.dataService.updateResource({ resourceType, id, resource, tenantId });
        return updateResponse.resource;
    }
    async patch(resourceType, id, resource, tenantId) {
        // TODO Add request validation around patching
        const patchResponse = await this.dataService.patchResource({ resourceType, id, resource, tenantId });
        return patchResponse.resource;
    }
    async typeSearch(resourceType, queryParams, allowedResourceTypes) {
        const searchResponse = await this.searchService.typeSearch({
            resourceType,
            queryParams,
            baseUrl: this.serverUrl,
            allowedResourceTypes,
        });
        return bundleGenerator_1.default.generateBundle(this.serverUrl, queryParams, searchResponse.result, 'searchset', resourceType);
    }
    async typeHistory(resourceType, queryParams) {
        const historyResponse = await this.historyService.typeHistory({
            resourceType,
            queryParams,
            baseUrl: this.serverUrl,
        });
        return bundleGenerator_1.default.generateBundle(this.serverUrl, queryParams, historyResponse.result, 'history', resourceType);
    }
    async instanceHistory(resourceType, id, queryParams) {
        const historyResponse = await this.historyService.instanceHistory({
            id,
            resourceType,
            queryParams,
            baseUrl: this.serverUrl,
        });
        return bundleGenerator_1.default.generateBundle(this.serverUrl, queryParams, historyResponse.result, 'history', resourceType, id);
    }
    async read(resourceType, id, tenantId) {
        const getResponse = await this.dataService.readResource({ resourceType, id, tenantId });
        return getResponse.resource;
    }
    async vRead(resourceType, id, vid, tenantId) {
        const getResponse = await this.dataService.vReadResource({ resourceType, id, vid, tenantId });
        return getResponse.resource;
    }
    async delete(resourceType, id, tenantId) {
        await this.dataService.deleteResource({ resourceType, id, tenantId });
        return operationsGenerator_1.default.generateSuccessfulDeleteOperation();
    }
}
exports.default = ResourceHandler;
//# sourceMappingURL=resourceHandler.js.map