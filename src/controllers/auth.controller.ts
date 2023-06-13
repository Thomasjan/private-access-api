import { Request, Response } from 'express';
import {connection} from '../database';
import bcrypt from 'bcrypt';
import colors from 'colors';

export const login = (req: Request, res: Response): void => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).send({ message: 'Remplissez tous les champs !' });
    return;
  }

  connection.query('SELECT * FROM users WHERE email = ?', email, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send({ message: 'Server Error' });
      return;
    }

    const user = (results as any)?.[0];

    if (!user) {
      res.status(404).send({ message: 'Utilisateur non trouvé' });
      return;
    }

    bcrypt.compare(password, user.password, (err, passwordMatch) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        res.status(500).send({ message: 'Server Error' });
        return;
      }

      if (!passwordMatch) {
        res.status(401).send({ message: 'Mot de passe incorrect' });
        return;
      }

      // Passwords match, continue with the login process

      // Add trace to database
      const date = new Date();
      const name = user.name;
      const surname = user.surname;
      const entrepriseId = user.entreprise_id; // Assuming there is an 'entreprise_id' field in the 'users' table

      // Retrieve the social_reason from the entreprises table based on entrepriseId
      connection.query('SELECT * FROM Entreprises WHERE id = ?', entrepriseId, (err, results: any) => {
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
        const category = results[0].category;
        const subcategory = results[0].subcategory;

        const trace = { date, name, surname, social_reason, category, subcategory };

        // Ajouter les logs des logins pour les utilisateurs non admins
        if (user.role_id > 1) {
          connection.query('INSERT INTO logins SET ?', trace, (err) => {
            if (err) {
              console.error('Error executing query:', err);
              // Handle error if necessary
            }
          });
        }
        console.log(colors.green(`User ${colors.yellow(user.email)} logged in`));
        res.status(200).json(user);
      });
    });
  });
};

  //Récupérer les logs des logins
  export const getLogins = (req: Request, res: Response): void => {
    connection.query(
      'SELECT * FROM logins',
      (err, results: any) => {
        if (err) {
          console.error('Error executing query:', err);
          res.status(500).send({ message: 'Server Error' });
          return;
        }
  
        const logins = results.map((row: any) => {
          return {
            date: row.date,
            entreprise: {
              id: row.entreprise_id,
              social_reason: row.social_reason,
              category: row.category,
              subcategory: row.subcategory,
              // contract: row.contract,
              // end_contract: row.end_contract,
            },
            user: {
              id: row.user_id,
              email: row.email,
              surname: row.surname,
              name: row.name,
            },
          };
        });
  
        console.log(colors.green(`Retrieved ${colors.yellow(logins.length)} logins`));
        res.status(200).json(logins);
      }
    );
  };
  