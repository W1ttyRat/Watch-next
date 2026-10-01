import { FilmService } from '../services/film.service.js';

const getAllFilms = async (req, res) => {
    const filmService = new FilmService();
    try {
        const films = await filmService.getAllFilms(req.db, req.query.genre);
        res.status(200).json(films);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const createFilm = async (req, res) => {

    const { title, genre } = req.body;
    const allowedGenres = ['comedy', 'action', 'drama', 'other'];

    if (
        typeof title !== 'string' ||
        title.trim().length < 1 ||
        title.trim().length > 100 ||
        !allowedGenres.includes(genre)
    ) {
        return res.status(400).json({
            error: 'Title must be 1-100 characters and genre must be valid',
        });
    }

    const filmService = new FilmService();
    try {
        const newFilm = await filmService.createFilm(req.db, {
            title: title.trim(),
            genre,
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