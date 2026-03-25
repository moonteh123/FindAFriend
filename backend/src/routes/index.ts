import { Router } from 'express';
import authRoutes from './auth.routes.js';
import petsRoutes from './pets.routes.js';

const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/pets', petsRoutes);

export default routes;

