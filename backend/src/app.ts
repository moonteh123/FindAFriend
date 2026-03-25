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

//rotas
app.use('/api', routes);

app.get('/', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.send('API is working!');
    } catch(err) {
        console.error('Database connection failed:', err);
        res.status(500).send('Database connection failed');
    }
    
});
