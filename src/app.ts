import 'dotenv/config';
import express from 'express';
import DBConnection from './db/Connection';
const app = express();
const port = process.env.NODE_LOCAL_PORT || 3000;
import routes from './routes/Index';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from '../swagger.json';

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api', routes);

app.listen(port, () => {
  console.log(`Express is listening at http://localhost:${port}`);
  DBConnection.getInstance();
});

export default app;
