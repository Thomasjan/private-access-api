import { Request, Response } from 'express';
import connection from '../database';
import bcrypt from 'bcrypt';

//listes des utilisateurs avec l'entreprise associé
export const getUsers = (req: Request, res: Response) => {
  connection.query('SELECT users.*, entreprises.* FROM users JOIN entreprises ON users.entreprise_id = entreprises.id', (err, results: any) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error retrieving users');
      return;
    }

    // Map the results to include the 'entreprise' object in each user
    const users = results.map((user: any) => {
      const { entreprise_id, ...userData } = user;
      return { ...userData };
    });

    res.json(users);
  });
};

export const getUser = (req: Request, res: Response) => {
  const userId = req.params.id; // Assuming the user ID is passed as a parameter in the URL
  
  console.log('Fetching user with ID: ' + userId)
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
export const addUser = async (req: Request, res: Response): Promise<void> => {
  const { name, surname, email, password, entreprise_id, role_id } = req.body;

  if (!name || !email || !password) {
    res.status(400).send('Invalid request');
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      name,
      surname,
      email,
      password: hashedPassword,
      entreprise_id,
      role_id
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
  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).send('Error hashing password');
  }
};

