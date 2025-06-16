import { createContext, useContext, useState } from 'react';
import ApiService from '../services/api.service';
import { dummyPortfolioData } from '../data/dummyPortfolioData';
import { useToast } from '../components/ui/use-toast';

const PortfolioContext = createContext(undefined);

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}

export function PortfolioProvider({ children }) {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchPortfolioData = async () => {
    try {
      setLoading(true);
      
      // Use dummy data for now since MF Central API is not available
      // In production, this would be:
      // const response = await ApiService.getClientPortfolioData();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use dummy data
      setPortfolioData(dummyPortfolioData);
      return { success: true, data: dummyPortfolioData };
      
      // Production code would be:
      // if (response.success) {
      //   setPortfolioData(response.data);
      // }
    } catch (error) {
      console.error('Failed to fetch portfolio data:', error);
      toast({
        title: "Error",
        description: "Failed to load portfolio data. Using sample data instead.",
        variant: "warning",
      });
      // Fallback to dummy data in case of error
      setPortfolioData(dummyPortfolioData);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    portfolioData,
    loading,
    fetchPortfolioData,
  };

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}
