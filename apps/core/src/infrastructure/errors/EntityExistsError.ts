export class EntityExistsError extends Error {
    constructor(entity: string) {
        super(`${entity} already exists`);
    }
}