import { ErrorResponse } from "./errorResponse";

export class NotAuthorizedError extends ErrorResponse {
    statusCode = 401

    constructor(message: string){
        super(message)
        Object.setPrototypeOf(this, NotAuthorizedError.prototype)
    }

    createResponse(){
        return {
            isBase64Encoded: true,
            statusCode: this.statusCode,
            headers: {},
            body: JSON.stringify({
                message: "You are not authorized to do this - " + this.message
            })
        }
    }
}