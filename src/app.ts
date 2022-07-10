import 'dotenv/config';
import express from 'express';
import DBConnection from './db/Connection';
const app = express();
const port = process.env.NODE_LOCAL_PORT || 3000;
import routes from './routes/Index';
import cookieParser from 'cookie-parser';

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  console.log(req.cookies);
  res.send('Hello World!');
});

app.use('/api', routes);

app.listen(port, () => {
  console.log(`Express is listening at http://localhost:${port}`);
  DBConnection.getInstance();
});

export default app;
