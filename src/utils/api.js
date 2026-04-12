import axios from "axios"

const base_url = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

export const fetchDataFromApi = async (url, params, id = '') => {
    try {
        const { data } = await axios.get(base_url + url, {
            params,
            withCredentials: true
        });
        return data;
    } catch (error) {
        throw error;
    }
}

export const sendDataToapi = async (url, body, header, params) => {
    try {
        const result = await axios.post(base_url + url, body, {
            headers: {
                'Content-Type': header || 'application/json',
            },
            params,
            withCredentials: true,
        });
        return result.data;
    } catch (error) {
        throw error;
    }
}

export const updateDatatoapi = async (url, body, header) => {
    try {
        const result = await axios.patch(base_url + url, body, {
            headers: {
                'Content-Type': header || 'application/json',
            },
            withCredentials: true,
        });
        return result.data;
    } catch (error) {
        throw error;
    }
}

export const deleteDataFromApi = async (url) => {
    try {
        const result = await axios.delete(base_url + url, {
            withCredentials: true,
        });
        return result;
    } catch (err) {
        throw err;
    }
}