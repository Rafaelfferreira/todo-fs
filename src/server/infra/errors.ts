export class HttpNotFoundError extends Error {
    status: number;

    constructor(message: string) {
        super(); // initializer for the super class

        this.message = message;
        this.status = 404;
    }
};
