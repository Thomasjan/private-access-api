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

       // Add trace to database
      const date = new Date();
      const user_id = user.id; // Assuming there is an 'id' field in the 'users' table
      const entreprise_id = user.entreprise_id; // Assuming there is an 'entrepriseId' field in the 'users' table

      const trace = { date, user_id, entreprise_id };
      connection.query('INSERT INTO logins SET ?', trace, (err) => {
        if (err) {
          console.error('Error executing query:', err);
          // Handle error if necessary
        }
      });
  
      res.status(200).json(user);
    });
  };

  //Récupérer les logs des logins
  export const getLogins = (req: Request, res: Response): void => {
    connection.query(
      'SELECT logins.date, logins.user_id, logins.entreprise_id, users.email, users.name, users.surname, entreprises.social_reason, entreprises.category, entreprises.subcategory FROM logins INNER JOIN users ON logins.user_id = users.id INNER JOIN entreprises ON users.entreprise_id = entreprises.id',
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
            },
            user: {
              id: row.user_id,
              email: row.email,
              surname: row.surname,
              name: row.name,
            },
          };
        });
  
        res.status(200).json(logins);
      }
    );
  };
  