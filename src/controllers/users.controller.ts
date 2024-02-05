import { Request, Response } from 'express';
import {connection} from '../database';
import bcrypt from 'bcrypt';

import colors from 'colors';
import nodemailer, { TransportOptions } from 'nodemailer';

require('dotenv').config();

//listes des utilisateurs avec l'entreprise associé
export const getUsers = (req: Request, res: Response) => {
  connection.query('SELECT *, users.id as id, users.created_at AS lastCreated, entreprises.id as entreprise_id FROM users JOIN entreprises ON users.entreprise_id = entreprises.id ORDER BY lastCreated DESC', (err, results: any) => {
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
    console.log(colors.green(`Retrieved ${colors.yellow(users.length)} users`));

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
    console.log(colors.green(`Retrieved user ${colors.yellow(user.name)} ${colors.yellow(user.surname)}`));
    res.json(user);
  });
};

//Création d'un utilisateur

export const addUser = async (req: Request, res: Response): Promise<void> => {
  const { name, surname, email, entreprise_id, role_id } = req.body;

  if (!name || !surname || !email || !entreprise_id || !role_id) {
    res.status(400).send('Veillez remplir tous les champs');
    return;
  }

  try {
    const randomPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    const user = {
      name,
      surname,
      email,
      password: hashedPassword,
      entreprise_id,
      role_id
    };

    // Insert the user into the database
    connection.query('INSERT INTO users SET ?', user, async (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Error adding user');
        return;
      }

      const insertedUserId = (results as any)?.[0]?.insertId;

      // Envoie du mail de bienvenue avec le mot de passe
      try {
        
        const transporter = nodemailer.createTransport({
          host: process.env.MAIL_HOST,
          port: process.env.MAIL_PORT,
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD
          }
        }as TransportOptions);

        const mailOptions = {
          from: 'Gestimum.com',
          to: email,
          // cc: '',
          subject: 'Welcome to the application',
          html: `
            <html>
              <body>
                <h1 style="color: #333; text-align: center">Bonjour ${name},</h1>
                
                <p style="color: #666;">Votre compte d'accés à l'espace privée gestimum a été créé.</p>
                <p style="color: #666;">Votre mot de passe: ${randomPassword}</p>
              </body>
            </html>
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
      } catch (error) {
        console.error('Error sending email:', error);
      }

      res.status(201).json({ id: insertedUserId, ...user });
      console.log(colors.green(`Added user ${colors.yellow(name)} ${colors.yellow(surname)}`));
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).send('Error hashing password');
  }
};

export const updateUser = (req: Request, res: Response) => {
  const userId = req.params.id;
  console.log(req.body)
  const { name, surname, email, entreprise_id, role_id } = req.body;

  if (!name || !surname || !email || !entreprise_id || !role_id) {
    res.status(400).send('Veillez remplir tous les champs');
    return;
  }

  connection.query('UPDATE users SET name = ?, surname = ?, email = ?, entreprise_id = ?, role_id = ? WHERE id = ?', [name, surname, email, entreprise_id, role_id, userId], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error updating user');
      return;
    }
    console.log(results)
    res.status(200).send('User updated successfully');
  });
}


export const updatePassword = async (req: Request, res: Response): Promise<void> => {
  const { password, newPassword } = req.body;
  const userId = req.params.id;

  if (!password || !newPassword) {
    res.status(400).send('Veillez remplir tous les champs');
    return;
  }

  connection.query('SELECT * FROM users WHERE id = ?', userId, async (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error retrieving user');
      return;
    }

    if (Array.isArray(results) && results.length === 0) {
      res.status(404).send('User not found');
      return;
    }

    const user = (results as any)?.[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).send('Invalid password');
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    connection.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Error updating password');
        return;
      }

      res.status(200).send('Password updated successfully');
    });
  });
}

  export const deleteUser = (req: Request, res: Response) => {
    console.log(`delete user (${req.params.id})`)
    const userId = req.params.id;
  
    connection.query('DELETE FROM users WHERE id = ?', userId, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Error deleting user');
        return;
      }
  
      res.status(200).send('User deleted successfully');
    });
     
};




