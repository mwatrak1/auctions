import { DynamoDB } from "aws-sdk";
import { Auction, AuctionStatus } from "../types/auction";

const dynamodb = new DynamoDB.DocumentClient()

export async function closeAuction(auction: Auction) {
    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME!,
        Key: { id: auction.id},
        UpdateExpression: 'set #status = :status',
        ExpressionAttributeValues: {
            ':status': AuctionStatus.Closed
        },
        ExpressionAttributeNames: {
            '#status': 'status'
        }
    }
    const result = await dynamodb.update(params).promise()
    return result
}