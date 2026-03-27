
import { Router } from "express";
import { register, login } from '../controllers/auth.controller.js';

const router = Router();

//rotas de loginm registro, etc

router.post('/register', register);

router.post('/login', login);


router.get('/me', async (req, res) => {
    return res.status(501).json({ message: 'Not implemented yet' });
});

export default router;