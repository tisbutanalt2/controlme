import { Router } from 'express';

import functions from 'functions';
import invokeFunction from '@utils/server/invokeFunction';

import requireLoggedIn from '@utils/server/requireLoggedIn';

const functionRouter = Router();

functionRouter.get('/functions', requireLoggedIn(true, true), (req, res) => {
    const arr: Array<ControlMe.ReducedFunction> = [];

    functions.forEach(({ handler, validateArgs, options, ...func }) => {
        arr.push(func);
    });

    res.json(arr);
});

functionRouter.post('/function/:name', requireLoggedIn(true, true), async (req, res) => {
    const name = req.params.name;
    if (!name) return res.status(400).send('Missing function name. Please add it to the end of the URL, such as /function/imagePopup');
    
    const functionRes = await invokeFunction(name, req.user, req.body || {});
    res.json(functionRes);
});

export default functionRouter;