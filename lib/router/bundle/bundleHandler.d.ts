import { Bundle, Authorization, FhirVersion, GenericResource, Resources, TypeOperation, KeyValueMap } from 'fhir-works-on-aws-interface';
import BundleHandlerInterface from './bundleHandlerInterface';
export default class BundleHandler implements BundleHandlerInterface {
    private bundleService;
    private validator;
    readonly serverUrl: string;
    private authService;
    private genericResource?;
    private resources?;
    private supportedGenericResources;
    constructor(bundleService: Bundle, serverUrl: string, fhirVersion: FhirVersion, authService: Authorization, supportedGenericResources: string[], genericResource?: GenericResource, resources?: Resources);
    processBatch(bundleRequestJson: any, userIdentity: KeyValueMap): Promise<void>;
    resourcesInBundleThatServerDoesNotSupport(bundleRequestJson: any): {
        resource: string;
        operations: TypeOperation[];
    }[];
    processTransaction(bundleRequestJson: any, userIdentity: KeyValueMap): Promise<{
        resourceType: string;
        id: string;
        type: string;
        link: {
            relation: string;
            url: string;
        }[];
        entry: never[];
    }>;
}
