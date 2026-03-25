import { Router } from 'express';

const petsRoutes= Router();

//rotas de pets

petsRoutes.get('/', async (req, res) => {
    return res.status(501).json({ message: 'Not implemented yet' });
});


petsRoutes.post('/', async (req, res) => {
    return res.status(501).json({ message: 'Not implemented yet' });
});

export default petsRoutes;