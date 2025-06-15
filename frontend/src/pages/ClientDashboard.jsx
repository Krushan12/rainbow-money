import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useClients } from '../contexts/ClientContext';
import { Card } from '../components/ui/card';

export default function ClientDashboard() {
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
        <h1 className="text-2xl font-bold">{selectedClient.name}'s Dashboard</h1>
        <p className="text-muted-foreground">View and manage portfolio performance</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Portfolio Summary</h3>
          {/* Add portfolio summary content */}
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-2">Recent Activity</h3>
          {/* Add recent activity content */}
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-2">Performance Metrics</h3>
          {/* Add performance metrics content */}
        </Card>
      </div>
    </div>
  );
}
