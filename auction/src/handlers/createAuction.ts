import { DynamoDB } from 'aws-sdk'
import { v4 as uuid } from 'uuid'
import { Context } from 'aws-lambda'
import { Response } from '../types/responses/base'
import { Auction, AuctionStatus } from '../types/auction'
import { CreateAuctionEvent } from '../types/events/createAuctionEvent'
import { ErrorResponse } from '../errors/errorResponse'
import { BadRequestError } from '../errors/badRequestError'
import { NotFoundError } from '../errors/notFoundError'
import { errorHandler } from '../middlewares/errorHandler'

const dynamodb = new DynamoDB.DocumentClient()

async function createAuction (event: CreateAuctionEvent, context: Context): Promise<Response | ErrorResponse> {
  const { title } = JSON.parse(event.body)

  if (!title){
    throw new BadRequestError('You must specify a title')
  }

  const now = new Date()
  const endDate = new Date()
  endDate.setHours(now.getHours() + 1)

  const auction: Auction = {
    id: uuid(),
    title,
    status: AuctionStatus.Open,
    createdAt: now.toISOString(),
    endingAt: endDate.toISOString(),
    highestBid: {
      amount: 0
    }
  }
  
  try {
    await dynamodb.put({
      TableName: process.env.AUCTIONS_TABLE_NAME!,
      Item: auction
    }).promise()
  } catch(error) {
    console.log(error)
    throw new NotFoundError(error)
  }

  return {
    statusCode: 201,
    body: JSON.stringify({ auction })
  }
}

export const handler = errorHandler(createAuction)