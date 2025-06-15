import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClients } from '../contexts/ClientContext';
import { useAuth } from '../contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form";
import { Input } from "../components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  User, 
  BarChart2, 
  FileText, 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  Mail,
  Calendar,
  UserPlus,
  Trash2 
} from 'lucide-react';
import { Card } from '../components/ui/card';
import PortfolioUpload from '../components/Upload/PortfolioUpload';
import { useToast } from '../components/ui/use-toast';

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
});

export default function ClientsPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { clients, addClient, removeClient } = useClients();
  const { isAuthenticated } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadClientId, setUploadClientId] = useState(null);
  const [deleteDialogClient, setDeleteDialogClient] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (values) => {
    addClient(values);
    form.reset();
    setIsAddDialogOpen(false);
  };

  const handleClientClick = (clientId) => {
    setSelectedClientId(clientId === selectedClientId ? null : clientId);
  };

  const handleUploadClick = (clientId, e) => {
    e.stopPropagation();
    setUploadClientId(clientId);
    setIsUploadDialogOpen(true);
  };

  const handleUploadComplete = () => {
    setIsUploadDialogOpen(false);
    setUploadClientId(null);
  };

  const handleDeleteClick = (client, e) => {
    e.stopPropagation();
    setDeleteDialogClient(client);
  };

  const confirmDelete = async () => {
    try {
      await removeClient(deleteDialogClient.id);
      toast({
        title: 'Client Deleted',
        description: 'The client has been successfully removed.',
      });
      setDeleteDialogClient(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete client',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-lg shadow-sm">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground mt-1">Manage your clients and their portfolio data</p>
        </div>
        <Button 
          size="lg"
          onClick={() => setIsAddDialogOpen(true)} 
          className="md:w-auto w-full flex items-center gap-2 bg-primary hover:bg-primary/90 text-white"
        >
          <UserPlus className="h-5 w-5" />
          Add New Client
        </Button>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <Card
            key={client.id}
            className={`overflow-hidden transition-all duration-200 ${
              selectedClientId === client.id ? 'ring-2 ring-primary' : ''
            }`}
          >
            {/* Client Header */}
            <div
              onClick={() => handleClientClick(client.id)}
              className="p-6 cursor-pointer hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <ChevronDown className={`h-4 w-4 text-white transition-transform ${
                        selectedClientId === client.id ? 'rotate-180' : ''
                      }`} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg leading-none">{client.name}</h3>
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {client.email}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Added on {new Date().toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Panel */}
            <AnimatePresence>
              {selectedClientId === client.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-t"
                >
                  <div className="grid grid-cols-4 divide-x">
                    <button
                      onClick={(e) => handleUploadClick(client.id, e)}
                      className="p-4 flex flex-col items-center gap-2 text-sm font-medium hover:bg-accent/50 transition-colors"
                    >
                      <Upload className="h-5 w-5 text-primary" />
                      Upload PDF
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/clients/${client.id}/dashboard`);
                      }}
                      className="p-4 flex flex-col items-center gap-2 text-sm font-medium hover:bg-accent/50 transition-colors"
                    >
                      <BarChart2 className="h-5 w-5 text-primary" />
                      Dashboard
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/clients/${client.id}/reports`);
                      }}
                      className="p-4 flex flex-col items-center gap-2 text-sm font-medium hover:bg-accent/50 transition-colors"
                    >
                      <FileText className="h-5 w-5 text-primary" />
                      Reports
                    </button>
                    <button
                      onClick={(e) => handleDeleteClick(client, e)}
                      className="p-4 flex flex-col items-center gap-2 text-sm font-medium hover:bg-accent/50 transition-colors text-destructive hover:text-destructive/90"
                    >
                      <Trash2 className="h-5 w-5" />
                      Delete
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        ))}

        {/* Add Client Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsAddDialogOpen(true)}
          className="rounded-lg border-2 border-dashed p-6 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary/50 hover:bg-accent/50 transition-colors"
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <UserPlus className="h-6 w-6 text-primary" />
          </div>
          <div className="text-center">
            <h3 className="font-semibold">Add New Client</h3>
            <p className="text-sm text-muted-foreground mt-1">Create a new client profile</p>
          </div>
        </motion.div>
      </div>

      {/* Add Client Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>
              Add a new client to manage their portfolio data.
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
                      <Input placeholder="Client name" {...field} />
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
                      <Input placeholder="client@example.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit">Add Client</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Portfolio Upload Dialog */}
      <PortfolioUpload
        isOpen={isUploadDialogOpen}
        onClose={handleUploadComplete}
        clientId={uploadClientId}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteDialogClient} onOpenChange={() => setDeleteDialogClient(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Client</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {deleteDialogClient?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogClient(null)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
