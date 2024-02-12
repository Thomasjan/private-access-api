import { Request, Response } from 'express';
import { assert, expect } from 'chai';
import request from 'supertest';

import app from '../server';

describe('Mail', () => {
    it('should send an email', async () => {
        const result = await request(app).get(`/mail`);
        assert.equal(result.status, 200);
        assert.equal(result.text, 'Email sent successfully');
        });
    }
);
