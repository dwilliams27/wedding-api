import express from 'express';
import { Request, Response } from 'express';
import { PostRSVPRequest, PostRSVPResponse } from './models/models';
import { DynamoDBService } from './utils/dynamo';
import { v4 } from 'uuid';

console.log('Starting up...');

const app = express();
const port = process.env.PORT || 3000;

const dynamoDb = new DynamoDBService();

app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.path}`);
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(express.json());

app.post('/rsvp', async (req: Request, res: Response) => {
  console.log('POST /rsvp');
  console.log(req.body);
  const body: PostRSVPRequest = req.body;
  if(!body?.rsvp) {
    res.status(400).send('Body must include RSVP object.');
    return;
  }
  if(!body.rsvp.uid) {
    // Generate uid
    body.rsvp.uid = v4();
  }

  console.log(`Posting ${body.rsvp.uid} to db...`);
  await dynamoDb.putRSVP(body.rsvp);
  res.status(200).send({ success: true } as PostRSVPResponse);
});

app.get('/rsvp', async (req: Request, res: Response) => {
  if(!req.query?.uid) {
    res.status(400).send('Must include uid query param.');
    return;
  }

  console.log(`Getting ${req.query.uid.toString()} from db...`);
  const rsvp = await dynamoDb.getRSVP(req.query.uid.toString());
  res.status(200).send(rsvp);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export = app;
