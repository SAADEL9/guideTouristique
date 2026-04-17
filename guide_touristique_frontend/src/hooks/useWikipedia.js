
import { useState } from 'react';
import { fetchWikiDescription } from '../api/wikipediaService';

const useWikipedia = () => {
    const [description, setDescription] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getDescription = async (query) => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchWikiDescription(query);
            setDescription(data);
        } catch (err) {
            setError(err.message);
            setDescription(null);
        } finally {
            setLoading(false);
        }
    };

    return { description, loading, error, getDescription };
};

export default useWikipedia;