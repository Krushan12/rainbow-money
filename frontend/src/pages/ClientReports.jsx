import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useClients } from '../contexts/ClientContext';
import { Card } from '../components/ui/card';

export default function ClientReports() {
  const { clientId } = useParams();
  const { clients, selectedClient, setSelectedClient } = useClients();

  useEffect(() => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setSelectedClient(client);
    }
  }, [clientId, clients, setSelectedClient]);

  if (!selectedClient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{selectedClient.name}'s Reports</h1>
        <p className="text-muted-foreground">View detailed portfolio analysis and reports</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Portfolio Analysis</h3>
          {/* Add portfolio analysis content */}
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-2">Risk Assessment</h3>
          {/* Add risk assessment content */}
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-2">Performance Report</h3>
          {/* Add performance report content */}
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-2">Investment Summary</h3>
          {/* Add investment summary content */}
        </Card>
      </div>
    </div>
  );
}
