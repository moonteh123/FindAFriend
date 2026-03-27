import { Router } from 'express';
import { listAvaliablePets, registerPet } from '../controllers/pets.controllers.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { adminOnly } from '../middlewares/admin-only.middleware.js';


const petsRoutes= Router();

//rotas de pets

petsRoutes.get('/', listAvaliablePets);


petsRoutes.post('/', authMiddleware, adminOnly, registerPet);

export default petsRoutes;