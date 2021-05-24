import { Context } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { InternalServerError } from "http-errors";
import { BadRequestError } from "../errors/badRequestError";
import { ErrorResponse } from "../errors/errorResponse";
import { errorHandler } from "../middlewares/errorHandler";
import { Auction, AuctionStatus } from "../types/auction";

import { PlaceBidEvent } from "../types/events/placeBidEvent";
import { Response } from "../types/responses/base";
import { getAuctionById } from "./getAuction";

const dynamodb = new DynamoDB.DocumentClient()

async function placeBid(event: PlaceBidEvent, context: Context): Promise<Response | ErrorResponse>{
    if (!event.pathParameters?.id){
        throw new BadRequestError('You must specify bid id as a path parameter')
    }
    const { id } = event.pathParameters
    var auction: Auction = await getAuctionById(id)

    const body = JSON.parse(event.body)
    if (!body?.amount){
        throw new BadRequestError('You must specify bid amount within requests body')
    }
    const { amount } = body

    if (auction.highestBid.amount >= amount){
        throw new BadRequestError('Bid amount must be higher than last highest bid which is ' + amount)
    }

    if (auction.status === AuctionStatus.Closed){
        throw new BadRequestError('The auction has already been closed with the highest bid of ' + auction.highestBid.amount.toString())
    }

    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME!,
        Key: { id },
        UpdateExpression: 'set highestBid.amount = :amount',
        ExpressionAttributeValues: {
            ':amount': amount
        },
        ReturnValues: 'ALL_NEW'
    }

    var updatedAuction: Auction

    try {
        const response = await dynamodb.update(params).promise()
        updatedAuction = response.Attributes as Auction
        
    } catch (err) {
        console.log(err)
        throw new InternalServerError('Bid cannot be placed at this moment. Please try again later')
    }

    return {
        statusCode: 200,
        body: JSON.stringify(updatedAuction)
    }
}

export const handler = errorHandler(placeBid)