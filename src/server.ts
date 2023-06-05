import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';


require('dotenv').config();
import apiRouter from './routes';



const app = express()
const port = 3000

app.use(cors());
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: true }));

const uploadsPath = path.join(__dirname, 'database', 'uploads');

console.log('Uploads directory:', uploadsPath);

const ulpoadUrl = '/files/uploads';
app.use(ulpoadUrl, express.static(uploadsPath));
//router
app.use('/api', apiRouter);


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
