import { Request, Response } from 'express';
import {connectionGestimum, executeQuery} from '../database';

import colors from 'colors';
import axios from 'axios';
require('dotenv').config();


export const getGestimumClients = async (req: Request, res: Response) => {

const {query} = req.params;
console.log(colors.yellow(query));

  const config = {
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.TOKEN_SECRET,
    }
  };

  try {
      const tiers = await axios.get(`${process.env.ERP_API_URL}/clients/getGestimumClientsQuery/${query}`, config);
      // const firsts = tiers.data.clients.slice(0, 100);
      console.log("TIERS".yellow, tiers)
    res.status(200).json(tiers.data.clients);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).send({ message: 'Server Error' });
  }
};

export const getGestimumContacts = async (req: Request, res: Response) => {
  console.log(`getGestimumContacts(${req.params.code})`);
  const { code } = req.params;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.TOKEN_SECRET,
    }
  };

  try {
    const contacts = await axios.get(`${process.env.ERP_API_URL}/utilisateurs/getGestimumUsersOfClient/${code}`, config);
    console.log("CONTACTS".yellow, contacts?.data.users.length)
    if(!contacts.data.users) {
      res.status(404).send({ message: 'No contacts found' });
    }
    res.status(200).json(contacts.data.users);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).send({ message: 'Server Error' });
  }
}
