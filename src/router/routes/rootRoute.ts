/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import express, { Router } from 'express';
import {
    Authorization,
    Bundle,
    FhirVersion,
    SystemOperation,
    Search,
    History,
    GenericResource,
    Resources,
} from 'fhir-works-on-aws-interface';
import createError from 'http-errors';
import BundleHandler from '../bundle/bundleHandler';
import RootHandler from '../handlers/rootHandler';
import RouteHelper from './routeHelper';

export default class RootRoute {
    readonly router: Router;

    private bundleHandler: BundleHandler;

    private rootHandler: RootHandler;

    private operations: SystemOperation[];

    constructor(
        operations: SystemOperation[],
        fhirVersion: FhirVersion,
        serverUrl: string,
        bundle: Bundle,
        search: Search,
        history: History,
        authService: Authorization,
        supportedGenericResources: string[],
        genericResource?: GenericResource,
        resources?: Resources,
    ) {
        this.router = express.Router();
        this.operations = operations;
        this.bundleHandler = new BundleHandler(
            bundle,
            serverUrl,
            fhirVersion,
            authService,
            supportedGenericResources,
            genericResource,
            resources,
        );
        this.rootHandler = new RootHandler(search, history, serverUrl);
        this.init();
    }

    init() {
        if (this.operations.includes('transaction') || this.operations.includes('batch')) {
            this.router.post(
                '/',
                RouteHelper.wrapAsync(async (req: express.Request, res: express.Response) => {
                    if (req.body.resourceType === 'Bundle') {
                        if (req.body.type.toLowerCase() === 'transaction') {
                            const response = await this.bundleHandler.processTransaction(
                                req.body,
                                res.locals.userIdentity,
                            );
                            res.send(response);
                        } else if (req.body.type.toLowerCase() === 'batch') {
                            const response = await this.bundleHandler.processBatch(req.body, res.locals.userIdentity);
                            res.send(response);
                        } else {
                            throw new createError.BadRequest('This root path can only process a Bundle');
                        }
                    } else {
                        throw new createError.BadRequest('This root path can only process a Bundle');
                    }
                }),
            );
        }
        if (this.operations.includes('search-system')) {
            this.router.get(
                '/',
                RouteHelper.wrapAsync(async (req: express.Request, res: express.Response) => {
                    const searchParamQuery = req.query;
                    const response = await this.rootHandler.globalSearch(searchParamQuery);
                    res.send(response);
                }),
            );
        }
        if (this.operations.includes('history-system')) {
            this.router.get(
                '/_history',
                RouteHelper.wrapAsync(async (req: express.Request, res: express.Response) => {
                    const searchParamQuery = req.query;
                    const response = await this.rootHandler.globalHistory(searchParamQuery);
                    res.send(response);
                }),
            );
        }
    }
}
