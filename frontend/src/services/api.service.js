import apiConfig, { getAuthHeader } from '../config/api';

class ApiService {
    static async request(endpoint, options = {}) {
        const url = `${apiConfig.baseURL}${endpoint}`;
        const token = localStorage.getItem('token');
        
        const headers = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        };

        try {
            console.log('Making request to:', url, 'with options:', { 
                ...options, 
                headers: { ...headers, Authorization: token ? 'Bearer [REDACTED]' : undefined } 
            });
            
            const response = await fetch(url, {
                ...options,
                headers
            });

            let data;
            try {
                data = await response.json();
            } catch {
                data = { success: false, message: 'Invalid response from server' };
            }

            console.log('Response:', data);

            if (!response.ok) {
                // Handle authentication errors
                if (response.status === 401) {
                    // Clear invalid token
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    // Redirect to login
                    window.location.href = '/auth/login';
                }
                throw new Error(data.message || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API request error:', error);
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

    // Client endpoints
    static async createClient(clientData) {
        return this.request(apiConfig.endpoints.clients, {
            method: 'POST',
            body: JSON.stringify(clientData)
        });
    }

    static async getClients() {
        return this.request(apiConfig.endpoints.clients);
    }

    static async deleteClient(clientId) {
        return this.request(`${apiConfig.endpoints.clients}/${clientId}`, {
            method: 'DELETE'
        });
    }
}

export default ApiService;
