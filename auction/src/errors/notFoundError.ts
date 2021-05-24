import { ErrorResponse } from "./errorResponse";

export class NotFoundError extends ErrorResponse {
    statusCode = 404

    constructor(message: string){
        super(message)
        Object.setPrototypeOf(this, NotFoundError.prototype)
    }

    createResponse() {
        return {
            isBase64Encoded: true,
            statusCode: this.statusCode,
            headers: {},
            body: JSON.stringify({
                message: "Resource not found - " + this.message
            })
          }
    }
} 