import { Context } from "aws-lambda";
import { GetAuctionEvent } from "../types/events/getAuctionEvent";
import { Response } from "../types/responses/base";
import { DynamoDB } from 'aws-sdk'
import { GetItemOutput } from 'aws-sdk/clients/dynamodb'
import { NotFoundError } from '../errors/notFoundError'
import { InternalServerError } from "http-errors";
import { ErrorResponse } from '../errors/errorResponse'
import { errorHandler } from '../middlewares/errorHandler'
import { BadRequestError } from "../errors/badRequestError";
import { Auction } from "../types/auction";

const dynamodb = new DynamoDB.DocumentClient()

export async function getAuctionById(id: string){
  var auction: Auction

  try {
    const response = await dynamodb.get({
      TableName: process.env.AUCTIONS_TABLE_NAME!,
      Key: { id }
    }).promise()

    auction = response.Item as Auction
  } catch (error) {
    throw new InternalServerError()
  }

  if (!auction) {
    throw new NotFoundError('Auction with provided id does not exist')
  }

  return auction
}

async function getAuction(event: GetAuctionEvent, context: Context): Promise<Response | ErrorResponse> {
  if (!event.pathParameters?.id){
    throw new BadRequestError('You must specify bid id as a path parameter')
  }

  const { id } = event.pathParameters
  var auction = await getAuctionById(id)

  return {
    statusCode: 200,
    body: JSON.stringify({ auction })
  }
}

export const handler = errorHandler(getAuction)