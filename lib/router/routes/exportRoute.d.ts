import express, { Router } from 'express';
import { Authorization, BulkDataAccess, ExportType } from 'fhir-works-on-aws-interface';
export default class ExportRoute {
    readonly router: Router;
    private exportHandler;
    private serverUrl;
    constructor(serverUrl: string, bulkDataAccess: BulkDataAccess, authService: Authorization);
    initiateExportRequests(req: express.Request, res: express.Response, exportType: ExportType): Promise<void>;
    init(): void;
}
