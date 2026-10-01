import { FilmService } from '../services/film.service.js';

const getAllFilms = async (req, res) => {
    const filmService = new FilmService();
    try {
        const films = await filmService.getAllFilms();
        res.json(films);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const createFilm = async (req, res) => {

}

const deleteFilm = async (req, res) => {

}

export const filmController = {
    getAllFilms,
    createFilm,
    deleteFilm
};