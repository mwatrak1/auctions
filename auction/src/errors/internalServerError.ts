import { ErrorResponse } from "./errorResponse";

export class InternalServerError extends ErrorResponse {
    statusCode = 500

    constructor(message: string){
        super(message)
        Object.setPrototypeOf(this, InternalServerError.prototype)
    }

    createResponse() {
        return {
            isBase64Encoded: true,
            statusCode: this.statusCode,
            headers: {},
            body: JSON.stringify({
                message: "Something went wrong"
            })
          }
    }
} 