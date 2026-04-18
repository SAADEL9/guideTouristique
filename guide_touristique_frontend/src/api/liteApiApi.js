import axiosInstance from './AxiosInstance';

export const searchHotels = async (city, countryCode = 'MA') => {
    const res = await axiosInstance.get('/hotels/search', {
        params: { city, countryCode }
    });
    return res.data;
};

export const getHotelDetails = async (hotelId) => {
    const res = await axiosInstance.get('/hotels/details', {
        params: { hotelId }
    });
    return res.data;
};