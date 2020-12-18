import { KeyValueMap } from 'fhir-works-on-aws-interface';
export default interface BundleHandlerInterface {
    processBatch(resource: any, userIdentity: KeyValueMap): any;
    processTransaction(resource: any, userIdentity: KeyValueMap): any;
}
