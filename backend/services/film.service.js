import { authClient } from '../config/db.js';

const queryAllFilms = async () => {
    let query = authClient.from('items').select('*');

    if (genre) {
        query = query.eq('genre', genre);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Supabase error:', error);
        throw error;
    }
    console.log('Fetched films:', data);

    return data;
};

const queryCreateFilm = async (filmData) => {
    const { data, error } = await authClient
        .from('items')
        .insert([filmData]);

    if (error) {
        console.error('Supabase error:', error);
        throw error;
    }
    console.log('Created film:', data);

    return data;
}

const queryDeleteFilm = async (filmId) => {
    const { data, error } = await authClient
        .from('items')
        .delete()
        .eq('id', filmId);

    if (error) {
        console.error('Supabase error:', error);
        throw error;
    }
    console.log('Deleted film:', data);
    res.status(200).json(data);

    return data;
}

class FilmService {
    async getAllFilms() {
        return await queryAllFilms();
    }

    async createFilm(filmData) {
        return await queryCreateFilm(filmData);
    }

    async deleteFilm(filmId) {
        return await queryDeleteFilm(filmId);
    }
}

export { FilmService };
