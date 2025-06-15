import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useToast } from '../components/ui/use-toast';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      portfolio: true,
      sipReminders: true,
      marketAlerts: false
    },
    display: {
      currency: 'INR',
      theme: 'light',
      dateFormat: 'DD/MM/YYYY'
    },
    preferences: {
      defaultView: 'overview',
      rebalanceInterval: 'quarterly'
    }
  });

  const handleNotificationChange = (key) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
  };

  const handleSelectChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };
  return (
    <div className="space-y-6 p-4 md:p-0 md:space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your preferences and account settings
          </p>
        </div>
        <Button 
          onClick={handleSave}
          className="w-full md:w-auto hover:scale-105 transition-transform cursor-pointer"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(settings.notifications).map(([key, value]) => (
                <div key={key} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                  <Label htmlFor={key} className="font-medium capitalize cursor-pointer">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </Label>
                  <Switch
                    id={key}
                    checked={value}
                    onCheckedChange={() => handleNotificationChange(key)}
                    className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-200"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Display Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Display</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                <Label htmlFor="currency" className="font-medium cursor-pointer">Currency</Label>
                <Select 
                  value={settings.display.currency}
                  onValueChange={(value) => handleSelectChange('display', 'currency', value)}
                >
                  <SelectTrigger className="w-full md:w-[140px] hover:bg-accent transition-colors cursor-pointer">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent className="min-w-[140px]">
                    <SelectItem value="INR" className="cursor-pointer hover:bg-accent">INR</SelectItem>
                    <SelectItem value="USD" className="cursor-pointer hover:bg-accent">USD</SelectItem>
                    <SelectItem value="EUR" className="cursor-pointer hover:bg-accent">EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                <Label htmlFor="theme" className="font-medium cursor-pointer">Theme</Label>
                <Select
                  value={settings.display.theme}
                  onValueChange={(value) => handleSelectChange('display', 'theme', value)}
                >
                  <SelectTrigger className="w-full md:w-[140px] hover:bg-accent transition-colors cursor-pointer">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light" className="cursor-pointer hover:bg-accent">Light</SelectItem>
                    <SelectItem value="dark" className="cursor-pointer hover:bg-accent">Dark</SelectItem>
                    <SelectItem value="system" className="cursor-pointer hover:bg-accent">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                <Label htmlFor="dateFormat" className="font-medium cursor-pointer">Date Format</Label>
                <Select
                  value={settings.display.dateFormat}
                  onValueChange={(value) => handleSelectChange('display', 'dateFormat', value)}
                >
                  <SelectTrigger className="w-full md:w-[140px] hover:bg-accent transition-colors cursor-pointer">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DD/MM/YYYY" className="cursor-pointer hover:bg-accent">DD/MM/YYYY</SelectItem>
                    <SelectItem value="MM/DD/YYYY" className="cursor-pointer hover:bg-accent">MM/DD/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD" className="cursor-pointer hover:bg-accent">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>        {/* Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                <Label htmlFor="defaultView" className="font-medium cursor-pointer">Default View</Label>
                <Select
                  value={settings.preferences.defaultView}
                  onValueChange={(value) => handleSelectChange('preferences', 'defaultView', value)}
                >
                  <SelectTrigger className="w-full md:w-[140px] hover:bg-accent transition-colors cursor-pointer">
                    <SelectValue placeholder="Select view" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="overview" className="cursor-pointer hover:bg-accent">Overview</SelectItem>
                    <SelectItem value="reports" className="cursor-pointer hover:bg-accent">Reports</SelectItem>
                    <SelectItem value="clients" className="cursor-pointer hover:bg-accent">Clients</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                <Label htmlFor="rebalanceInterval" className="font-medium cursor-pointer">Rebalance Interval</Label>
                <Select
                  value={settings.preferences.rebalanceInterval}
                  onValueChange={(value) => handleSelectChange('preferences', 'rebalanceInterval', value)}
                >
                  <SelectTrigger className="w-full md:w-[140px] hover:bg-accent transition-colors cursor-pointer">
                    <SelectValue placeholder="Select interval" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly" className="cursor-pointer hover:bg-accent">Monthly</SelectItem>
                    <SelectItem value="quarterly" className="cursor-pointer hover:bg-accent">Quarterly</SelectItem>
                    <SelectItem value="biannual" className="cursor-pointer hover:bg-accent">Bi-Annual</SelectItem>
                    <SelectItem value="annual" className="cursor-pointer hover:bg-accent">Annual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
