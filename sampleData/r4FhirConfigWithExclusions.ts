import { FhirConfig, stubs } from 'fhir-works-on-aws-interface';

const config: FhirConfig = {
    configVersion: 1,
    orgName: 'Organization Name',
    auth: {
        strategy: {
            oauthPolicy: {
                authorizationEndpoint: 'http://example.com/authorization',
                tokenEndpoint: 'http://example.com/oauth2/token',
            },
            service: 'SMART-on-FHIR',
        },
        authorization: stubs.passThroughAuthz,
    },
    server: {
        url: 'http://example.com',
    },
    logging: {
        level: 'info',
    },
    //
    // Add any profiles you want to support.  Each profile can support multiple fhirVersions
    // This 'resource*' defaults to ALL resources not called out in excludedResources or resources array
    //
    profile: {
        fhirVersion: '4.0.1',
        systemOperations: ['search-system'],
        bundle: stubs.bundle,
        systemSearch: stubs.search,
        systemHistory: stubs.history,
        genericResource: {
            operations: ['read', 'history-instance', 'history-type'],
            excludedR4Resources: ['Organization', 'Account', 'Patient'],
            fhirVersions: ['4.0.1'],
            persistence: stubs.persistence,
            typeSearch: stubs.search,
            typeHistory: stubs.history,
        },
        resources: {
            AllergyIntolerance: {
                operations: ['create', 'update'],
                fhirVersions: ['4.0.1'],
                persistence: stubs.persistence,
                typeSearch: stubs.search,
                typeHistory: stubs.history,
            },
        },
    },
};

export default config;
