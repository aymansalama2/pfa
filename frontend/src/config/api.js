import axios from 'axios';

// Supprimer la configuration Axios
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    // Supprimer withCredentials
});

export default api; 