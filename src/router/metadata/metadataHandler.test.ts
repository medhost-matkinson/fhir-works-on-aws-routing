/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { clone, stubs } from 'fhir-works-on-aws-interface';
import MetadataHandler from './metadataHandler';
import { makeOperation } from './cap.rest.resource.template';
import r4FhirConfigGeneric from '../../../sampleData/r4FhirConfigGeneric';
import r4FhirConfigWithExclusions from '../../../sampleData/r4FhirConfigWithExclusions';
import stu3FhirConfigWithExclusions from '../../../sampleData/stu3FhirConfigWithExclusions';
import r4FhirConfigNoGeneric from '../../../sampleData/r4FhirConfigNoGeneric';
import Validator from '../validation/validator';
import ConfigHandler from '../../configHandler';

const r4Validator = new Validator('4.0.1');
const stu3Validator = new Validator('3.0.1');

const SUPPORTED_R4_RESOURCES = [
    'Account',
    'ActivityDefinition',
    'AdverseEvent',
    'AllergyIntolerance',
    'Appointment',
    'AppointmentResponse',
    'AuditEvent',
    'Basic',
    'Binary',
    'BiologicallyDerivedProduct',
    'BodyStructure',
    'Bundle',
    'CapabilityStatement',
    'CarePlan',
    'CareTeam',
    'CatalogEntry',
    'ChargeItem',
    'ChargeItemDefinition',
    'Claim',
    'ClaimResponse',
    'ClinicalImpression',
    'CodeSystem',
    'Communication',
    'CommunicationRequest',
    'CompartmentDefinition',
    'Composition',
    'ConceptMap',
    'Condition',
    'Consent',
    'Contract',
    'Coverage',
    'CoverageEligibilityRequest',
    'CoverageEligibilityResponse',
    'DetectedIssue',
    'Device',
    'DeviceDefinition',
    'DeviceMetric',
    'DeviceRequest',
    'DeviceUseStatement',
    'DiagnosticReport',
    'DocumentManifest',
    'DocumentReference',
    'EffectEvidenceSynthesis',
    'Encounter',
    'Endpoint',
    'EnrollmentRequest',
    'EnrollmentResponse',
    'EpisodeOfCare',
    'EventDefinition',
    'Evidence',
    'EvidenceVariable',
    'ExampleScenario',
    'ExplanationOfBenefit',
    'FamilyMemberHistory',
    'Flag',
    'Goal',
    'GraphDefinition',
    'Group',
    'GuidanceResponse',
    'HealthcareService',
    'ImagingStudy',
    'Immunization',
    'ImmunizationEvaluation',
    'ImmunizationRecommendation',
    'ImplementationGuide',
    'InsurancePlan',
    'Invoice',
    'Library',
    'Linkage',
    'List',
    'Location',
    'Measure',
    'MeasureReport',
    'Media',
    'Medication',
    'MedicationAdministration',
    'MedicationDispense',
    'MedicationKnowledge',
    'MedicationRequest',
    'MedicationStatement',
    'MedicinalProduct',
    'MedicinalProductAuthorization',
    'MedicinalProductContraindication',
    'MedicinalProductIndication',
    'MedicinalProductIngredient',
    'MedicinalProductOperation',
    'MedicinalProductManufactured',
    'MedicinalProductPackaged',
    'MedicinalProductPharmaceutical',
    'MedicinalProductUndesirableEffect',
    'MessageDefinition',
    'MessageHeader',
    'MolecularSequence',
    'NamingSystem',
    'NutritionOrder',
    'Observation',
    'ObservationDefinition',
    'OperationDefinition',
    'OperationOutcome',
    'Organization',
    'OrganizationAffiliation',
    'Parameters',
    'Patient',
    'PaymentNotice',
    'PaymentReconciliation',
    'Person',
    'PlanDefinition',
    'Practitioner',
    'PractitionerRole',
    'Procedure',
    'Provenance',
    'Questionnaire',
    'QuestionnaireResponse',
    'RelatedPerson',
    'RequestGroup',
    'ResearchDefinition',
    'ResearchElementDefinition',
    'ResearchStudy',
    'ResearchSubject',
    'RiskAssessment',
    'RiskEvidenceSynthesis',
    'Schedule',
    'SearchParameter',
    'ServiceRequest',
    'Slot',
    'Specimen',
    'SpecimenDefinition',
    'StructureDefinition',
    'StructureMap',
    'Subscription',
    'Substance',
    'SubstancePolymer',
    'SubstanceProtein',
    'SubstanceReferenceInformation',
    'SubstanceSpecification',
    'SubstanceSourceMaterial',
    'SupplyDelivery',
    'SupplyRequest',
    'Task',
    'TerminologyCapabilities',
    'TestReport',
    'TestScript',
    'ValueSet',
    'VerificationResult',
    'VisionPrescription',
];

const SUPPORTED_STU3_RESOURCES = [
    'Account',
    'ActivityDefinition',
    'AdverseEvent',
    'AllergyIntolerance',
    'Appointment',
    'AppointmentResponse',
    'AuditEvent',
    'Basic',
    'Binary',
    'BodySite',
    'Bundle',
    'CapabilityStatement',
    'CarePlan',
    'CareTeam',
    'ChargeItem',
    'Claim',
    'ClaimResponse',
    'ClinicalImpression',
    'CodeSystem',
    'Communication',
    'CommunicationRequest',
    'CompartmentDefinition',
    'Composition',
    'ConceptMap',
    'Condition',
    'Consent',
    'Contract',
    'Coverage',
    'DataElement',
    'DetectedIssue',
    'Device',
    'DeviceComponent',
    'DeviceMetric',
    'DeviceRequest',
    'DeviceUseStatement',
    'DiagnosticReport',
    'DocumentManifest',
    'DocumentReference',
    'EligibilityRequest',
    'EligibilityResponse',
    'Encounter',
    'Endpoint',
    'EnrollmentRequest',
    'EnrollmentResponse',
    'EpisodeOfCare',
    'ExpansionProfile',
    'ExplanationOfBenefit',
    'FamilyMemberHistory',
    'Flag',
    'Goal',
    'GraphDefinition',
    'Group',
    'GuidanceResponse',
    'HealthcareService',
    'ImagingManifest',
    'ImagingStudy',
    'Immunization',
    'ImmunizationRecommendation',
    'ImplementationGuide',
    'Library',
    'Linkage',
    'List',
    'Location',
    'Measure',
    'MeasureReport',
    'Media',
    'Medication',
    'MedicationAdministration',
    'MedicationDispense',
    'MedicationRequest',
    'MedicationStatement',
    'MessageDefinition',
    'MessageHeader',
    'NamingSystem',
    'NutritionOrder',
    'Observation',
    'OperationDefinition',
    'OperationOutcome',
    'Organization',
    'Parameters',
    'Patient',
    'PaymentNotice',
    'PaymentReconciliation',
    'Person',
    'PlanDefinition',
    'Practitioner',
    'PractitionerRole',
    'Procedure',
    'ProcedureRequest',
    'ProcessRequest',
    'ProcessResponse',
    'Provenance',
    'Questionnaire',
    'QuestionnaireResponse',
    'ReferralRequest',
    'RelatedPerson',
    'RequestGroup',
    'ResearchStudy',
    'ResearchSubject',
    'RiskAssessment',
    'Schedule',
    'SearchParameter',
    'Sequence',
    'ServiceDefinition',
    'Slot',
    'Specimen',
    'StructureDefinition',
    'StructureMap',
    'Subscription',
    'Substance',
    'SupplyDelivery',
    'SupplyRequest',
    'Task',
    'TestScript',
    'TestReport',
    'ValueSet',
    'VisionPrescription',
];

describe('ERROR: test cases', () => {
    beforeEach(() => {
        // Ensures that for each test, we test the assertions in the catch block
        expect.hasAssertions();
    });
    test('STU3: Asking for V4 when only supports V3', async () => {
        // BUILD
        const configHandler: ConfigHandler = new ConfigHandler(stu3FhirConfigWithExclusions, SUPPORTED_STU3_RESOURCES);
        const metadataHandler: MetadataHandler = new MetadataHandler(configHandler);
        try {
            // OPERATE
            await metadataHandler.capabilities({ fhirVersion: '4.0.1', mode: 'full' });
        } catch (e) {
            // CHECK
            expect(e.name).toEqual('NotFoundError');
            expect(e.statusCode).toEqual(404);
            expect(e.message).toEqual(`FHIR version 4.0.1 is not supported`);
        }
    });

    test('R4: Asking for V3 when only supports V4', async () => {
        // BUILD
        const configHandler: ConfigHandler = new ConfigHandler(r4FhirConfigGeneric, SUPPORTED_R4_RESOURCES);
        const metadataHandler: MetadataHandler = new MetadataHandler(configHandler);
        try {
            // OPERATE
            await metadataHandler.capabilities({ fhirVersion: '3.0.1', mode: 'full' });
        } catch (e) {
            // CHECK
            expect(e.name).toEqual('NotFoundError');
            expect(e.statusCode).toEqual(404);
            expect(e.message).toEqual(`FHIR version 3.0.1 is not supported`);
        }
    });
});

test('STU3: FHIR Config V3 with 2 exclusions and search', async () => {
    const configHandler: ConfigHandler = new ConfigHandler(stu3FhirConfigWithExclusions, SUPPORTED_STU3_RESOURCES);
    const metadataHandler: MetadataHandler = new MetadataHandler(configHandler, true);
    const response = await metadataHandler.capabilities({ fhirVersion: '3.0.1', mode: 'full' });
    const { genericResource } = stu3FhirConfigWithExclusions.profile;
    const excludedResources = genericResource ? genericResource.excludedSTU3Resources || [] : [];
    const expectedSubset = {
        acceptUnknown: 'no',
        fhirVersion: '3.0.1',
    };
    expect(response.resource).toBeDefined();
    expect(response.resource).toMatchObject(expectedSubset);
    expect(response.resource.rest.length).toEqual(1);
    expect(response.resource.rest[0].resource.length).toEqual(
        SUPPORTED_STU3_RESOURCES.length - excludedResources.length,
    );
    expect(response.resource.rest[0].security.cors).toBeTruthy();
    // see if just READ is chosen for generic
    let isExcludedResourceFound = false;
    response.resource.rest[0].resource.forEach((resource: any) => {
        if (excludedResources.includes(resource.type)) {
            isExcludedResourceFound = true;
        }
        const expectedResourceSubset = {
            interaction: makeOperation(['read', 'create', 'update', 'vread', 'search-type']),
            updateCreate: true,
            searchParam: [
                {
                    name: 'ALL',
                    type: 'composite',
                    documentation: 'Support all fields.',
                },
            ],
        };
        expect(resource).toMatchObject(expectedResourceSubset);
    });
    expect(isExcludedResourceFound).toBeFalsy();

    expect(response.resource.rest[0].interaction).toEqual(
        makeOperation(stu3FhirConfigWithExclusions.profile.systemOperations),
    );
    expect(response.resource.rest[0].searchParam).toBeUndefined();
    expect(stu3Validator.validate('CapabilityStatement', response.resource)).toEqual({
        message: 'Success',
    });
});
test('R4: FHIR Config V4 without search', async () => {
    const configHandler: ConfigHandler = new ConfigHandler(r4FhirConfigGeneric, SUPPORTED_R4_RESOURCES);
    const metadataHandler: MetadataHandler = new MetadataHandler(configHandler);
    const response = await metadataHandler.capabilities({ fhirVersion: '4.0.1', mode: 'full' });
    expect(response.resource).toBeDefined();
    expect(response.resource.acceptUnknown).toBeUndefined();
    expect(response.resource.fhirVersion).toEqual('4.0.1');
    expect(response.resource.rest.length).toEqual(1);
    expect(response.resource.rest[0].resource.length).toEqual(SUPPORTED_R4_RESOURCES.length);
    expect(response.resource.rest[0].security.cors).toBeFalsy();
    // see if the four CRUD + vRead operations are chosen
    const expectedResourceSubset = {
        interaction: makeOperation(['create', 'read', 'update', 'delete', 'vread', 'history-instance']),
        updateCreate: true,
    };
    expect(response.resource.rest[0].resource[0]).toMatchObject(expectedResourceSubset);
    expect(response.resource.rest[0].interaction).toEqual(makeOperation(r4FhirConfigGeneric.profile.systemOperations));
    expect(response.resource.rest[0].searchParam).toBeUndefined();
    expect(r4Validator.validate('CapabilityStatement', response.resource)).toEqual({
        message: 'Success',
    });
});

test('R4: FHIR Config V4 with 3 exclusions and AllergyIntollerance special', async () => {
    const configHandler: ConfigHandler = new ConfigHandler(r4FhirConfigWithExclusions, SUPPORTED_R4_RESOURCES);
    const metadataHandler: MetadataHandler = new MetadataHandler(configHandler);
    const response = await metadataHandler.capabilities({ fhirVersion: '4.0.1', mode: 'full' });
    const { genericResource } = r4FhirConfigWithExclusions.profile;
    const excludedResources = genericResource ? genericResource.excludedR4Resources || [] : [];
    expect(response.resource).toBeDefined();
    expect(response.resource.acceptUnknown).toBeUndefined();
    expect(response.resource.fhirVersion).toEqual('4.0.1');
    expect(response.resource.rest.length).toEqual(1);
    expect(response.resource.rest[0].resource.length).toEqual(SUPPORTED_R4_RESOURCES.length - excludedResources.length);
    expect(response.resource.rest[0].security.cors).toBeFalsy();
    // see if just READ is chosen for generic
    let isExclusionFound = false;
    response.resource.rest[0].resource.forEach((resource: any) => {
        if (excludedResources.includes(resource.type)) {
            isExclusionFound = true;
        }

        let expectedResourceSubset = {};

        if (resource.type === 'AllergyIntolerance') {
            expectedResourceSubset = {
                interaction: makeOperation(['create', 'update']),
                updateCreate: true,
            };
        } else {
            expectedResourceSubset = {
                interaction: makeOperation(['read', 'history-instance', 'history-type']),
                updateCreate: false,
            };
        }
        expect(resource).toMatchObject(expectedResourceSubset);
        expect(resource.searchParam).toBeUndefined();
    });
    expect(isExclusionFound).toBeFalsy();
    expect(response.resource.rest[0].interaction).toEqual(
        makeOperation(r4FhirConfigWithExclusions.profile.systemOperations),
    );
    expect(response.resource.rest[0].searchParam).toBeDefined();
    expect(r4Validator.validate('CapabilityStatement', response.resource)).toEqual({
        message: 'Success',
    });
});

test('R4: FHIR Config V4 no generic set-up & mix of STU3 & R4', async () => {
    const configHandler: ConfigHandler = new ConfigHandler(r4FhirConfigNoGeneric, SUPPORTED_R4_RESOURCES);
    const metadataHandler: MetadataHandler = new MetadataHandler(configHandler);
    const configResource: any = r4FhirConfigNoGeneric.profile.resources;
    const response = await metadataHandler.capabilities({ fhirVersion: '4.0.1', mode: 'full' });
    expect(response.resource).toBeDefined();
    expect(response.resource.acceptUnknown).toBeUndefined();
    expect(response.resource.fhirVersion).toEqual('4.0.1');
    expect(response.resource.rest.length).toEqual(1);
    expect(response.resource.rest[0].resource.length).toEqual(3);
    expect(response.resource.rest[0].security.cors).toBeFalsy();
    // see if just READ is chosen for generic
    let isSTU3ResourceFound = false;
    response.resource.rest[0].resource.forEach((resource: any) => {
        if (resource.type === 'AllergyIntolerance') {
            isSTU3ResourceFound = true;
        }
        const expectedResourceSubset = {
            interaction: makeOperation(configResource[resource.type].operations),
            updateCreate: configResource[resource.type].operations.includes('update'),
        };
        expect(resource).toMatchObject(expectedResourceSubset);
        if (configResource[resource.type].operations.includes('search-type')) {
            expect(resource.searchParam).toBeDefined();
        } else {
            expect(resource.searchParam).toBeUndefined();
        }
    });
    expect(isSTU3ResourceFound).toBeFalsy();
    expect(response.resource.rest[0].interaction).toEqual(
        makeOperation(r4FhirConfigNoGeneric.profile.systemOperations),
    );
    expect(response.resource.rest[0].searchParam).toBeDefined();
    expect(r4Validator.validate('CapabilityStatement', response.resource)).toEqual({
        message: 'Success',
    });
});
test('R4: FHIR Config V4 with bulkDataAccess', async () => {
    const r4ConfigWithBulkDataAccess = clone(r4FhirConfigGeneric);
    r4ConfigWithBulkDataAccess.profile.bulkDataAccess = stubs.bulkDataAccess;
    const configHandler: ConfigHandler = new ConfigHandler(r4ConfigWithBulkDataAccess, SUPPORTED_R4_RESOURCES);
    const metadataHandler: MetadataHandler = new MetadataHandler(configHandler);
    const response = await metadataHandler.capabilities({ fhirVersion: '4.0.1', mode: 'full' });

    expect(response.resource.rest[0].operation).toEqual([
        {
            name: 'export',
            definition:
                'This FHIR Operation initiates the asynchronous generation of data to which the client is authorized. Currently only system level export is supported. For more information please refer here: http://hl7.org/fhir/uv/bulkdata/export/index.html#bulk-data-kick-off-request',
        },
        {
            name: 'export-poll-status',
            definition:
                'After a bulk data request has been started, the client MAY poll the status URL provided in the Content-Location header. For more details please refer here: http://hl7.org/fhir/uv/bulkdata/export/index.html#bulk-data-status-request',
        },
    ]);
});

test('R4: FHIR Config V4 without bulkDataAccess', async () => {
    const configHandler: ConfigHandler = new ConfigHandler(r4FhirConfigGeneric, SUPPORTED_R4_RESOURCES);
    const metadataHandler: MetadataHandler = new MetadataHandler(configHandler);
    const response = await metadataHandler.capabilities({ fhirVersion: '4.0.1', mode: 'full' });

    expect(response.resource.rest[0].operation).toBeUndefined();
});

test('R4: FHIR Config V4 with all Oauth Policy endpoints', async () => {
    const r4ConfigWithOauthEndpoints = clone(r4FhirConfigGeneric);
    r4ConfigWithOauthEndpoints.auth.strategy = {
        service: 'OAuth',
        oauthPolicy: {
            tokenEndpoint: 'http://fhir-server.com/token',
            authorizationEndpoint: 'http://fhir-server.com/authorize',
            managementEndpoint: 'http://fhir-server.com/manage',
            introspectionEndpoint: 'http://fhir-server.com/introspect',
            revocationEndpoint: 'http://fhir-server.com/revoke',
            registrationEndpoint: 'http://fhir-server.com/register',
        },
    };
    const configHandler: ConfigHandler = new ConfigHandler(r4ConfigWithOauthEndpoints, SUPPORTED_R4_RESOURCES);
    const metadataHandler: MetadataHandler = new MetadataHandler(configHandler);
    const response = await metadataHandler.capabilities({ fhirVersion: '4.0.1', mode: 'full' });

    expect(response.resource.rest[0].security).toEqual({
        cors: false,
        description: 'Uses OAuth2 as a way to authentication & authorize users',
        extension: [
            {
                extension: [
                    {
                        url: 'token',
                        valueUri: 'http://fhir-server.com/token',
                    },
                    {
                        url: 'authorize',
                        valueUri: 'http://fhir-server.com/authorize',
                    },
                    {
                        url: 'manage',
                        valueUri: 'http://fhir-server.com/manage',
                    },
                    {
                        url: 'introspect',
                        valueUri: 'http://fhir-server.com/introspect',
                    },
                    {
                        url: 'revoke',
                        valueUri: 'http://fhir-server.com/revoke',
                    },
                    {
                        url: 'register',
                        valueUri: 'http://fhir-server.com/register',
                    },
                ],
                url: 'https://www.hl7.org/fhir/smart-app-launch/StructureDefinition-oauth-uris.html',
            },
        ],
        service: [
            {
                coding: [
                    {
                        code: 'OAuth',
                        system: 'https://www.hl7.org/fhir/codesystem-restful-security-service.html',
                    },
                ],
            },
        ],
    });
});

test('R4: FHIR Config V4 with some Oauth Policy endpoints', async () => {
    const r4ConfigWithOauthEndpoints = clone(r4FhirConfigGeneric);
    r4ConfigWithOauthEndpoints.auth.strategy = {
        service: 'OAuth',
        oauthPolicy: {
            tokenEndpoint: 'http://fhir-server.com/token',
            authorizationEndpoint: 'http://fhir-server.com/authorize',
            managementEndpoint: 'http://fhir-server.com/manage',
        },
    };
    const configHandler: ConfigHandler = new ConfigHandler(r4ConfigWithOauthEndpoints, SUPPORTED_R4_RESOURCES);
    const metadataHandler: MetadataHandler = new MetadataHandler(configHandler);
    const response = await metadataHandler.capabilities({ fhirVersion: '4.0.1', mode: 'full' });

    expect(response.resource.rest[0].security).toEqual({
        cors: false,
        description: 'Uses OAuth2 as a way to authentication & authorize users',
        extension: [
            {
                extension: [
                    {
                        url: 'token',
                        valueUri: 'http://fhir-server.com/token',
                    },
                    {
                        url: 'authorize',
                        valueUri: 'http://fhir-server.com/authorize',
                    },
                    {
                        url: 'manage',
                        valueUri: 'http://fhir-server.com/manage',
                    },
                ],
                url: 'https://www.hl7.org/fhir/smart-app-launch/StructureDefinition-oauth-uris.html',
            },
        ],
        service: [
            {
                coding: [
                    {
                        code: 'OAuth',
                        system: 'https://www.hl7.org/fhir/codesystem-restful-security-service.html',
                    },
                ],
            },
        ],
    });
});
