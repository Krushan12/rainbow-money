import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Upload, 
  BarChart2, 
  FileText, 
  Trash2,
  User,
  Calendar,
  Check,
  AlertCircle,
  Link
} from 'lucide-react';
import { format } from 'date-fns';

export default function ClientCard({ client, onAction }) {
  const getAccessTypeColor = (type) => {
    return type === 'FULL' ? 'text-green-600' : 'text-orange-600';
  };

  const getLastUpdateText = () => {
    if (!client.lastPortfolioUpdate) return 'No portfolio yet';
    return `Last updated: ${format(new Date(client.lastPortfolioUpdate), 'dd MMM yyyy')}`;
  };

  const getIntegrationStatus = () => {
    if (client.accessType === 'LIMITED') {
      return {
        badge: 'PDF Upload',
        variant: 'info',
        icon: FileText
      };
    }
    if (client.mfCentralAuthorized) {
      return {
        badge: 'MF Central',
        variant: 'success',
        icon: Check
      };
    }
    return {
      badge: 'Pending Integration',
      variant: 'warning',
      icon: AlertCircle
    };
  };

  const status = getIntegrationStatus();

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-full">
            <User className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <h3 className="font-medium text-lg">{client.name}</h3>
            <p className="text-sm text-gray-500">{client.email}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`text-xs font-medium ${getAccessTypeColor(client.accessType)}`}>
            {client.accessType}
          </span>
          <Badge variant={status.variant} className="flex items-center gap-1">
            <status.icon className="w-3 h-3" />
            {status.badge}
          </Badge>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          {getLastUpdateText()}
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm">
            Risk Profile: <span className="font-medium">{client.riskProfile}</span>
          </div>
          {client.panNumber && (
            <div className="text-sm text-gray-500">
              • PAN: <span className="font-mono">{client.panNumber}</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => onAction('upload', client)}
        >
          <Upload className="w-4 h-4" />
          {client.accessType === 'FULL' ? 'Link MF Central' : 'Upload PDF'}
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => onAction('dashboard', client)}
        >
          <BarChart2 className="w-4 h-4" />
          Dashboard
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => onAction('report', client)}
        >
          <FileText className="w-4 h-4" />
          Report
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-2 text-destructive hover:text-destructive-foreground hover:bg-destructive"
          onClick={() => onAction('delete', client)}
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </Button>
      </div>
    </Card>
  );
}
