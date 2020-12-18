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
const cap_rest_resource_template_1 = require("./cap.rest.resource.template");
const cap_rest_security_template_1 = __importDefault(require("./cap.rest.security.template"));
const cap_rest_template_1 = __importDefault(require("./cap.rest.template"));
const cap_template_1 = __importDefault(require("./cap.template"));
class MetadataHandler {
    constructor(handler, hasCORSEnabled = false) {
        this.configHandler = handler;
        this.hasCORSEnabled = hasCORSEnabled;
    }
    generateResources(fhirVersion) {
        const specialResourceTypes = this.configHandler.getSpecialResourceTypes(fhirVersion);
        let generatedResources = [];
        if (this.configHandler.config.profile.genericResource) {
            const generatedResourcesTypes = this.configHandler.getGenericResources(fhirVersion, specialResourceTypes);
            generatedResources = cap_rest_resource_template_1.makeGenericResources(generatedResourcesTypes, this.configHandler.getGenericOperations(fhirVersion));
        }
        // Add the special resources
        specialResourceTypes.forEach((resourceType) => {
            generatedResources.push(cap_rest_resource_template_1.makeResource(resourceType, this.configHandler.getSpecialResourceOperations(resourceType, fhirVersion)));
        });
        return generatedResources;
    }
    async capabilities(request) {
        const { auth, orgName, server, profile } = this.configHandler.config;
        if (!this.configHandler.isVersionSupported(request.fhirVersion)) {
            throw new http_errors_1.default.NotFound(`FHIR version ${request.fhirVersion} is not supported`);
        }
        const generatedResources = this.generateResources(request.fhirVersion);
        const security = cap_rest_security_template_1.default(auth, this.hasCORSEnabled);
        const rest = cap_rest_template_1.default(generatedResources, security, profile.systemOperations, !!profile.bulkDataAccess);
        const capStatement = cap_template_1.default(rest, orgName, server.url, request.fhirVersion);
        return {
            message: 'success',
            resource: capStatement,
        };
    }
}
exports.default = MetadataHandler;
//# sourceMappingURL=metadataHandler.js.map