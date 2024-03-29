import { Request, Response } from 'express';
import {connection} from '../database';

import colors from 'colors';

//listes des pdfs de la page Support
export const getSupportsPdfs = (req: Request, res: Response) => {
  connection.query("SELECT * FROM pdfs WHERE ref = 'support'", (err, results: any) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error retrieving pdfs');
      return;
    }

    console.log(colors.green(`Retrieved ${colors.yellow(results.length)} pdfs`));
    res.json(results);
  });
};

//listes des pdfs de la page Aide à la vente
export const getAideVentePdfs = (req: Request, res: Response) => {
  connection.query("SELECT * FROM pdfs WHERE ref = 'aide-vente'", (err, results: any) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error retrieving pdfs');
      return;
    }

    console.log(colors.green(`Retrieved ${colors.yellow(results.length)} pdfs`));
    res.json(results);
  });
};

//listes des pdfs de la page Aide à la vente
export const getFormationPdfs = (req: Request, res: Response) => {
  connection.query("SELECT * FROM pdfs WHERE ref = 'formation'", (err, results: any) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error retrieving pdfs');
      return;
    }

    console.log(colors.green(`Retrieved ${colors.yellow(results.length)} pdfs`));
    res.json(results);
  });
};

//Edition PDF
export const editPdf = (req: Request, res: Response) => {
  const id = req.params.id;
  const newPdf = req.body;

  connection.query('UPDATE pdfs set ? WHERE id = ?', [newPdf, id], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error updating a pdf');
      return;
    }

    console.log(colors.green(`Updated pdf ${colors.yellow(newPdf.title)} with id ${colors.yellow(id)}`));
    res.json(results);
  });
}

//Ajout PDF
export const addPdf = (req: Request, res: Response) => {
  const newPdf = req.body;

  connection.query('INSERT INTO pdfs set ?', newPdf, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error adding a pdf');
      return;
    }

    console.log(colors.green(`Added pdf ${colors.yellow(newPdf.title)}`));
    res.json(results);
  });
}

//Suppression PDF
export const deletePdf = (req: Request, res: Response) => {
  const id = req.params.id;

  connection.query('DELETE FROM pdfs WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error deleting a pdf');
      return;
    }

    console.log(colors.green(`Deleted pdf with id ${colors.yellow(id)}`));
    res.json(results);
  });
}

