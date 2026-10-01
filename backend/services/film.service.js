const queryAllFilms = async (db, genre) => {
    let query = db.from('items').select('*');

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

const queryCreateFilm = async (db, filmData) => {
    const { data, error } = await db
        .from('items')
        .insert([filmData])
        .select()
        .single();

    if (error) {
        console.error('Supabase error:', error);
        throw error;
    }
    console.log('Created film:', data);

    return data;
}

const queryDeleteFilm = async (db, filmId) => {
    const { data, error } = await db
        .from('items')
        .delete()
        .eq('id', filmId);

    if (error) {
        console.error('Supabase error:', error);
        throw error;
    }
    console.log('Deleted film:', data);

    return data;
}

class FilmService {
    async getAllFilms(db, genre) {
        return await queryAllFilms(db, genre);
    }

    async createFilm(db, filmData) {
        return await queryCreateFilm(db, filmData);
    }

    async deleteFilm(db, filmId) {
        return await queryDeleteFilm(db, filmId);
    }
}

export { FilmService };
