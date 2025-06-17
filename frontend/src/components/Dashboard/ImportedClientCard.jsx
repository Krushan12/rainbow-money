import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { BarChart2, FileText } from 'lucide-react';
import { format } from 'date-fns';

export default function ImportedClientCard({ client, onAction }) {
  const getLastUpdateText = () => {
    if (!client.lastPortfolioUpdate) return 'Recently imported';
    return `Last updated: ${format(new Date(client.lastPortfolioUpdate), 'dd MMM yyyy')}`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate total portfolio value
  const totalValue = client.portfolioData?.summary?.current_value || 0;
  const totalInvestment = client.portfolioData?.summary?.total_investment || 0;

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="space-y-4">
        {/* Client Info */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{client.name}</h3>
            <p className="text-sm text-muted-foreground">{client.email}</p>
            <p className="text-xs text-muted-foreground mt-1">{getLastUpdateText()}</p>
          </div>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-2 gap-4 py-2">
          <div>
            <p className="text-sm text-muted-foreground">Current Value</p>
            <p className="text-lg font-semibold">{formatCurrency(totalValue)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Investment</p>
            <p className="text-lg font-semibold">{formatCurrency(totalInvestment)}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2 justify-between">
          <Button
            variant="ghost"
            className="text-red-600 hover:text-red-700"
            onClick={() => onAction('delete', client)}
          >
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
}
