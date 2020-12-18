import { Authorization, BulkDataAccess, GetExportStatusResponse, InitiateExportRequest, KeyValueMap } from 'fhir-works-on-aws-interface';
export default class ExportHandler {
    private bulkDataAccess;
    private authService;
    constructor(bulkDataAccess: BulkDataAccess, authService: Authorization);
    initiateExport(initiateExportRequest: InitiateExportRequest): Promise<string>;
    getExportJobStatus(jobId: string, userIdentity: KeyValueMap): Promise<GetExportStatusResponse>;
    cancelExport(jobId: string, userIdentity: KeyValueMap): Promise<void>;
    private checkIfRequesterHasAccessToJob;
}
