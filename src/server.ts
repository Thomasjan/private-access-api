import express, { Request, Response } from 'express';
import cors from 'cors';

require('dotenv').config();
import apiRouter from './routes';

const app = express()
const port = 3000
app.use(cors());


app.use('/api', apiRouter);

app.get('/', (req: Request, res: Response) => {

    const data = [
        {id: 1, name: 'John'},
        {id: 2, name: 'Jane'},
        {id: 3, name: 'Bob'}
    ]

    res.json(data)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
