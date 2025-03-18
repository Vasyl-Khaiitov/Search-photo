import axios from "axios";

const API_KEY = (axios.defaults.API_KEY = '49359087-343ead2b9467da8fb57304bcb');
const BASE_URL = (axios.defaults.baseURL = 'https://pixabay.com/api/');




export async function requestServer(query) {
    let page = 1;
    let per_page = 15;

    const options = {
        params: {
            key: API_KEY,
            q: query.trim(),
            image_type: 'photo',
            orientation: 'horizontal',
            page: page,
            per_page: per_page,
            safesearch: 'true',
        },
    };

    const response = await axios.get(BASE_URL, options);
    return response.data.hits;
}


