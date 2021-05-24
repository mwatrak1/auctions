import { APIGatewayEvent, APIGatewayEventRequestContext } from 'aws-lambda'

// for testing
export async function handler(event: APIGatewayEvent, context: APIGatewayEventRequestContext) {
    return {
      statusCode: 200,
      headers: {
          /* Required for CORS support to work */
        'Access-Control-Allow-Origin': '*',
          /* Required for cookies, authorization headers with HTTPS */
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        event,
        context
      }),
    };
  }