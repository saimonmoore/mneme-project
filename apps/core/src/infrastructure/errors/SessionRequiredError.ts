export class SessionRequiredError extends Error {
    constructor() {
        super("Session required to perform this action");
    }
}