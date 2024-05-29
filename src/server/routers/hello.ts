import { Router } from 'express';

const hello = Router();
hello.get('/hello', (req, res) => res.send('Hello from Express!'));

export default hello;