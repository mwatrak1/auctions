import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyEvent } from 'aws-lambda'
import { Response } from '../types/responses/base'
import { ErrorResponse } from '../errors/errorResponse'
import { InternalServerError } from 'http-errors'
import { errorHandler } from '../middlewares/errorHandler'
import { Auction, AuctionStatus } from '../types/auction'
import { BadRequestError } from '../errors/badRequestError'

const dynamodb = new DynamoDB.DocumentClient()

async function getAuctionWithStatus(status: string | undefined){
  var auctions: Auction[]

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME!,
    IndexName: 'statusAndEndDate',
    KeyConditionExpression: '#status = :status',
    ExpressionAttributeValues: {
      ':status': status || AuctionStatus.Open 
    },
    ExpressionAttributeNames: {
      '#status': 'status'
    }
  }

  try {
    const result = await dynamodb.query(params).promise()

    auctions = result.Items as Auction[]
  } catch (error){
    console.log(error)
    throw new InternalServerError(error)
  }
  if (!auctions){
    return []
  }

  return auctions
}

async function getAuctions(event: APIGatewayProxyEvent, context: {}): Promise<Response | ErrorResponse> {
  const requestParams = event.queryStringParameters

  var status = requestParams?.status 

  if (!status || !Object.values(AuctionStatus).find((s) => s === status)){
    throw new BadRequestError('You must specify a valid status parameter in your query')
  }
  
  const auctions: Auction[] = await getAuctionWithStatus(status)

  return {
    statusCode: 200,
    body: JSON.stringify({ auctions })
  }
}

export const handler = errorHandler(getAuctions)
