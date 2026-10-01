import express from 'express';
import { filmController } from '../controllers/film.controller.js';
import { requireGuest } from '../middleware/auth.middleware.js';

const router = express.Router();



router.get('/film', requireGuest, filmController.getAllFilms);
router.post('/film', requireGuest, filmController.createFilm);
router.delete('/film/:id', requireGuest, filmController.deleteFilm);

export default router;