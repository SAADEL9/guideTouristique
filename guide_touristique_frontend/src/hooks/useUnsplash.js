import { useState, useEffect } from 'react';

const useUnsplash = (query) => {
  const [images, setImages] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) {
      setImages(null);
      setError(null);
      return;
    }

    const fetchImages = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiKey = process.env.REACT_APP_UNSPLASH_KEY;
        if (!apiKey) throw new Error('Unsplash API key not configured');

        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=5&client_id=${apiKey}`
        );

        if (!response.ok) throw new Error('Failed to fetch images');
        const data = await response.json();

        if (data.results.length === 0) {
          setImages([]);
          setError('No images found');
        } else {
          setImages(data.results);
        }
      } catch (err) {
        setError(err.message);
        setImages(null);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [query]);

  return { images, loading, error };
};

export default useUnsplash;
