import e, { Request, Response } from 'express';
import {connection} from '../database';



//listes des utilisateurs avec l'entreprise associé
export const getSupportsPdfs = (req: Request, res: Response) => {
  connection.query('SELECT * FROM Support_pdfs', (err, results: any) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error retrieving pdfs');
      return;
    }

    res.json(results);
  });
};

export const editSupportPdf = (req: Request, res: Response) => {
  const id = req.params.id;
  const newSupportPdf = req.body;

  connection.query('UPDATE Support_pdfs set ? WHERE id = ?', [newSupportPdf, id], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error updating a pdf');
      return;
    }

    res.json(results);
  });
}

export const addSupportPdf = (req: Request, res: Response) => {
  const newSupportPdf = req.body;

  connection.query('INSERT INTO Support_pdfs set ?', newSupportPdf, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error adding a pdf');
      return;
    }

    res.json(results);
  });
}

export const deleteSupportPdf = (req: Request, res: Response) => {
  const id = req.params.id;

  connection.query('DELETE FROM Support_pdfs WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error deleting a pdf');
      return;
    }

    res.json(results);
  });
}



