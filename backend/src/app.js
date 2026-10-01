import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

import filmRoutes from '../routes/film.route.js';
app.use('/api', filmRoutes);

app.use(cors());
app.use(express.json({ limit: '10kb' }));

export default app;