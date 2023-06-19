import express, { Request, Response } from 'express';
import cors from 'cors';

import bodyParser from 'body-parser';
import colors from 'colors';

import path from 'path';

import axios from 'axios';


require('dotenv').config();
import apiRouter from './routes';
import { connection, executeQuery} from './database';

// const linkedin_access_token = 'AQVJyaUPuB4hHVHq2aug1o7ivONkRQb3-6Y7JrKLY40UrRQ-UIp3hLyKVJ2Ax1vLpfuxnGzIMhBknlUzeJUG1q3iyQY3xcktI-qzvqQlWvQQoWoApbMDUUIrLA16ZMQfdhOZaYMZOv92CU0krjoQ7UtfQjiusnZo0LcJ94bMRwPJlxnmz612gH6AEQmS-4pk7dzY539N3W28C1PUSHNE1njOuP7qdyJGFvCcmzGkbf0xn0JnbpkADXdiKEfa_q8VrgrcvRPHFy9lDniben2XVmhYlV9_wGE2dH2m8EVRJy-7KsY8fWAC-WxFl4j4h_83nBcpB2fFXAmlCxi1GhBG9gMphnWrRQ'

const app = express()
const port = 3000

app.use(cors());
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: true }));

const uploadsPath = path.join(__dirname, 'database', 'uploads');

// console.log('Uploads directory:', uploadsPath);

const ulpoadUrl = '/files/uploads';
app.use(ulpoadUrl, express.static(uploadsPath));
//router
app.use('/api', apiRouter);



app.get('/test', (req: Request, res: Response) => {
    connection.query('SELECT * FROM Entreprises', (err, results: any) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send({ message: 'Server Error' });
        return;
      }
  
      res.status(200).json(results);
    });
  });

 
  
  // Define your route handler
  app.get('/testGestimum', async (req: Request, res: Response) => {
    try {
        const query = 'SELECT PCF_CODE, PCF_RS, PCF_EMAIL, PCF_RUE, PCF_CP, PCF_VILLE, PAY_CODE, PCF_TYPE FROM TIERS ORDER BY PCF_RS, PCF_TYPE OFFSET 0 ROWS FETCH NEXT 10 ROWS ONLY';
      const tiers = await executeQuery(query);
      res.status(200).json(tiers);
    } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).send({ message: 'Server Error' });
    }
  });

//LINKEDIN
  axios.get('http://localhost:3000/api/linkedin/getLinkedinPosts')
  .then((response) => {
    // console.log(response.data);
    console.log(colors.bold.cyan(`getLinkedinPosts !`));
  })
  .catch((error) => {
    console.log(error);
  });

  app.listen(port, () => {
    console.log(colors.bold.red.underline(`Gestimum private-access runing on port ${port}!`));
  });


//GOOD
//https://api.linkedin.com/v2/shares?q=owners&owners=urn:li:organization:1201305&sortBy=LAST_MODIFIED&sharesPerOwner=${count}&start=0


//TEST
// https://api.linkedin.com/v2/adAnalyticsV2?q=analytics&pivot=SHARE&timeGranularity=DAILY&shares=List(urn:share:XXXX)
//https://api.linkedin.com/v2/ugcPosts?q=authors&authors=List(urn%3Ali%3Aorganization%3A1201305)&sortBy=LAST_MODIFIED
//https://api.linkedin.com/rest/posts?author={encoded person urn or organization urn like urn%3Ali%3Aperson%3A5abc_dEfgH or urn%3Ali%3Aorganization%3A2414183}&q=author&count=10
