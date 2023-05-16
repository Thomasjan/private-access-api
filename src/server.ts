import express, { Request, Response } from 'express';
require('dotenv').config();


const app = express()
const port = 3000


app.get('/', (req, res) => {

    const data = [
        {id: 1, name: 'John'},
        {id: 2, name: 'Jane'},
        {id: 3, name: 'Bob'}
    ]

    res.json(data)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
