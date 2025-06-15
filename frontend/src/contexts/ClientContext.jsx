import { createContext, useContext, useState } from 'react';

const ClientContext = createContext(undefined);

// Mock data for initial clients
const initialClients = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    portfolioData: null,
    lastUpdated: null
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    portfolioData: null,
    lastUpdated: null
  }
];

export function useClients() {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error('useClients must be used within a ClientProvider');
  }
  return context;
}

export function ClientProvider({ children }) {
  const [clients, setClients] = useState(initialClients);
  const [selectedClient, setSelectedClient] = useState(null);

  const addClient = (newClient) => {
    setClients(prev => [...prev, { 
      ...newClient, 
      id: String(prev.length + 1),
      portfolioData: null,
      lastUpdated: null
    }]);
  };

  const updateClientPortfolio = (clientId, portfolioData) => {
    setClients(prev => prev.map(client => {
      if (client.id === clientId) {
        return {
          ...client,
          portfolioData,
          lastUpdated: new Date().toISOString()
        };
      }
      return client;
    }));
  };

  const deleteClient = (clientId) => {
    setClients(prev => prev.filter(client => client.id !== clientId));
    if (selectedClient?.id === clientId) {
      setSelectedClient(null);
    }
  };

  const value = {
    clients,
    selectedClient,
    setSelectedClient,
    addClient,
    updateClientPortfolio,
    deleteClient
  };

  return <ClientContext.Provider value={value}>{children}</ClientContext.Provider>;
}
