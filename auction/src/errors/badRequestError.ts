import { ErrorResponse } from "./errorResponse";

export class BadRequestError extends ErrorResponse {
    statusCode = 400

    constructor(message: string){
        super(message)
        Object.setPrototypeOf(this, BadRequestError.prototype)
    }

    createResponse() {
        return {
            isBase64Encoded: true,
            statusCode: this.statusCode,
            headers: {},
            body: JSON.stringify({
                message: "Invalid request - " + this.message
            })
          }
    }
} 