import { FilmService } from '../services/film.service.js';

const getAllFilms = async (req, res) => {
    const filmService = new FilmService();
    try {
        const films = await filmService.getAllFilms(req.db);
        res.status(200).json(films);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const createFilm = async (req, res) => {
    const filmService = new FilmService();
    try {
        const newFilm = await filmService.createFilm(req.db, {
            ...req.body,
            owner_id: req.user.id,
        });
        res.status(201).json(newFilm);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deleteFilm = async (req, res) => {
    const filmService = new FilmService();
    try {
        await filmService.deleteFilm(req.db, req.params.id);
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const filmController = {
    getAllFilms,
    createFilm,
    deleteFilm
};