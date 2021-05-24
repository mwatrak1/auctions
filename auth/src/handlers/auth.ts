import { verify } from 'jsonwebtoken'
import { AuthorizationEvent } from '../types/events/authorizationEvent';
import { Claims } from '../types/authorizationClaims';
import { APIGatewayAuthorizerCallback } from 'aws-lambda';

const generatePolicy = (principalId: string, methodArn: string) => {
  const apiGatewayWildcard = methodArn.split('/', 2).join('/') + '/*';

  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Allow',
          Resource: apiGatewayWildcard,
        },
      ],
    },
  };
}

async function authorize(event: AuthorizationEvent, context: {}) {
  if (!event.authorizationToken){
    throw 'Unauthorized'
  }

  const token = event.authorizationToken.replace('Bearer ', '')

  try {
    const claims = verify(token, process.env.AUTH_PUBLIC_KEY!) as Claims
    const policy = generatePolicy(claims.sub, event.methodArn)

    return {
      ...policy,
      context: claims // provides user data to the authorized function
    }
  } catch (error){
    console.log(error)
    throw 'Unauthorized'
  }
}

export const handler = authorize