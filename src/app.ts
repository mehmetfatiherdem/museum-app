import 'dotenv/config';
import express from 'express';
import DBConnection from './db/Connection';
const app = express();
const port = process.env.PORT || 3000;
import routes from './routes/Index';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from '../swagger.json';
import cors from 'cors';
import path from 'path';
import MailCronService from './services/MailCronService';

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/google-sign', function (req, res) {
  res.render(`auth.ejs`);
});

app.use('/api', routes);

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`Express is listening at http://localhost:${port}`);

  DBConnection.getInstance();

  const mailCronService = new MailCronService('0 0 * * THU');
  mailCronService.call();
});

export default app;
