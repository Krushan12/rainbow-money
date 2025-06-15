const API_BASE_URL = import.meta.env.MODE === 'production'
    ? 'https://rainbow-money.onrender.com/api'
    : 'http://localhost:5000/api';

const apiConfig = {
    baseURL: API_BASE_URL,
    endpoints: {
        // Auth endpoints
        register: '/auth/register',
        login: '/auth/login',
        profile: '/auth/profile',
        
        // Client endpoints
        clients: '/clients',
        clientDetail: (id) => `/clients/${id}`,
        
        // Portfolio endpoints
        portfolios: '/portfolios',
        portfolioDetail: (id) => `/portfolios/${id}`,
        portfolioTransactions: (id) => `/portfolios/${id}/transactions`,
        portfolioAnalysis: (id) => `/portfolios/${id}/analysis`,
        
        // Analysis endpoints
        fundOverlap: '/analysis/fund-overlap',
        liquidity: (portfolioId) => `/analysis/liquidity/${portfolioId}`,
        rebalancing: (portfolioId) => `/analysis/rebalancing/${portfolioId}`,
        riskReturn: (portfolioId) => `/analysis/risk-return/${portfolioId}`
    }
};

export const getAuthHeader = () => {
    try {
        const token = localStorage.getItem('token');
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    } catch (error) {
        console.error('Error getting auth header:', error);
        return {};
    }
};

export default apiConfig;
