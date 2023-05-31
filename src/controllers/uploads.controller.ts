import { Request, Response } from 'express';
import connection from '../database';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
import uploadMiddleware from '../middlewares/upload.middleware';

//listes des téléchargements
export const getUploads = (req: Request, res: Response) => {
  connection.query('SELECT * FROM downloads ORDER BY created_at', (err, results: any) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error retrieving downloads');
      return;
    }
    res.json(results);
  });
};



//Ajout d'un téléchargement
export const addUpload = async (req: Request, res: Response,): Promise<void> => {
    // const { version, type, description, file_name, image_path, file_path } = req.body;

    console.log(req.body)
    console.log(req.file)

    // if (!version || !type || !description || !file || !file_name || !image || !image_path || !file_path) {
    //     res.status(400).send({ message: 'Missing fields' });
    //     return;
    // }
    
    // await uploadMiddleware(req, res, (err: any) => {
    //   if (err) {
    //     console.log(err);
    //     res.status(500).send('Error uploading file');
    //     return;
    //   }
      console.log('File uploaded successfully');
  
    //   const upload = {
    //     version,
    //     type,
    //     description,
    //     file_name,
    //     image_path,
    //     file_path,
    //   };
  
    //   connection.query('INSERT INTO uploads SET ?', upload, (err, results: any) => {
    //     if (err) {
    //       console.error('Error executing query:', err);
    //       res.status(500).send('Error adding upload');
    //       return;
    //     }
    //     res.status(201).send({ message: 'Upload added' });
    //   });
    // });
  };
  
  

