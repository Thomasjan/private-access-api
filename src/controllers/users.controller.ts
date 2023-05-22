import { Request, Response } from 'express';
import connection from '../database';

//listes des utilisateurs
export const getUsers = ((req: Request, res: Response) => {
  connection.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error retrieving users');
      return;
    }
    res.json(results);
  });
});

export const getUser = (req: Request, res: Response) => {
  const userId = req.params.id; // Assuming the user ID is passed as a parameter in the URL
  
  connection.query('SELECT * FROM users WHERE id = ?', userId, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error retrieving user');
      return;
    }

    if (Array.isArray(results) && results.length === 0) {
      res.status(404).send('User not found');
      return;
    }

    const user = (results as any)?.[0]
    res.json(user);
  });
};

//Création d'un utilisateur
export const addUser = (req: Request, res: Response): void => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).send('Invalid request');
    return;
  }

  const user = {
    name,
    email,
    password,
  };

  connection.query('INSERT INTO users SET ?', user, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error adding user');
      return;
    }

    const insertedUserId = (results as any)?.[0]?.insertId;
    res.status(201).json({ id: insertedUserId, ...user });
  });
};


