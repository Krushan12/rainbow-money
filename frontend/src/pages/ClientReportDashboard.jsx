import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useClients } from '../contexts/ClientContext';
import { usePortfolio } from '../contexts/PortfolioContext';
import { Card } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import AssetAllocationPie from '../components/Charts/AssetAllocationPie';
import  FundOverlapBar  from '../components/Charts/FundOverlapBar';
import  MarketCapPie  from '../components/Charts/MarketCapPie';
import  RiskReturnScatter  from '../components/Charts/RiskReturnScatter';
import SectorBarChart  from '../components/Charts/SectorBarChart';
import  NetInvestmentLine  from '../components/Charts/NetInvestmentLine';
import  FundXirrBar  from '../components/Charts/FundXirrBar';
import  LiquidityPie  from '../components/Charts/LiquidityPie';
import  PerformanceVsCI  from '../components/ComparativeAnalysis/PerformanceVsCI';
import  RedZoneFunds  from '../components/ComparativeAnalysis/RedZoneFunds';
import  TopHoldings  from '../components/EquityAnalysis/TopHoldings';
import  DomesticGlobalSplit  from '../components/EquityAnalysis/DomesticGlobalSplit';
import  FundRanking  from '../components/FundPerformance/FundRanking';
import  TopBottomFunds  from '../components/FundPerformance/TopBottomFunds';

export default function ClientReportDashboard() {
  const { clientId } = useParams();
  const { clients, selectedClient, setSelectedClient } = useClients();
  const { portfolioData, loading, fetchPortfolioData } = usePortfolio();
  const [activeTab, setActiveTab] = useState('summary');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setError(null);
        const client = clients?.find(c => c._id === clientId);
        
        if (!client || !clientId) {
          setError("Please select a valid client to view their report.");
          return;
        }

        if (isInitialLoad) {
          setSelectedClient(client);
          await fetchPortfolioData();
          setIsInitialLoad(false);
        }
      } catch (err) {
        setError("There was an error loading the report data. Please try again.");
        console.error("Report data loading error:", err);
      }
    };

    loadData();
  }, [clientId, clients, setSelectedClient, fetchPortfolioData, isInitialLoad]);

  const displayData = portfolioData;

  // Show error state if there's an error
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Unable to Load Report</h2>
        <p className="text-gray-600 text-center mb-4">{error}</p>
      </div>
    );
  }

  // Show loading state
  if (!selectedClient || loading) {
    return (
      <div className="space-y-4 p-6">
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-gray-200 rounded"></div>
          <div className="h-4 w-48 bg-gray-200 rounded mt-2"></div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-4">
              <div className="animate-pulse space-y-3">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-48 bg-gray-200 rounded"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">{selectedClient.name}'s Portfolio Report</h1>
        <p className="text-muted-foreground mt-2">Comprehensive analysis and insights</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="funds">Fund Analysis</TabsTrigger>
          <TabsTrigger value="equity">Equity Analysis</TabsTrigger>
          <TabsTrigger value="risk">Risk & Returns</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">            <AssetAllocationPie data={displayData.allocation} />
            <LiquidityPie data={displayData.liquidity} />
            <MarketCapPie data={displayData.market_cap} />
            <NetInvestmentLine data={displayData.net_investment} />
          </div>
        </TabsContent>

        <TabsContent value="funds" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">            <FundXirrBar data={displayData.fund_performance} />
            <FundOverlapBar data={displayData.overlap} />
            <TopBottomFunds
              topPerformers={displayData.top_performers}
              bottomPerformers={displayData.bottom_performers}
            />
            <FundRanking data={displayData.fund_rankings} />
          </div>
        </TabsContent>

        <TabsContent value="equity" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">            <SectorBarChart data={displayData.sector_allocation} />
            <TopHoldings data={displayData.top_holdings} />
            <DomesticGlobalSplit data={displayData.domestic_global} />
          </div>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">            <RiskReturnScatter data={displayData.risk_return} />
            <PerformanceVsCI data={displayData.comparative_performance} />
            <RedZoneFunds data={displayData.red_zone_funds} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
