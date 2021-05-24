import { DynamoDB } from "aws-sdk";
import { QueryInput } from "aws-sdk/clients/dynamodb";
import { Auction, AuctionStatus } from "../types/auction";

const dynamodb = new DynamoDB.DocumentClient()

export async function getEndedAuctions(){
    const now = new Date()

    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME!,
        IndexName: 'statusAndEndDate',
        KeyConditionExpression: '#status = :status AND endingAt <= :now',
        ExpressionAttributeValues: {
            ':status': AuctionStatus.Open,
            ':now': now.toISOString()
        },
        ExpressionAttributeNames: {
            '#status': 'status'
        }
        // status is a reserved keyword so it cannot be used directly
    }

    const result = await dynamodb.query(params).promise()
    return result.Items as Auction[]
    
}