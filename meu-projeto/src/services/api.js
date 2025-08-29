import axios from 'axios';

// Cria uma instância do Axios com a URL base da API
const api = axios.create({
    baseURL: 'http://localhost:3000', // Certifique-se de que a porta está correta
});

// Interceptador de requisições: adiciona o token de autenticação em todas as chamadas
api.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;