import { Request, Response } from 'express';
import connection from '../database';

//listes des téléchargements
export const getDownloads = (req: Request, res: Response) => {
  connection.query('SELECT * FROM downloads ORDER BY created_at', (err, results: any) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error retrieving downloads');
      return;
    }
    res.json(results);
  });
};



//Ajout d'un téléchargement
export const addDownload = async (req: Request, res: Response): Promise<void> => {
  const { name, surname, email, file_name, entreprise_id } = req.body;

  if (!name || !email || !file_name || !entreprise_id || !surname) {
    res.status(400).send('Invalid request');
    return;
  }

  
  // Récupération de l'entreprise (entreprise_id)
  connection.query('SELECT * FROM Entreprises WHERE id = ?', entreprise_id, (err, results: any) => {
    if (err) {
      console.error('Error executing query:', err);
      // Handle error if necessary
      res.status(500).send({ message: 'Erreur lors de la récupération de la raison sociale' });
      return;
    }

    if (results.length === 0) {
      // Handle case when no entreprise is found with the provided entrepriseId
      res.status(404).send({ message: 'Aucune entreprise trouvée avec l\'ID fourni' });
      return;
    }

    const social_reason = results[0].social_reason;
    const date = new Date();

  try {

    const download = {
      name,
      surname,
      email,
      file_name,
      social_reason,
      date,
    };

    connection.query('INSERT INTO downloads SET ?', download, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Error adding download');
        return;
      }

      const insertDownloadId = (results as any)?.[0]?.insertId;
      res.status(201).json({ id: insertDownloadId, ...download });
    });
  } catch (error) {
    console.error('Error adding download:', error);
    res.status(500).send('Error adding download');
  }
});

};

