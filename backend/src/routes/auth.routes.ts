import { Router } from "express";

const router = Router();

//rotas de loginm registro, etc

router.post('/register', async (req, res) => {
    return res.status(501).json({ message: 'Not implemented yet' });
});

router.post('/login', async (req, res) => {
    return res.status(501).json({ message: 'Not implemented yet' });
});


router.get('/me', async (req, res) => {
    return res.status(501).json({ message: 'Not implemented yet' });
});

export default router;