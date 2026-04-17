import axios from 'axios';

export const fetchWikiDescription = async (query) => {
    const res = await axios.get(`https://en.wikipedia.org/w/api.php`, {
        params: {
            action: 'query',
            prop: 'extracts',
            exintro: true,
            explaintext: true,
            titles: query,
            format: 'json',
            origin: '*'
        }
    });

    // Wikipedia returns an object with pages, the key is the page ID
    const pages = res.data.query.pages;
    const page = Object.values(pages)[0]; // get the first (only) result

    if (page.missing !== undefined) throw new Error('No description found');

    return page.extract; // this is the text description
};