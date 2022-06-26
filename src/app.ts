import 'dotenv/config';
import express from 'express';
import connectToMongo from './db/connection';
const app = express();
const port = process.env.NODE_LOCAL_PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Express is listening at http://localhost:${port}`);
  connectToMongo()
});
