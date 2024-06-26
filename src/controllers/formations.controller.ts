import { Request, Response } from 'express';
import {connection} from '../database';

import colors from 'colors';


//listes des formations et durée
export const getFormations = (req: Request, res: Response) => {
  connection.query("SELECT * FROM Formations", (err, results: any) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error retrieving formations');
      return;
    }

    console.log(colors.green(`Retrieved ${colors.yellow(results.length)} formations`));
    res.json(results);
  });
};

//Edition formation
export const editFormation = (req: Request, res: Response) => {
  const id = req.params.id;
  const newFormation = req.body;

  connection.query('UPDATE Formations set ? WHERE id = ?', [newFormation, id], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error updating a formation');
      return;
    }

    console.log(colors.green(`Updated formation ${colors.yellow(newFormation.title)} with id ${colors.yellow(id)}`));
    res.json(results);
  });
}

//Ajout formation
export const addFormation = (req: Request, res: Response) => {
  const newFormation = req.body;

  connection.query('INSERT INTO Formations set ?', newFormation, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error adding a formation');
      return;
    }

    console.log(colors.green(`Added formation ${colors.yellow(newFormation.title)}`));
    res.json(results);
  });
}

//Suppression formation
export const deleteFormation = (req: Request, res: Response) => {
  const id = req.params.id;

  connection.query('DELETE FROM Formations WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error deleting a formation');
      return;
    }

    console.log(colors.green(`Deleted formation with id ${colors.yellow(id)}`));
    res.json(results);
  });
}

