import { Router } from 'express';
import { listAvaliablePets, registerPet } from '../controllers/pets.controllers.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { adminOnly } from '../middlewares/admin-only.middleware.js';
import { validateBody } from '../middlewares/validate-body.middleware.js';
import { petSchema } from '../schemas/pets.schema.js';


const petsRoutes= Router();

//rotas de pets

petsRoutes.get('/', listAvaliablePets);


petsRoutes.post('/', authMiddleware, adminOnly, validateBody(petSchema), registerPet);

export default petsRoutes;