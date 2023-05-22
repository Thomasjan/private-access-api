import { Request, Response } from 'express';
import connection from '../database';

//listes des utilisateurs
export const getEntreprises = ((req: Request, res: Response) => {
  connection.query('SELECT * FROM Entreprises', (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error retrieving entreprises');
      return;
    }
    res.json(results);
  });
});

//Création d'un utilisateur
export const addEntreprise = (req: Request, res: Response): void => {
  const { social_reason } = req.body;

  if (!social_reason) {
    res.status(400).send('Invalid request');
    return;
  }

  const entreprise = {
    social_reason,
  };

  connection.query('INSERT INTO Entreprise SET ?', entreprise, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error adding entreprise');
      return;
    }

    const insertedEntrepriseId = (results as any)?.[0]?.insertId;
    res.status(201).json({ id: insertedEntrepriseId, ...entreprise });
  });
};


