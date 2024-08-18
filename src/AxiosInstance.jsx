import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3010/api/v1/',
    timeout: 10000, // Timeout after 10 seconds
    withCredentials: true, // Include cookies in requests by default
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Common Axios Handler Function
 * @param {String} method - HTTP method (GET, POST, PUT, DELETE, etc.)
 * @param {String} url - API endpoint URL
 * @param {Object} [data] - Request body data (optional)
 * @param {Object} [config] - Additional Axios config (optional)
 * @returns {Promise<Object>} - Returns the response data or error message
 */
const axiosHandler = async (method, url, data = {}, config = {}) => {
    try {
        const response = await axiosInstance({
            method,
            url,
            data,
            ...config,
        });
        return response.data;
    } catch (error) {
        console.log("ss" + error);
        console.error('Axios Error:', error.response ? error.response.data : error.message);
        // You can return a custom error object or message here
        return {
            success: false,
            message: error.response ? error.response.data.message : error.message,
        };
    }
};

export default axiosHandler;