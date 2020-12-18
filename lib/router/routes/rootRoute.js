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
const bundleHandler_1 = __importDefault(require("../bundle/bundleHandler"));
const rootHandler_1 = __importDefault(require("../handlers/rootHandler"));
const routeHelper_1 = __importDefault(require("./routeHelper"));
class RootRoute {
    constructor(operations, fhirVersion, serverUrl, bundle, search, history, authService, supportedGenericResources, genericResource, resources) {
        this.router = express_1.default.Router();
        this.operations = operations;
        this.bundleHandler = new bundleHandler_1.default(bundle, serverUrl, fhirVersion, authService, supportedGenericResources, genericResource, resources);
        this.rootHandler = new rootHandler_1.default(search, history, serverUrl);
        this.init();
    }
    init() {
        if (this.operations.includes('transaction') || this.operations.includes('batch')) {
            this.router.post('/', routeHelper_1.default.wrapAsync(async (req, res) => {
                if (req.body.resourceType === 'Bundle') {
                    if (req.body.type.toLowerCase() === 'transaction') {
                        const response = await this.bundleHandler.processTransaction(req.body, res.locals.userIdentity);
                        res.send(response);
                    }
                    else if (req.body.type.toLowerCase() === 'batch') {
                        const response = await this.bundleHandler.processBatch(req.body, res.locals.userIdentity);
                        res.send(response);
                    }
                    else {
                        throw new http_errors_1.default.BadRequest('This root path can only process a Bundle');
                    }
                }
                else {
                    throw new http_errors_1.default.BadRequest('This root path can only process a Bundle');
                }
            }));
        }
        if (this.operations.includes('search-system')) {
            this.router.get('/', routeHelper_1.default.wrapAsync(async (req, res) => {
                const searchParamQuery = req.query;
                const response = await this.rootHandler.globalSearch(searchParamQuery);
                res.send(response);
            }));
        }
        if (this.operations.includes('history-system')) {
            this.router.get('/_history', routeHelper_1.default.wrapAsync(async (req, res) => {
                const searchParamQuery = req.query;
                const response = await this.rootHandler.globalHistory(searchParamQuery);
                res.send(response);
            }));
        }
    }
}
exports.default = RootRoute;
//# sourceMappingURL=rootRoute.js.map