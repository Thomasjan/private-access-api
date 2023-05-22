import { Request, Response } from 'express';
import connection from '../database';


export const login = (req: Request, res: Response): void => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      res.status(400).send({message: 'Remplissez tous les champs !'});
      return;
    }
  
    connection.query('SELECT * FROM users WHERE email = ?', email, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send({message: 'Server Error'});
        return;
      }
  
      const user = (results as any)?.[0];
  
      if (!user) {
        res.status(404).send({message: 'Utilisateur non trouvé'});
        return;
      }
  
      if (user.password !== password) {
        res.status(401).send({message: 'Mot de passe incorrect'});
        return;
      }
  
      res.status(200).json(user);
    });
  };
  