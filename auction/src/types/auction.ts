export interface Auction {
    id: string,
    title: string,
    status: AuctionStatus,
    createdAt: string,
    endingAt: string,
    highestBid: {
        amount: number
    }
}

export enum AuctionStatus {
    Open = 'OPEN',
    Closed = 'CLOSED'
}