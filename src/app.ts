import 'dotenv/config';
import express from 'express';
import DBConnection from './db/Connection';
const app = express();
const port = process.env.NODE_LOCAL_PORT || 3000;
import routes from './routes/Index';
import cookieParser from 'cookie-parser';

import session from 'express-session';
import connectRedis from 'connect-redis';
const RedisStore = connectRedis(session);
import { createClient } from 'redis';
const redisClient = createClient({
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
  port: parseInt(process.env.REDIS_PORT),
});

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    saveUninitialized: false,
    secret: 'keyboard cat',
    resave: false,
    name: 'sid',
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 3600 * 24 * 1, // 1 day
    },
  })
);

redisClient.on('error', function (err) {
  console.log('*Redis Client Error: ' + err.message);
});
redisClient.on('connect', function () {
  console.log('Connected to redis instance');
});

app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  console.log(`test session ===> ${JSON.stringify(req.session)}`);
  // console.log(`test session user ===> ${JSON.stringify(req.session.user)}`);
  res.send('Hello World!');
});

app.use('/api', routes);

app.listen(port, () => {
  console.log(`Express is listening at http://localhost:${port}`);
  DBConnection.getInstance();
});

export default app;
