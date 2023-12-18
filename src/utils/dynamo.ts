import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { LambdaClient } from '@aws-sdk/client-lambda';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { RSVP } from '../models/models';

export class DynamoDBService {
  private dynamoDb: DynamoDBDocumentClient;

  constructor() {
    const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' });
    this.dynamoDb = DynamoDBDocumentClient.from(dynamoDbClient);
  }

  public async get(table: string, key: object) {
    const params = {
      TableName: table,
      Key: key
    };

    try {
      const command = new GetCommand(params);
      const data = await this.dynamoDb.send(command);
      return data.Item;
    } catch (error) {
      console.error("Error fetching from DynamoDB:", error);
      throw error;
    }
  }

  public async put(table: string, item: object) {
    const params = {
      TableName: table,
      Item: item
    };

    try {
      const command = new PutCommand(params);
      await this.dynamoDb.send(command);
    } catch (error) {
      console.error("Error writing to DynamoDB:", error);
      throw error;
    }
  }

  private mapRSVP(data: any): RSVP {
    return {
      uid: data.Item.uid.S,
      id: data.Item.id.S,
      idFromQRCode: data.Item.idFromQRCode ? data.Item.idFromQRCode.S : undefined,
      guests: data.Item.guests.L.map((guest: any) => {
        return {
          attending: guest.M.attending.BOOL,
          name: guest.M.name.S,
          foodPreference: guest.M.foodPreference.S,
          allergies: guest.M.allergies.SS,
          additionalNotes: guest.M.additionalNotes ? guest.M.additionalNotes.S : undefined
        };
      })
    };
  }

  public async getRSVP(uid: string): Promise<RSVP> {
    return this.mapRSVP(await this.get('rsvp', { uid }));
  }

  public async putRSVP(rsvp: RSVP) {
    return await this.put('rsvp', rsvp);
  }
}
