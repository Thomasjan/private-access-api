import { Router } from 'express';
import multer from 'multer';

const upload = multer({ dest: 'src/database/uploads' });
import fs from 'fs';
import path from 'path';

const router = Router();

import { getUploads, getLastUpload, addUpload  } from '../controllers/uploads.controller';

router.get('/getUploads', getUploads);
router.get('/getLastUpload', getLastUpload);

router.post('/addUpload', upload.fields([{ name: 'file', maxCount: 1 }, { name: 'image', maxCount: 1 }]), (req, res) => {
  // Récupère les fichiers et les renomme

    const files = req.files;
  
    if (files && ('file' in files) && ('image' in files)) {
      const file = files.file[0];
      const image = files.image[0];
      
      const originalName = file.originalname;
      const ext = path.extname(originalName);
      const newName = `${req.body.file_name}_${req.body.version}${ext}`; // Nouveau nom du fichier
      const newImageName = `${req.body.file_name}_${req.body.version}_image`; // Nouveau nom de l'image
      // Rename the file using fs.renameSync
      const oldPath = file.path;
      const newPath = path.join(file.destination, newName);
      fs.renameSync(oldPath, newPath);

      const oldImagePath = image.path;
      const newImagePath = path.join(image.destination, newImageName);
      fs.renameSync(oldImagePath, newImagePath);

  
      // mis à jour des propriétés du fichier
        file.filename = newName;
        file.path = newPath;

        image.filename = newImageName;
        image.path = newImagePath;

    }
  
    // Appel de la fonction addUpload
    addUpload(req, res);
  });
export default router;
