import { useState, useEffect } from 'react';
import { searchImages } from '../api/unsplashService';

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
        const results = await searchImages(query, 8);
        
        if (results.length === 0) {
          setImages([]);
          setError('No images found');
        } else {
          setImages(results);
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
