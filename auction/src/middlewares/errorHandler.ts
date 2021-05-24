import { ErrorResponse } from '../errors/errorResponse'

function handler(f: Function) {

    async function inner(event: {}, context: {}){
        try{
            const result = await f(event, context)
            return result
        } catch (err){
            if (err instanceof ErrorResponse) {
                return err.createResponse()
            }

            throw err
        }
    }
    return inner
}

// mozna uzyc biblioteki http-errors sprawdzac czy error jest ich typu

export { handler as errorHandler}