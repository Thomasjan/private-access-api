import { Request, Response } from 'express';
import connection from '../database';
import multer from 'multer';


const upload = multer({ dest: 'uploads/' });
import uploadMiddleware from '../middlewares/upload.middleware';

//listes des téléchargements
export const getUploads = (req: Request, res: Response) => {
  connection.query('SELECT * FROM uploads ORDER BY created_at', (err, results: any) => {
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
    const { version, type, description, file_name, image_path, file_path } = req.body;

    if (!req.files || !('file' in req.files) || !('image' in req.files)) {
      res.status(400).send('No file or image uploaded');
      return;
    }

    console.log('body', req.body)
    console.log('files', req.files)

    // if (!version || !type || !description || !file || !file_name || !image || !image_path || !file_path) {
    //     res.status(400).send({ message: 'Missing fields' });
    //     return;
    // }
    
    
      console.log('File uploaded successfully');
  
      const upload = {
        version,
        type,
        description,
        file_name,
        image_path: req.files['image'][0].filename,
        file_path: req.files['file'][0].filename,
        // image_path: req.files['image'][0].path,
        // file_path: req.files['file'][0].path,
      };

      console.log(upload)
  
      connection.query('INSERT INTO uploads SET ?', upload, (err, results: any) => {
        if (err) {
          console.error('Error executing query:', err);
          res.status(500).send('Error adding upload');
          return;
        }
        res.status(201).send({ message: 'Upload added' });
    });
  };
  
  

