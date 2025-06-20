import { createContext, useContext, useState, useEffect } from 'react';
import ApiService from '../services/api.service';
import { useToast } from '../components/ui/use-toast';
import { useAuth } from './AuthContext';

const ClientContext = createContext(undefined);

export function useClients() {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error('useClients must be used within a ClientProvider');
  }
  return context;
}

export function ClientProvider({ children }) {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch clients only when user is authenticated
  useEffect(() => {
    if (user) {
      fetchClients();
    }
  }, [user]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getClients();
      if (response.success) {
        setClients(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch clients:', error);
      if (error.message !== 'Not authorized, no token') {
        toast({
          title: "Error",
          description: "Failed to load clients",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const addClient = async (newClient) => {
    try {
      setLoading(true);
      // If client has portfolioData, it's from PDF upload
      const isImported = !!newClient.portfolioData;
      const response = await ApiService.createClient({
        ...newClient,
        source: isImported ? 'PDF_IMPORT' : 'MANUAL',
      });
      
      if (response.success && response.data) {
        setClients(prev => [...prev, response.data]);
        toast({
          title: "Success",
          description: isImported ? "Client imported successfully" : "Client added successfully",
          variant: "default",
        });
        return response.data;
      }
      throw new Error(response.message || 'Failed to add client');
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to add client",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteClient = async (clientId) => {
    try {
      setLoading(true);
      const response = await ApiService.deleteClient(clientId);
      if (response.success) {
        setClients(prev => prev.filter(client => client._id !== clientId));
        if (selectedClient?._id === clientId) {
          setSelectedClient(null);
        }
        toast({
          title: "Success",
          description: "Client deleted successfully",
        });
      }
    } catch (error) {
      console.error('Failed to delete client:', error);
      toast({
        title: "Error",
        description: "Failed to delete client",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateClientPortfolio = async (clientId, portfolioData) => {
    setClients(prev => prev.map(client => {
      if (client._id === clientId) {
        return {
          ...client,
          portfolioData,
          lastUpdated: new Date().toISOString()
        };
      }
      return client;
    }));
  };
  const value = {
    clients,
    selectedClient,
    loading,
    setSelectedClient,
    addClient,
    deleteClient,
    updateClientPortfolio
  };

  return (
    <ClientContext.Provider value={value}>
      {children}
    </ClientContext.Provider>
  );
}
