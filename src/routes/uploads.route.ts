import { Router } from 'express';
import multer from 'multer';

const upload = multer({ dest: 'src/database/uploads' });
import fs from 'fs';
import path from 'path';

const router = Router();

import { getUploads, addUpload  } from '../controllers/uploads.controller';

router.get('/getUploads', getUploads);
// router.post('/addUpload',upload.fields([{name: 'file', maxCount: 1},{name: 'image', maxCount: 1} ]), addUpload);

router.post('/addUpload', upload.fields([{ name: 'file', maxCount: 1 }, { name: 'image', maxCount: 1 }]), (req, res) => {
    // Retrieve the uploaded files
    const files = req.files;
  
    if (files && ('file' in files) && ('image' in files)) {
      const file = files.file[0];
      const image = files.image[0];
      
      const originalName = file.originalname;
      const ext = path.extname(originalName);
      const newName = `${req.body.file_name}_${req.body.version}${ext}`; // Replace with your desired new filename
      const newImageName = `${req.body.file_name}_${req.body.version}_image`; // Replace with your desired new filename
      // Rename the file using fs.renameSync
      const oldPath = file.path;
      const newPath = path.join(file.destination, newName);
      fs.renameSync(oldPath, newPath);

      const oldImagePath = image.path;
      const newImagePath = path.join(image.destination, newImageName);
      fs.renameSync(oldImagePath, newImagePath);

  
      // Update the file object with the new path and filename
        file.filename = newName;
        file.path = newPath;

        image.filename = newImageName;
        image.path = newImagePath;

    }
  
    // Call the addUpload controller function with the updated file object
    addUpload(req, res);
  });
export default router;
