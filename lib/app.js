"use strict";
/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateServerlessRouter = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const fhir_works_on_aws_interface_1 = require("fhir-works-on-aws-interface");
const genericResourceRoute_1 = __importDefault(require("./router/routes/genericResourceRoute"));
const configHandler_1 = __importDefault(require("./configHandler"));
const metadataRoute_1 = __importDefault(require("./router/routes/metadataRoute"));
const resourceHandler_1 = __importDefault(require("./router/handlers/resourceHandler"));
const rootRoute_1 = __importDefault(require("./router/routes/rootRoute"));
const errorHandling_1 = require("./router/routes/errorHandling");
const exportRoute_1 = __importDefault(require("./router/routes/exportRoute"));
const wellKnownUriRoute_1 = __importDefault(require("./router/routes/wellKnownUriRoute"));
const configVersionSupported = 1;
function generateServerlessRouter(fhirConfig, supportedGenericResources, corsOptions) {
    if (configVersionSupported !== fhirConfig.configVersion) {
        throw new Error(`This router does not support ${fhirConfig.configVersion} version`);
    }
    const configHandler = new configHandler_1.default(fhirConfig, supportedGenericResources);
    const { fhirVersion, genericResource } = fhirConfig.profile;
    const serverUrl = fhirConfig.server.url;
    let hasCORSEnabled = false;
    const app = express_1.default();
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use(express_1.default.json({
        type: ['application/json', 'application/fhir+json', 'application/json-patch+json'],
        // 6MB is the maximum payload that Lambda accepts
        limit: '6mb',
    }));
    // Add cors handler before auth to allow pre-flight requests without auth.
    if (corsOptions) {
        app.use(cors_1.default(corsOptions));
        hasCORSEnabled = true;
    }
    // Metadata
    const metadataRoute = new metadataRoute_1.default(fhirVersion, configHandler, hasCORSEnabled);
    app.use('/metadata', metadataRoute.router);
    if (fhirConfig.auth.strategy.service === 'SMART-on-FHIR') {
        // well-known URI http://www.hl7.org/fhir/smart-app-launch/conformance/index.html#using-well-known
        const smartStrat = fhirConfig.auth.strategy.oauthPolicy;
        if (smartStrat.capabilities) {
            const wellKnownUriRoute = new wellKnownUriRoute_1.default(smartStrat);
            app.use('/.well-known/smart-configuration', wellKnownUriRoute.router);
        }
    }
    // AuthZ
    app.use(async (req, res, next) => {
        try {
            const requestInformation = fhir_works_on_aws_interface_1.getRequestInformation(req.method, req.proxy);
            // Clean auth header (remove 'Bearer ')
            req.headers.authorization = fhir_works_on_aws_interface_1.cleanAuthHeader(req.headers.authorization);
            res.locals.userIdentity = await fhirConfig.auth.authorization.verifyAccessToken({
                ...requestInformation,
                accessToken: req.headers.authorization,
            });
            next();
        }
        catch (e) {
            next(e);
        }
    });
    // Export
    if (fhirConfig.profile.bulkDataAccess) {
        const exportRoute = new exportRoute_1.default(serverUrl, fhirConfig.profile.bulkDataAccess, fhirConfig.auth.authorization);
        app.use('/', exportRoute.router);
    }
    // Special Resources
    if (fhirConfig.profile.resources) {
        Object.entries(fhirConfig.profile.resources).forEach(async (resourceEntry) => {
            const { operations, persistence, typeSearch, typeHistory, fhirVersions } = resourceEntry[1];
            if (fhirVersions.includes(fhirVersion)) {
                const resourceHandler = new resourceHandler_1.default(persistence, typeSearch, typeHistory, fhirVersion, serverUrl);
                const route = new genericResourceRoute_1.default(operations, resourceHandler, fhirConfig.auth.authorization);
                app.use(`/${resourceEntry[0]}`, route.router);
                app.use(`/tenant/:tenantId/${resourceEntry[0]}`, route.router);
            }
        });
    }
    // Generic Resource Support
    // Make a list of resources to make
    const genericFhirResources = configHandler.getGenericResources(fhirVersion);
    if (genericResource && genericResource.fhirVersions.includes(fhirVersion)) {
        const genericOperations = configHandler.getGenericOperations(fhirVersion);
        const genericResourceHandler = new resourceHandler_1.default(genericResource.persistence, genericResource.typeSearch, genericResource.typeHistory, fhirVersion, serverUrl);
        const genericRoute = new genericResourceRoute_1.default(genericOperations, genericResourceHandler, fhirConfig.auth.authorization);
        // Set up Resource for each generic resource
        genericFhirResources.forEach(async (resourceType) => {
            app.use(`/${resourceType}`, genericRoute.router);
            app.use(`/tenant/:tenantId/${resourceType}`, genericRoute.router);
        });
    }
    // Root Post (Bundle/Global Search)
    if (fhirConfig.profile.systemOperations.length > 0) {
        const rootRoute = new rootRoute_1.default(fhirConfig.profile.systemOperations, fhirVersion, serverUrl, fhirConfig.profile.bundle, fhirConfig.profile.systemSearch, fhirConfig.profile.systemHistory, fhirConfig.auth.authorization, genericFhirResources, genericResource, fhirConfig.profile.resources);
        app.use('/', rootRoute.router);
    }
    app.use(errorHandling_1.applicationErrorMapper);
    app.use(errorHandling_1.httpErrorHandler);
    app.use(errorHandling_1.unknownErrorHandler);
    return app;
}
exports.generateServerlessRouter = generateServerlessRouter;
//# sourceMappingURL=app.js.map