import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '10kb' }));

import filmRoutes from '../routes/film.route.js';
app.use('/api', filmRoutes);

export default app;