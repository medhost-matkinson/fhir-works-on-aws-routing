"use strict";
/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
function makeSecurity(authConfig, hasCORSEnabled = false) {
    if (authConfig.strategy.service) {
        let security = {
            cors: hasCORSEnabled,
            service: [
                {
                    coding: [
                        {
                            system: 'https://www.hl7.org/fhir/codesystem-restful-security-service.html',
                            code: authConfig.strategy.service,
                        },
                    ],
                },
            ],
        };
        const { oauthPolicy } = authConfig.strategy;
        if (oauthPolicy) {
            const extension = [
                {
                    url: 'token',
                    valueUri: oauthPolicy.tokenEndpoint,
                },
                {
                    url: 'authorize',
                    valueUri: oauthPolicy.authorizationEndpoint,
                },
            ];
            if (oauthPolicy.managementEndpoint) {
                extension.push({
                    url: 'manage',
                    valueUri: oauthPolicy.managementEndpoint,
                });
            }
            if (oauthPolicy.introspectionEndpoint) {
                extension.push({
                    url: 'introspect',
                    valueUri: oauthPolicy.introspectionEndpoint,
                });
            }
            if (oauthPolicy.revocationEndpoint) {
                extension.push({
                    url: 'revoke',
                    valueUri: oauthPolicy.revocationEndpoint,
                });
            }
            if (oauthPolicy.registrationEndpoint) {
                extension.push({
                    url: 'register',
                    valueUri: oauthPolicy.registrationEndpoint,
                });
            }
            security = {
                ...security,
                ...{
                    extension: [
                        {
                            url: 'https://www.hl7.org/fhir/smart-app-launch/StructureDefinition-oauth-uris.html',
                            extension,
                        },
                    ],
                    description: 'Uses OAuth2 as a way to authentication & authorize users',
                },
            };
        }
        return security;
    }
    return {
        cors: hasCORSEnabled,
        description: 'No authentication has been set up',
    };
}
exports.default = makeSecurity;
//# sourceMappingURL=cap.rest.security.template.js.map