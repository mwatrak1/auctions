import { DynamoDB } from "aws-sdk";
import { errorHandler } from "../middlewares/errorHandler";
import { Auction } from "../types/auction";
import { getEndedAuctions } from "../helpers/getEndedAuctions";
import { closeAuction } from "../helpers/closeAuction";
import { InternalServerError } from "../errors/internalServerError";

const dynamodb = new DynamoDB.DocumentClient()

async function processAuctions(event: {}, context: {}) {

    try {
        const auctionsToClose: Auction[] = await getEndedAuctions()
        const closedPromises = auctionsToClose.map(auction => closeAuction(auction)) // all updates run concurrently
        await Promise.all(closedPromises) // wait for process to finish
        return { closed: closedPromises.length }
    } catch(error) {
        throw new InternalServerError('Auctions could not have been processed')
    }
    
}

export const handler = errorHandler(processAuctions)