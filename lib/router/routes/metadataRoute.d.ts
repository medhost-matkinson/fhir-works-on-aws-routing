import { Router } from 'express';
import { FhirVersion } from 'fhir-works-on-aws-interface';
import ConfigHandler from '../../configHandler';
export default class MetadataRoute {
    readonly fhirVersion: FhirVersion;
    readonly router: Router;
    private metadataHandler;
    constructor(fhirVersion: FhirVersion, fhirConfigHandler: ConfigHandler, hasCORSEnabled: boolean);
    private init;
}
