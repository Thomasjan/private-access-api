// sample.test.ts
import { assert, expect } from 'chai';
import app from '../server';
// import logger from '../logger';
import request from 'supertest';

describe('Sample Test', () => {
  it('should add two numbers', () => {
    const result = 1 + 1;
    expect(result).to.equal(2);
  });
});


describe('API launch', () => {

  it('should return 200', async () => {
    // Make request
    //api correctly laucnhed test
    const result = await request(app).get(`/`)
    
    // Expect result
    assert.equal(result.status, 200);
  });

});


//test logger
// describe('logger', () => {
//   it('should log error', async () => {
//     // Assuming logger.error is an asynchronous function
//     const loggerInstance = logger.error(new Error('test error'));
//     // Wait for the logging operation to complete (if asynchronous)
//     await new Promise(resolve => setTimeout(resolve, 1000));
//     // Instead of expecting undefined, check if the logger instance is truthy
//     expect(loggerInstance).to.be.ok;
//   });
// });

//Error 404 route not found
describe('Error 404', () => {

  it('should return 404', async () => {
    // Make request
    const result = await request(app).get(`/api/v1/non-existent-route/`)
    // Expect result
    assert.equal(result.status, 404);
  });

});

