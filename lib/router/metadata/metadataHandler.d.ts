import { Capabilities, CapabilitiesRequest, GenericResponse } from 'fhir-works-on-aws-interface';
import ConfigHandler from '../../configHandler';
export default class MetadataHandler implements Capabilities {
    configHandler: ConfigHandler;
    readonly hasCORSEnabled: boolean;
    constructor(handler: ConfigHandler, hasCORSEnabled?: boolean);
    private generateResources;
    capabilities(request: CapabilitiesRequest): Promise<GenericResponse>;
}
