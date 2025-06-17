import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClients } from '../contexts/ClientContext';
import { useAuth } from '../contexts/AuthContext';
import ClientCard from '../components/Dashboard/ClientCard';
import ClientCardSkeleton from '../components/Dashboard/ClientCardSkeleton';
import ImportedClientCard from '../components/Dashboard/ImportedClientCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from '../components/ui/use-toast';
import { Plus, Users, Upload } from 'lucide-react';
import UploadPortfolioDialog from '../components/Upload/UploadPortfolioDialog';

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  accessType: z.enum(['FULL', 'LIMITED']),
  riskProfile: z.enum(['Conservative', 'Moderate', 'Aggressive']),
  panNumber: z.string().optional()
    .refine((val) => {
      if (!val) return true;
      return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(val);
    }, "Invalid PAN number format"),
});

export default function ClientsPage() {
  const navigate = useNavigate();
  const { clients, loading, addClient, deleteClient } = useClients();
  const { user } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteDialogClient, setDeleteDialogClient] = useState(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      accessType: "LIMITED",
      riskProfile: "Moderate",
      panNumber: ""
    }
  });

  const onSubmit = async (values) => {
    try {
      await addClient(values);
      toast({
        title: "Success",
        description: "Client added successfully",
      });
      form.reset();
      setIsAddDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to add client",
        variant: "destructive",
      });
    }
  };

  const handleAction = async (action, client) => {
    // If client is imported (has portfolioData), only allow overview and delete
    if (client.portfolioData) {
      if (action === 'delete') {
        setDeleteDialogClient(client);
      }
      // Ignore other actions for imported clients
      return;
    }

    // For regular clients, allow all actions
    switch (action) {
      case 'dashboard':
        navigate(`/clients/${client._id}/dashboard`);
        break;
      case 'report':
        navigate(`/clients/${client._id}/report`);
        break;
      case 'delete':
        setDeleteDialogClient(client);
        break;
    }
  };

  const handleDelete = async () => {
    try {
      await deleteClient(deleteDialogClient._id);
      toast({
        title: "Success",
        description: "Client deleted successfully",
      });
      setDeleteDialogClient(null);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete client",
        variant: "destructive",
      });
    }
  };

  const watchAccessType = form.watch("accessType");

  const renderClientCard = (client) => {
    // If client was imported via PDF (has portfolioData), use ImportedClientCard
    if (client.portfolioData) {
      return (
        <ImportedClientCard
          key={client._id}
          client={client}
          onAction={handleAction}
        />
      );
    }
    // Otherwise use regular ClientCard
    return (
      <ClientCard
        key={client._id}
        client={client}
        onAction={handleAction}
      />
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Clients</h1>
          <p className="text-gray-600">Manage your client portfolios</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setIsUploadDialogOpen(true)} variant="outline" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Import from PDF
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Client
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <ClientCardSkeleton key={i} />
          ))}
        </div>
      ) : clients.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No clients yet</h3>
          <p className="text-gray-600 mb-4">
            Get started by adding your first client
          </p>
          <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Client
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {clients.map(client => renderClientCard(client))}
        </div>
      )}

      {/* Add Client Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>
              Enter client details to create a new portfolio
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter client name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter client email" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="accessType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Access Type</FormLabel>
                    <Select defaultValue={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select access type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="FULL">Full Access (MF Central)</SelectItem>
                        <SelectItem value="LIMITED">Limited Access (PDF Upload)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="riskProfile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Risk Profile</FormLabel>
                    <Select defaultValue={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select risk profile" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Conservative">Conservative</SelectItem>
                        <SelectItem value="Moderate">Moderate</SelectItem>
                        <SelectItem value="Aggressive">Aggressive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {watchAccessType === "FULL" && (
                <FormField
                  control={form.control}
                  name="panNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PAN Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter PAN number"
                          {...field}
                          value={field.value ?? ""}
                          className="uppercase"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <DialogFooter>
                <Button type="submit">Add Client</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteDialogClient} onOpenChange={() => setDeleteDialogClient(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Client</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {deleteDialogClient?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogClient(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Portfolio Dialog */}
      <UploadPortfolioDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
      />
    </div>
  );
}
