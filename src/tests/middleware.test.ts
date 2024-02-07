//test uploadMiddleware
import { assert, expect } from 'chai';

import request from 'supertest';
import app from '../server';
import fs from 'fs';
import path from 'path';
import { describe } from 'mocha';
import { Response } from 'express';


// describe('Upload Middleware', () => {

//   it('should upload a file', async () => {
//     const filePath = path.join(__dirname, 'test-files', 'test.txt');
//     const file = fs.createReadStream(filePath);

//     const result = await request(app)
//       .post('/api/v1/upload')
//       .attach('file', file);

//     assert.equal(result.status, 200);
//     assert.equal(result.text, 'File uploaded successfully');
//     });
// });
