export default interface CrudHandlerInterface {
    create(resourceType: string, resource: any, tenantId: string): any;
    update(resourceType: string, id: string, resource: any, tenantId: string): any;
    patch(resourceType: string, id: string, resource: any, tenantId: string): any;
    read(resourceType: string, id: string, tenantId: string): any;
    vRead(resourceType: string, id: string, vid: string, tenantId: string): any;
    delete(resourceType: string, id: string, tenantId: string): any;
    typeSearch(resourceType: string, searchParams: any, allowedResourceTypes: string[]): any;
    typeHistory(resourceType: string, searchParams: any): any;
    instanceHistory(resourceType: string, id: string, searchParams: any): any;
}
