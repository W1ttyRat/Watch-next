import { authClient } from '../config/db.js';

const queryAllFilms = async () => {
    const { data, error } = await authClient
        .from('items')
        .select('*');

    if (error) {
        console.error('Supabase error:', error);
        throw error;
    }
    console.log('Fetched films:', data);

    return data;
};

class FilmService {
    async getAllFilms() {
        return await queryAllFilms();
    }
}

export { FilmService };
