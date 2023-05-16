// import { RessourceBody } from 'src/models/ressource.model';
// import {
//   getAllRessources,
// } from '../services/ressource.service';

import express, { Request, Response } from 'express';

export const testController = async (req: Request, res: Response) => {
  try {
    // const data = await getAllRessources();
    const data = [
        {id: 1, name: 'John'},
        {id: 2, name: 'Jane'},
        {id: 3, name: 'Bob'}
    ]
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error : error.message });
  }
};



