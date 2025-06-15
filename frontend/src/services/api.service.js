import apiConfig, { getAuthHeader } from '../config/api';

class ApiService {
    static async request(endpoint, options = {}) {
        const url = `${apiConfig.baseURL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
            ...options.headers
        };

        try {
            console.log('Making request to:', url, 'with options:', { ...options, headers });
            
            const response = await fetch(url, {
                ...options,
                headers
            });

            // Check if the response has content
            const contentType = response.headers.get('content-type');
            let data;
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                data = await response.text();
                try {
                    // Try to parse it as JSON anyway
                    data = JSON.parse(data);
                } catch (e) {
                    // If it's not JSON, create an error object
                    data = { success: false, message: data || 'No response from server' };
                }
            }

            console.log('Response:', data);

            if (!response.ok) {
                throw new Error(data.message || data.error || 'API request failed');
            }

            return data;
        } catch (error) {
            console.error('API request error:', error);
            if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
                throw new Error('Unable to connect to the server. Please check if the backend is running.');
            }
            throw error;
        }
    }

    // Auth endpoints
    static async register(userData) {
        return this.request(apiConfig.endpoints.register, {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    static async login(credentials) {
        return this.request(apiConfig.endpoints.login, {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    }

    static async getProfile() {
        return this.request(apiConfig.endpoints.profile);
    }

    // Portfolio endpoints
    static async uploadPortfolio(clientId, formData) {
        // Don't include Content-Type header, it will be set automatically for FormData
        return this.request(`/clients/${clientId}/upload`, {
            method: 'POST',
            body: formData,
            headers: {} // Override the default Content-Type
        });
    }
}

export default ApiService;
