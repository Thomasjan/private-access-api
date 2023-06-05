import { Request, Response } from 'express';
import connection from '../database';
import bcrypt from 'bcrypt';

import nodemailer, { TransportOptions } from 'nodemailer';

require('dotenv').config();

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
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).send('Error hashing password');
  }
};

