import axios from 'axios';

const API_KEY = (axios.defaults.API_KEY = '49359087-343ead2b9467da8fb57304bcb');
const BASE_URL = (axios.defaults.baseURL = 'https://pixabay.com/api/');

export async function requestServer(query, currentPage) {
  const options = {
    params: {
      key: API_KEY,
      q: query.trim(),
      image_type: 'photo',
      orientation: 'horizontal',
      page: currentPage,
      per_page: 15,
      safesearch: 'true',
    },
  };

  const response = await axios.get(BASE_URL, options);
  const { hits, totalHits } = response.data;

  return { hits, totalHits };
}
