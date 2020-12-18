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
class ExportHandler {
    constructor(bulkDataAccess, authService) {
        this.bulkDataAccess = bulkDataAccess;
        this.authService = authService;
    }
    async initiateExport(initiateExportRequest) {
        return this.bulkDataAccess.initiateExport(initiateExportRequest);
    }
    async getExportJobStatus(jobId, userIdentity) {
        const jobDetails = await this.bulkDataAccess.getExportStatus(jobId);
        await this.checkIfRequesterHasAccessToJob(jobDetails, userIdentity);
        return jobDetails;
    }
    async cancelExport(jobId, userIdentity) {
        const jobDetails = await this.bulkDataAccess.getExportStatus(jobId);
        await this.checkIfRequesterHasAccessToJob(jobDetails, userIdentity);
        if (['completed', 'failed'].includes(jobDetails.jobStatus)) {
            throw new http_errors_1.default.BadRequest(`Job cannot be canceled because job is already in ${jobDetails.jobStatus} state`);
        }
        await this.bulkDataAccess.cancelExport(jobId);
    }
    async checkIfRequesterHasAccessToJob(jobDetails, userIdentity) {
        const { jobOwnerId } = jobDetails;
        const accessBulkDataJobRequest = { userIdentity, jobOwnerId };
        await this.authService.isAccessBulkDataJobAllowed(accessBulkDataJobRequest);
    }
}
exports.default = ExportHandler;
//# sourceMappingURL=exportHandler.js.map