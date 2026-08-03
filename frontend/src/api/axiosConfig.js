import axios from 'axios';

// Create the centralized Axios instance
const api = axios.create({
    baseURL: '/api' // This aligns with our Vite Proxy to Port 8080
});

/**
 * 1. REQUEST INTERCEPTOR
 * This "Robot" runs before every outgoing request.
 * It automatically snatches the RSA JWT from storage and
 * attaches it as a Bearer token.
 */
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * 2. RESPONSE INTERCEPTOR
 * This "Robot" runs after every incoming message from the server.
 * It watches for 401 (Expired) or 403 (Forbidden) errors.
 */
api.interceptors.response.use(
    (response) => {
        // If the request was successful (200 OK), just pass the data through
        return response;
    },
    (error) => {
        // Check if the RSA server rejected us due to expiration or missing roles
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.warn("RSA Security Failure: Token expired or permissions denied. Cleaning session...");

            // A. Wipe the stale token from storage so we don't try to use it again
            localStorage.removeItem('token');

            // B. Hard redirect to the Home page with a flag in the URL
            // This 'expired' flag will be used to show a UI warning to the student
            window.location.href = '/?expired=true';
        }

        // Pass the error along so components can still handle specific logic if needed
        return Promise.reject(error);
    }
);

export default api;