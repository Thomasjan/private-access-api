import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

require('dotenv').config();
import apiRouter from './routes';

const app = express()
const port = 3000
app.use(cors());
app.use(bodyParser.json());

//router
app.use('/api', apiRouter);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
