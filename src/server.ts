import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';

import bodyParser from 'body-parser';
import colors from 'colors';

import path from 'path';

const winston = require('winston');


require('dotenv').config();
import apiRouter from './routes';

const app: Application = express()
const port: Number = 4000


const logger = winston.createLogger({
  level: 'info', // Log level
  format: winston.format.json(), // Log format (you can customize this)
  transports: [
    new winston.transports.Console(), // Log to console
    new winston.transports.File({ filename: 'error.log', level: 'error' }), // Log errors to a file
    new winston.transports.File({ filename: 'combined.log' }) // Log all other messages to another file
  ]
});

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});


// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack);
  res.status(500).send('Something went wrong!');
});



app.use(cors(
  // {
  //   origin: ['*', 'http://espace-prive-dev.gestimum.com'],
  //   methods: ['GET', 'POST', 'PUT', 'DELETE'],
  //   allowedHeaders: ['Content-Type', 'Authorization']
  // }
));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const uploadsPath = path.join(__dirname, 'database', 'uploads');

// console.log('Uploads directory:', uploadsPath);

const ulpoadUrl = '/files/uploads';
app.use(ulpoadUrl, express.static(uploadsPath));
//router
app.use('/api', apiRouter);
app.get('/', (req: Request, res: Response) => {
  res.status(200).send('private-access-api is running!');
});

 
  // import bcrypt from 'bcrypt';
  // app.get('/hash', async (req: Request, res: Response) => {
  //   const password = 'admin';
  //   const salt = await bcrypt.genSalt(10);
  //   const hashedPassword = await bcrypt.hash(password, salt);
  //   res.status(200).json(hashedPassword);
  // });

  import nodemailer, { TransportOptions } from 'nodemailer';
  app.get('/mail', async (req: Request, res: Response) => {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
        },
      }as TransportOptions);

      const mailOptions = {
        from: process.env.MAIL_FROM_ADDRESS,
        to: 'thomas.jankowski@gestimum.com',
        // cc: '',
        subject: 'Welcome to the application',
        html: `
          <html>
            <body>
              <h1 style="color: #333; text-align: center">Bonjour THOMAS,</h1>
              
              <p style="color: #666;">Votre compte d'accés à l'espace privée gestimum a été créé.</p>
              <p style="color: #666;">Votre mot de passe: THOMAS</p>
            </body>
          </html>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
      res.status(200).send('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  });




  const banner_private = `
        ██████╗ ██████╗ ██╗██╗   ██╗ █████╗ ████████╗███████╗
        ██╔══██╗██╔══██╗██║██║   ██║██╔══██╗╚══██╔   ██╔════╝
        ██████╔╝██████╔╝██║╚██╗ ██╔╝███████║   ██║   █████╗  
        ██╔═══╝ ██╔══██╗██║ ╚████╔╝ ██╔══██║   ██║   ██╔══╝  
        ██║     ██║  ██║██║  ╚██╔╝  ██║  ██║   ██║   ███████╗
        ╚═╝     ╚═╝  ╚═╝╚═╝   ╚═╝   ╚═╝  ╚═╝   ╚═╝   ╚══════╝
`;

const banner_access = `
           █████╗  █████╗  █████╗ ███████╗ ██████╗ ██████╗
          ██╔══██╗██╔══██╗██╔══██╗██╔════╝██╔════╝██╔════╝
          ███████║██║  ╚═╝██║  ╚═╝█████╗  ╚█████╗ ╚█████╗
          ██╔══██║██║  ██╗██║  ██╗██╔══╝   ╚═══██╗ ╚═══██╗
          ██║  ██║╚█████╔╝╚█████╔╝███████╗██████╔╝██████╔╝
          ╚═╝  ╚═╝ ╚════╝  ╚════╝ ╚══════╝╚═════╝ ╚═════╝
`;

  app.listen(port, (): void => {
    console.log(colors.bold.green(banner_private));
    console.log(colors.bold.yellow(banner_access));
    console.log(colors.bold.red.underline(`Gestimum private-access runing on port ${port}!`));
  });

export default app;

  