import { Search, History, Persistence, FhirVersion } from 'fhir-works-on-aws-interface';
import CrudHandlerInterface from './CrudHandlerInterface';
export default class ResourceHandler implements CrudHandlerInterface {
    private validator;
    private dataService;
    private searchService;
    private historyService;
    private serverUrl;
    constructor(dataService: Persistence, searchService: Search, historyService: History, fhirVersion: FhirVersion, serverUrl: string);
    create(resourceType: string, resource: any, tenantId: string): Promise<any>;
    update(resourceType: string, id: string, resource: any, tenantId: string): Promise<any>;
    patch(resourceType: string, id: string, resource: any, tenantId: string): Promise<any>;
    typeSearch(resourceType: string, queryParams: any, allowedResourceTypes: string[]): Promise<{
        resourceType: string;
        id: string;
        meta: {
            lastUpdated: string;
        };
        type: "searchset" | "history";
        total: number;
        link: {
            relation: "next" | "self" | "previous" | "first" | "last";
            url: string;
        }[];
        entry: import("fhir-works-on-aws-interface").SearchEntry[];
    }>;
    typeHistory(resourceType: string, queryParams: any): Promise<{
        resourceType: string;
        id: string;
        meta: {
            lastUpdated: string;
        };
        type: "searchset" | "history";
        total: number;
        link: {
            relation: "next" | "self" | "previous" | "first" | "last";
            url: string;
        }[];
        entry: import("fhir-works-on-aws-interface").SearchEntry[];
    }>;
    instanceHistory(resourceType: string, id: string, queryParams: any): Promise<{
        resourceType: string;
        id: string;
        meta: {
            lastUpdated: string;
        };
        type: "searchset" | "history";
        total: number;
        link: {
            relation: "next" | "self" | "previous" | "first" | "last";
            url: string;
        }[];
        entry: import("fhir-works-on-aws-interface").SearchEntry[];
    }>;
    read(resourceType: string, id: string, tenantId: string): Promise<any>;
    vRead(resourceType: string, id: string, vid: string, tenantId: string): Promise<any>;
    delete(resourceType: string, id: string, tenantId: string): Promise<{
        resourceType: string;
        text: {
            status: string;
            div: string;
        };
        issue: {
            severity: string;
            code: string;
            diagnostics: string;
        }[];
    }>;
}
