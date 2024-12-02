import axios from 'axios';

const BASE_URL = 'https://http2mysqlfunc1ccb1.azurewebsites.net/api';

// Define all API calls
const api = {
    addExpense: async (expense) => {
        return axios.post(`${BASE_URL}/AddExpense?code=GCjkQT17aiCGs0YErmQZKfxcXQB1MYLZwRO_ozkraMfIAzFur53-yA==`, expense);
    },

    deleteExpense: async (id) => {
        return axios.delete(`${BASE_URL}/DeleteExpense?code=t_qQtPadNiSiJF0JiGl1vj6svynln2GqZF0FQZcrKe2dAzFuarmKWg%3D%3D`, {
            params: { id },
        });
    },

    getAllExpenses: async () => {
        return axios.get(`${BASE_URL}/GetAllExpenses?code=GCjkQT17aiCGs0YErmQZKfxcXQB1MYLZwRO_ozkraMfIAzFur53-yA==`);
    },

    getExpense: async (id) => {
        return axios.get(`${BASE_URL}/GetExpense?code=GCjkQT17aiCGs0YErmQZKfxcXQB1MYLZwRO_ozkraMfIAzFur53-yA==`, {
            params: { id },
        });
    },

    updateExpense: async (id, updatedExpense) => {
        return axios.put(`${BASE_URL}/UpdateExpense?code=GCjkQT17aiCGs0YErmQZKfxcXQB1MYLZwRO_ozkraMfIAzFur53-yA==`, {
            id,
            ...updatedExpense,
        });
    },
};

export default api;
