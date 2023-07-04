import { Request, Response } from 'express';
import {connectionGestimum, executeQuery} from '../database';

import colors from 'colors';
import axios from 'axios';
require('dotenv').config();

//listes des utilisateurs avec l'entreprise associé
// export const getGestimumClients = async (req: Request, res: Response) => {
//     try {
//         const query = 'SELECT PCF_CODE, PCF_RS, PCF_EMAIL, PCF_RUE, PCF_CP, PCF_VILLE, PAY_CODE, PCF_TYPE FROM TIERS ORDER BY PCF_RS, PCF_TYPE OFFSET 0 ROWS FETCH NEXT 10 ROWS ONLY';
//       const tiers = await executeQuery(query);
//       res.status(200).json(tiers);
//     } catch (error) {
//       console.error('Error executing query:', error);
//       res.status(500).send({ message: 'Server Error' });
//     }
// };

export const getGestimumClients = async (req: Request, res: Response) => {


  const config = {
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.TOKEN_SECRET,
    }
  };

  console.log(process.env.ERP_API_URL)
  try {
      const tiers = await axios.get(`${process.env.ERP_API_URL}/clients/getGestimumClients`, config);
      const firsts = tiers.data.clients.slice(0, 100);
    res.status(200).json(firsts);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).send({ message: 'Server Error' });
  }
};


// export const getUser = (req: Request, res: Response) => {
//   const userId = req.params.id; // Assuming the user ID is passed as a parameter in the URL
  
//   console.log('Fetching user with ID: ' + userId)
//   connection.query('SELECT * FROM users WHERE id = ?', userId, (err, results) => {
//     if (err) {
//       console.error('Error executing query:', err);
//       res.status(500).send('Error retrieving user');
//       return;
//     }

//     if (Array.isArray(results) && results.length === 0) {
//       res.status(404).send('User not found');
//       return;
//     }

//     const user = (results as any)?.[0]
//     res.json(user);
//   });
// };



