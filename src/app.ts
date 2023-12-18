import express from 'express';
import { Request, Response } from 'express';
import { PostRSVPRequest, PostRSVPResponse } from './models/models';
import { DynamoDBService } from './utils/dynamo';

const app = express();
const port = process.env.PORT || 3000;

const dynamoDb = new DynamoDBService();

app.post('/', (req: Request, res: Response) => {
  const body: PostRSVPRequest = req.body;
  console.log(dynamoDb.getRSVP(body.rsvp.uid));
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});


export = app;
