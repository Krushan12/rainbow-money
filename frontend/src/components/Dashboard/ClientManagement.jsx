import { useState } from 'react';
import { useClients } from '../../contexts/ClientContext';
import { useToast } from '../ui/toast-provider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { UserIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
});

export default function ClientManagement() {
  const { clients, selectedClient, setSelectedClient, addClient, deleteClient } = useClients();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const toast = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const onSubmit = async (values) => {
    addClient(values);
    form.reset();
    setIsAddDialogOpen(false);
    toast({
      title: "Success",
      description: "Client added successfully",
      variant: "success",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Clients</h2>
        <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-2">
          <PlusIcon className="w-4 h-4" />
          Add Client
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {clients.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="col-span-full text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300"
            >
              <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No clients yet</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding your first client.</p>
              <div className="mt-6">
                <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-2">
                  <PlusIcon className="w-4 h-4" />
                  Add Your First Client
                </Button>
              </div>
            </motion.div>
          ) : (
            clients.map((client) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                  selectedClient?.id === client.id
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-primary/50'
                }`}
                onClick={() => setSelectedClient(client)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <UserIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium">{client.name}</h3>
                      <p className="text-sm text-muted-foreground">{client.email}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteClient(client.id);
                    }}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>
              Enter client details to create a new profile.
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

              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Adding..." : "Add Client"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
