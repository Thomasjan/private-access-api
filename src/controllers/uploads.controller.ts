import { Request, Response } from 'express';
import {connection} from '../database';
import multer from 'multer';

import colors from 'colors';

const upload = multer({ dest: 'uploads/' });
import uploadMiddleware from '../middlewares/upload.middleware';

//listes des téléchargements
export const getUploads = (req: Request, res: Response) => {
  connection.query("SELECT * FROM uploads WHERE type='Commerciale' ORDER BY created_at DESC", (err, results: any) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error retrieving downloads');
      return;
    }
    console.log(colors.green(`Retrieved ${colors.yellow(results.length)} downloads`));
    res.json(results);
  });
};

//Derniere version
export const getLastUpload = (req: Request, res: Response) => {
  connection.query("SELECT * FROM uploads WHERE type='Commerciale' ORDER BY created_at DESC LIMIT 1", (err, results: any) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error retrieving downloads');
      return;
    }
    console.log(colors.green(`Retrieved last upload:  ${colors.yellow(results[0]?.file_name + ' ' + results[0]?.version)} `));
    res.json(results[0]);
  });
};

//Ajout d'un téléchargement
export const addUpload = async (req: Request, res: Response,): Promise<void> => {
    const { version, type, file_name, description, patch  } = req.body;

    if (!req.files || !('file' in req.files) || !('image' in req.files)) {
      res.status(400).send('No file or image uploaded');
      return;
    }

    if (!version || !type || !description  || !file_name  ) {
        res.status(400).send({ message: 'Missing fields' });
        return;
    }
    
      const upload = {
        version,
        type,
        file_name,
        description,
        patch,
        image_path: req.files['image'][0].filename,
        file_path: req.files['file'][0].filename,
      };

      console.log(upload)
  
      connection.query('INSERT INTO uploads SET ?', upload, (err, results: any) => {
        if (err) {
          console.error('Error executing query:', err);
          res.status(500).send('Error adding upload');
          return;
        }
        console.log(colors.green(`Added upload ${colors.yellow(upload.version)}`));
        res.status(201).send({ message: 'Upload added' });
    });
  };

