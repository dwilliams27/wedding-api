import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { LambdaClient } from '@aws-sdk/client-lambda';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { RSVP } from '../models/models';

const TABLE = 'WeddingRSVP';

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

  private mapRSVP(data: any): RSVP | null {
    if(!data) {
      return null;
    }

    let rsvp: RSVP | null = null;
    try {
      rsvp = {
        uid: data.uid,
        id: data.id,
        idFromQRCode: data.idFromQRCode ? data.idFromQRCode : undefined,
        guests: data.guests.map((guest: any) => {
          return {
            attending: guest.attending,
            name: guest.name,
            foodPreference: guest.foodPreference,
            allergies: guest.allergies,
            additionalNotes: guest.additionalNotes ? guest.additionalNotes : undefined
          };
        })
      }
    } catch (error) {
      console.error("Error mapping RSVP:", error);
      return null;
    }
    return rsvp;
  }

  public async getRSVP(uid: string): Promise<RSVP | null> {
    const rsvp = this.mapRSVP(await this.get(TABLE, { id: uid }));
    return rsvp;
  }

  public async putRSVP(rsvp: RSVP) {
    return await this.put(TABLE, rsvp);
  }
}
