import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, ScanCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const tableName = process.env.TABLE_NAME;

export const handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  const path = event.path;
  const httpMethod = event.httpMethod;

  if (path === '/guests' && httpMethod === 'GET') {
      // Logic for GET /guests to list all guests
      return {
          statusCode: 200,
          body: JSON.stringify({ message: "List of all guests" })
      };
  }
  else if (path.startsWith('/guest/') && httpMethod === 'GET' && event.pathParameters && event.pathParameters.id) {
    try {
        // GET /guest/{id} - Query the GSI using 'uid'
        const guestUid = event.pathParameters.id;
        const params = {
            TableName: tableName,
            IndexName: 'uid-index', // Use the name of your GSI
            KeyConditionExpression: "uid = :uid",
            ExpressionAttributeValues: {
                ":uid": guestUid
            }
        };
        const { Items } = await ddbDocClient.send(new QueryCommand(params));
        
        if (Items && Items.length > 0) {
            // Return the first item from the query result
            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(Items[0])
            };
        } else {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: "Guest not found" })
            };
        }
    } catch (error) {
        console.error("Error querying DynamoDB GSI:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Failed to retrieve guest" })
        };
    }
  }
  else if (path.startsWith('/guest/') && httpMethod === 'POST' && event.pathParameters && event.pathParameters.id) {
      // Logic for POST /guest/{id} to update a specific guest
      const guestId = event.pathParameters.id;
      const body = event.body ? JSON.parse(event.body) : {};
      return {
          statusCode: 200,
          body: JSON.stringify({ message: `Guest ${guestId} updated with data`, body })
      };
  }

  return {
      statusCode: 404,
      body: JSON.stringify({ message: "Not Found" })
  };
};
