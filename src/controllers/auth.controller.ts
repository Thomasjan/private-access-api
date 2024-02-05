import { Request, Response } from 'express';
import {connection} from '../database';
import bcrypt from 'bcrypt';
import colors, { random } from 'colors';
import nodemailer, { TransportOptions } from 'nodemailer';
import path from 'path';

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

        //check if entreprises.end_contract is not expired
        if (results[0].end_contract) {
          const endContract = results[0].end_contract;
          const endContractDate = new Date(endContract);
          const today = new Date();
          if (today > endContractDate) {
            res.status(401).send({ message: 'Votre contrat a expiré' });
            return;
          }
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
      'SELECT * FROM logins ORDER BY `created_at` DESC',
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



  export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    // Implement logic for generating a random password
    const randomPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    // const email = req.body.email;
    // await updateUserPassword(email, hashedPassword);
  
    // Implement logic for sending the password reset email
    const emailSent = await sendPasswordResetEmail(req.body.email, randomPassword);
  
    if (emailSent) {
      res.status(200).json({ message: 'Password reset email sent.' });
    } else {
      res.status(500).json({ error: 'Failed to send password reset email.' });
    }
  };

  export const sendPasswordResetEmail = async (email: string, password: string): Promise<boolean> => {
    // Implement logic for sending the email using a mail delivery service or library
    // For example, using Nodemailer
    
    try {
        
      const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD
        }
      }as TransportOptions);

      const resetLink = `http://api-espace-prive.gestimum.com/api/auth/resetPassword/${email}`;

      const mailOptions = {
        from: process.env.MAIL_FROM_ADDRESS,
        to: email,
        subject: 'Réinitialisation de votre mot de passe',
        html: `
        <div style="text-align: center;">
          <img src="data:image/png;base64,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" alt="Gestimum" style="width: 300px; margin-bottom: 20px">
          <h2>Bonjour, </h2>
          <h4>Vous avez demandé une réinitialisation de votre mot de passe.</h4>
          <p style="margin-top: 10px">Cliquez sur le bouton ci-dessous pour réinitialiser votre mot de passe :</p>
          <a href="${resetLink}" style="width: 50%; margin-horizontal: auto">
            <button style="background-color: #EB6F2A; color: white; padding: 10px 15px; border: none; cursor: pointer; border-radius: 10px">
              Réinitialiser le mot de passe
            </button>
          </a>
          <p style="font-style: italic; margin-top: 20px">Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.</p>
          </div>
          `,
      };

      await transporter.sendMail(mailOptions);
      console.log(colors.magenta('sendPasswordResetEmail: ') + colors.green('Email sent successfully'));
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  };


  export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    console.log(colors.blue('Resetting password...'));
    const email = req.params.email;
    
    try {
      // Generate a new random password
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
  
      // Update the user's password in the database
      await updateUserPassword(email, hashedPassword);
  
      // Send the password reset email
      const emailSent = await sendNewPasswordEmail(email, randomPassword);
  
      if (emailSent) {
        const viewPath = path.join(__dirname, '../database/views/resetPassword.html');
        res.status(200).sendFile(viewPath);
        // .json('Votre mot de passe a été réinitialisé. Vous allez recevoir un email avec votre nouveau mot de passe.')
      } else {
        res.status(500).json({ error: 'Failed to send password reset email.' });
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      res.status(500).json({ error: 'Failed to reset password.' });
    }
  };
  

  export const updateUserPassword = async (email: string, hashedPassword: string): Promise<void> => {
    console.log(colors.blue('Updating user password...'))
    // Implement logic for updating the user's password
    connection.query(
      'UPDATE users SET password = ? WHERE email = ?',
      [hashedPassword, email],
      (err, results) => {
        if (err) {
          console.error('Error executing query:', err);
          // Handle error if necessary
        }
      }
    );
  };


  const sendNewPasswordEmail = async (email: string, password: string): Promise<boolean> => {
    console.log(colors.blue('Sending new password email...'))
    // Implement logic for sending the email using a mail delivery service or library
    // For example, using Nodemailer
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD
        }
      }as TransportOptions);

      const loginLink = `http://espace-prive-dev.gestimum.com/login`;
      

      const mailOptions = {
        from: 'Gestimum.com',
        to: email,
        subject: 'Votre mot de passe a été réinitialisé',
        html: `
        <div style="width: 50%; margin: 0 auto; text-align: center">
          <img src="data:image/png;base64,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" alt="Gestimum" style="width: 300px; margin-bottom: 20px">
          <h2>Votre mot de passe a été réinitialisé.</h2>
          <p>Voici votre nouveau mot de passe :</p>
          <p style="font-size: 24px; font-weight: bold;">${password}</p>
          <p>Vous pouvez vous connecter en cliquant sur le bouton ci-dessous :</p>
          <a href="${loginLink}" style="width: 50%; margin-horizontal: auto">
            <button style="background-color: #EB6F2A; color: white; padding: 10px 15px; border: none; cursor: pointer; border-radius: 10px">
              Se connecter
            </button>
          </a>
        </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(colors.magenta('sendNewPasswordEmail: ') + colors.green('Email sent successfully'));

      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  