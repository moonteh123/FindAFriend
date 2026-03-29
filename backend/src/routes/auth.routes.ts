
import { Router } from "express";
import { register, login } from '../controllers/auth.controller.js';
import { validateBody } from '../middlewares/validate-body.middleware.js';
import { authSchema, loginSchema } from '../schemas/auth.schema.js';

const router = Router();

//rotas de loginm registro, etc

router.post('/register', validateBody(authSchema), register);

router.post('/login', validateBody(loginSchema), login);


router.get('/me', async (req, res) => {
    return res.status(501).json({ message: 'Not implemented yet' });
});

export default router;