/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { FhirVersion } from 'fhir-works-on-aws-interface';

export default function makeStatement(rest: any, orgName: string, url: string, fhirVersion: FhirVersion) {
    const cap: any = {
        resourceType: 'CapabilityStatement',
        status: 'active',
        date: new Date().toISOString(),
        publisher: orgName,
        kind: 'instance',
        software: {
            name: 'FHIR Server',
            version: '1.0.0',
        },
        implementation: {
            description: `A FHIR ${fhirVersion} Server`,
            url,
        },
        fhirVersion,
        format: ['json'],
        rest: [rest],
    };
    // TODO finalize
    if (fhirVersion !== '4.0.1') {
        cap.acceptUnknown = 'no';
    }
    return cap;
}
