"use strict";
/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const isEmpty_1 = __importDefault(require("lodash/isEmpty"));
const validator_1 = __importDefault(require("../validation/validator"));
const constants_1 = require("../../constants");
const bundleGenerator_1 = __importDefault(require("./bundleGenerator"));
const bundleParser_1 = __importDefault(require("./bundleParser"));
class BundleHandler {
    constructor(bundleService, serverUrl, fhirVersion, authService, supportedGenericResources, genericResource, resources) {
        this.bundleService = bundleService;
        this.serverUrl = serverUrl;
        this.authService = authService;
        this.supportedGenericResources = supportedGenericResources;
        this.genericResource = genericResource;
        this.resources = resources;
        this.validator = new validator_1.default(fhirVersion);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async processBatch(bundleRequestJson, userIdentity) {
        throw new http_errors_1.default.BadRequest('Currently this server only support transaction Bundles');
    }
    resourcesInBundleThatServerDoesNotSupport(bundleRequestJson) {
        const bundleEntriesNotSupported = [];
        const resourceTypeToOperations = bundleParser_1.default.getResourceTypeOperationsInBundle(bundleRequestJson);
        if (isEmpty_1.default(resourceTypeToOperations)) {
            return [];
        }
        // For now, entries in Bundle must be generic resource, because only one persistence obj can be passed into
        // bundleParser
        for (let i = 0; i < Object.keys(resourceTypeToOperations).length; i += 1) {
            const bundleResourceType = Object.keys(resourceTypeToOperations)[i];
            const bundleResourceOperations = resourceTypeToOperations[bundleResourceType];
            // 'Generic resource' includes bundle resourceType and Operation
            if (this.supportedGenericResources.includes(bundleResourceType)) {
                const operationsInBundleThatServerDoesNotSupport = bundleResourceOperations.filter(operation => {
                    var _a;
                    return !((_a = this.genericResource) === null || _a === void 0 ? void 0 : _a.operations.includes(operation));
                });
                if (operationsInBundleThatServerDoesNotSupport.length > 0) {
                    bundleEntriesNotSupported.push({
                        resource: bundleResourceType,
                        operations: operationsInBundleThatServerDoesNotSupport,
                    });
                }
            }
            else {
                bundleEntriesNotSupported.push({
                    resource: bundleResourceType,
                    operations: bundleResourceOperations,
                });
            }
        }
        return bundleEntriesNotSupported;
    }
    async processTransaction(bundleRequestJson, userIdentity) {
        const startTime = new Date();
        this.validator.validate('Bundle', bundleRequestJson);
        let requests;
        try {
            // TODO use the correct persistence layer
            const resourcesServerDoesNotSupport = this.resourcesInBundleThatServerDoesNotSupport(bundleRequestJson);
            if (resourcesServerDoesNotSupport.length > 0) {
                let message = '';
                resourcesServerDoesNotSupport.forEach(({ resource, operations }) => {
                    message += `${resource}: ${operations},`;
                });
                message = message.substring(0, message.length - 1);
                throw new Error(`Server does not support these resource and operations: {${message}}`);
            }
            if (this.genericResource) {
                requests = await bundleParser_1.default.parseResource(bundleRequestJson, this.genericResource.persistence, this.serverUrl);
            }
            else {
                throw new Error('Cannot process bundle');
            }
        }
        catch (e) {
            throw new http_errors_1.default.BadRequest(e.message);
        }
        await this.authService.isBundleRequestAuthorized({
            userIdentity,
            requests,
        });
        if (requests.length > constants_1.MAX_BUNDLE_ENTRIES) {
            throw new http_errors_1.default.BadRequest(`Maximum number of entries for a Bundle is ${constants_1.MAX_BUNDLE_ENTRIES}. There are currently ${requests.length} entries in this Bundle`);
        }
        const bundleServiceResponse = await this.bundleService.transaction({ requests, startTime });
        if (!bundleServiceResponse.success) {
            if (bundleServiceResponse.errorType === 'SYSTEM_ERROR') {
                throw new http_errors_1.default.InternalServerError(bundleServiceResponse.message);
            }
            else if (bundleServiceResponse.errorType === 'USER_ERROR') {
                throw new http_errors_1.default.BadRequest(bundleServiceResponse.message);
            }
        }
        return bundleGenerator_1.default.generateTransactionBundle(this.serverUrl, bundleServiceResponse.batchReadWriteResponses);
    }
}
exports.default = BundleHandler;
//# sourceMappingURL=bundleHandler.js.map