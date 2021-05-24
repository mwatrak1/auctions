export abstract class ErrorResponse extends Error {
  abstract statusCode: number

  constructor(message: string) {
    super(message)
    Object.setPrototypeOf(this, ErrorResponse.prototype)
  }

  abstract createResponse(): {
    isBase64Encoded: boolean,
    statusCode: number,
    headers: object,
    body: string
  }
}