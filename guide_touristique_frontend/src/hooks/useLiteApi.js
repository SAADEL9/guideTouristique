import { useState } from 'react';
import { searchHotels, getHotelDetails } from '../api/liteApiApi';

const useLiteApi = () => {
    const [hotels, setHotels] = useState([]);
    const [hotelDetail, setHotelDetail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const search = async (city, countryCode) => {
        setLoading(true);
        setError(null);
        try {
            const data = await searchHotels(city, countryCode);
            setHotels(data);
        } catch (err) {
            setError('Failed to fetch hotels');
        } finally {
            setLoading(false);
        }
    };

    const getDetails = async (hotelId) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getHotelDetails(hotelId);
            setHotelDetail(data);
        } catch (err) {
            setError('Failed to fetch hotel details');
        } finally {
            setLoading(false);
        }
    };

    return { hotels, hotelDetail, loading, error, search, getDetails };
};

export default useLiteApi;