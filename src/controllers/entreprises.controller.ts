import { Request, Response } from 'express';
import connection from '../database';

//listes des utilisateurs
export const getEntreprises = ((req: Request, res: Response) => {
  connection.query('SELECT * FROM Entreprises', (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Erreur de chargements des entreprises');
      return;
    }
    res.json(results);
  });
});

//Création d'une entreprise
export const addEntreprise = (req: Request, res: Response): void => {
  const { social_reason, code_client, category, subcategory, contract, end_contract } = req.body;

  if (!social_reason || !code_client || !category || !subcategory || !contract || !end_contract) {
    res.status(400).send('Veuillez remplir tous les champs');
    return;
  }

  const entreprise = {
    social_reason,
    code_client,
    category,
    subcategory,
    contract,
    end_contract,
  };

  connection.query('INSERT INTO Entreprises SET ?', entreprise, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send("Erreur de l'ajout de l'entreprise");
      return;
    }

    const insertedEntrepriseId = (results as any)?.[0]?.insertId;
    res.status(201).json({ id: insertedEntrepriseId, ...entreprise });
  });
};


