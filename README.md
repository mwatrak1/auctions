# Auctions - serverless microservices-style application for bidding

An auction bidding project made with the Serverless Framework consisting of 3 microservices that handle auctions, authorization and sending notifications - ready to be deployed on AWS. For details check out the serverless.yml files.

Consists of those services:

- auction - takes care of creating, biding on, and processing closed auctions. Provides CRUD operations for auctions API.
- auth - provides authorization to users using auth0. This protects some routes like creating and bidding on auctions from unathorized access.
- notification - notifies a user that won an auction with an email

Resources used:

- API Gateway - for delegating requests to appropiate Lambdas
- multiple Lambdas that handle specific tasks accourding to endpoints
- DynamoDB - stores auctions data
- SQS - enquees notifications to be sent
- SNS - sends an notification to the winner of an auction once its over
