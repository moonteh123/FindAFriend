import 'dotenv/config';
import helmet from "helmet";
import cors from "cors";
import express, { type Express } from "express";
import { pool } from "./config/db.js";
import routes from "./routes/index.js";

export const app: Express = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        return res.status(200).json({ ok: true, db: 'up' });
    } catch (err) {
        console.error('Database connection failed:', err);
        return res.status(500).json({ ok: false, db: 'down' });
    }
})

//rotas
app.use('/api', routes);

