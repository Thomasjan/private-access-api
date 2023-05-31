import { Request, Response } from 'express';
import connection from '../database';
import bcrypt from 'bcrypt';

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

  // Check if an entreprise with the same code_client or social_reason already exists
  connection.query(
    'SELECT * FROM Entreprises WHERE code_client = ? OR social_reason = ?',
    [code_client, social_reason],
    (err, results: any) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send("Erreur lors de la vérification de l'entreprise");
        return;
      }

      
      if (results.length > 0) {
        res.status(409).send('Une entreprise avec le même code_client ou le même nom existe déjà');
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

    const insertedEntrepriseId = (results as any)?.insertId;
    const user = {
      name: 'user',
      surname: entreprise.social_reason,
      email: 'user@'+entreprise.social_reason+'.com',
      password: 'user@'+entreprise.social_reason+'.com',
      entreprise_id: insertedEntrepriseId,
      role_id: 0,
    };

    switch (entreprise.category) {
      case '1. PARTENAIRE':
        user.role_id = 2;
        break;
      case '2. PME':
        user.role_id = 3;
        break;
      default:
        user.role_id = 4;
        break;
    }

    createUser(user)
      .then(() => {
        res.status(201).json({ id: insertedEntrepriseId, ...entreprise });
      })
      .catch((error) => {
        console.error('Error creating user:', error);
        res.status(500).send("Erreur de la création de l'utilisateur");
      });
    });
  });
};

const createUser = (user: any): Promise<void> => {
  return new Promise<void>((resolve, reject) => {

    bcrypt.hash(user.password, 10, (err, hashedPassword) => {
      if (err) {
        console.error('Error hashing password:', err);
        reject(err);
        return;
      }

      // Replace the password with the hashed password
      user.password = hashedPassword;

      // Insert the user into the database
      connection.query('INSERT INTO Users SET ?', user, (err) => {
        if (err) {
          console.error('Error executing query:', err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
};

export const updateEntreprise = (req: Request, res: Response): void => {
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

  connection.query(
    'UPDATE Entreprises SET ? WHERE id = ?',
    [entreprise, req.params.id],
    (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send("Erreur de la modification de l'entreprise");
        return;
      }

      res.status(200).json({ id: req.params.id, ...entreprise });
    }
  );
}

// export const deleteEntreprise = (req: Request, res: Response): void => {
//   connection.query('DELETE FROM Entreprises WHERE id = ?', req.params.id, (err, results) => {
//     if (err) {
//       console.error('Error executing query:', err);
//       res.status(500).send("Erreur de la suppression de l'entreprise");
//       return;
//     }

//     res.status(200).json({ id: req.params.id });
//   });
// }

export const deleteEntreprise = (req: Request, res: Response): void => {
  const entrepriseId = req.params.id;

  connection.query('DELETE FROM Users WHERE entreprise_id = ?', entrepriseId, (err, usersResult) => {
    if (err) {
      console.error('Error executing users deletion query:', err);
      res.status(500).send("Erreur de la suppression des utilisateurs de l'entreprise");
      return;
    }

    connection.query('DELETE FROM Entreprises WHERE id = ?', entrepriseId, (err, entrepriseResult) => {
      if (err) {
        console.error('Error executing entreprise deletion query:', err);
        res.status(500).send("Erreur de la suppression de l'entreprise");
        return;
      }

      res.status(200).json({ id: entrepriseId });
    });
  });
};



