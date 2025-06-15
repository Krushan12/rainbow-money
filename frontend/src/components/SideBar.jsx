import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useClients } from '../contexts/ClientContext';
import { Button } from './ui/button';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import {
  Home,
  BarChart2,
  Settings,
  LogOut,
  Menu,
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ onCollapse }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { selectedClient } = useClients();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const toggleSidebar = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    onCollapse?.(newState);
  };

  // Get current client ID from URL if it exists
  const getClientIdFromPath = () => {
    const match = location.pathname.match(/\/clients\/([^/]+)/);
    return match ? match[1] : null;
  };

  const navItems = [
    { to: "/dashboard", icon: <Home className="h-5 w-5" />, label: "Dashboard" },
    { to: "/clients", icon: <User className="h-5 w-5" />, label: "Clients" },
    { to: "/reports", icon: <BarChart2 className="h-5 w-5" />, label: "Reports" },
    { to: "/settings", icon: <Settings className="h-5 w-5" />, label: "Settings" },
  ];

  const getNavPath = (basePath) => {
    const clientId = getClientIdFromPath();
    if (clientId && (basePath === '/dashboard' || basePath === '/reports')) {
      return `/clients/${clientId}${basePath}`;
    }
    return basePath;
  };

  const handleNavigation = (to) => {
    const path = getNavPath(to);
    navigate(path);
    setMobileMenuOpen(false);
  };

  // Navigation section component
  const NavigationSection = () => (
    <nav className="flex-1 overflow-y-auto py-4">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={getNavPath(item.to)}
          onClick={() => handleNavigation(item.to)}
          className={({ isActive }) => cn(
            "flex items-center px-4 py-3 text-sm",
            "transition-colors duration-200",
            "hover:bg-primary-foreground/10",
            (isActive || window.location.pathname.startsWith(item.to)) ? "bg-primary-foreground/20" : "transparent",
            collapsed && "justify-center"
          )}
        >
          {item.icon}
          <motion.span
            animate={{ 
              opacity: collapsed ? 0 : 1,
              width: collapsed ? 0 : "auto",
              display: collapsed ? "none" : "inline-block"
            }}
            transition={{ duration: 0.2 }}
            className="ml-3 overflow-hidden whitespace-nowrap"
          >
            {item.label}
          </motion.span>
        </NavLink>
      ))}
    </nav>
  );

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="fixed top-4 right-4 z-20 md:hidden"
      >
        <Menu className="h-6 w-6" />
      </Button>

      <motion.div
        animate={{
          width: collapsed ? 80 : 256,
        }}
        transition={{ 
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1],
        }}
        className={cn(
          "h-screen flex flex-col bg-primary text-primary-foreground",
          "fixed left-0 top-0 z-40",
          "border-r border-primary/20 shadow-xl",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Header Section */}
        <div className="flex-none border-b border-primary/20">
          <div className="flex items-center h-16 px-4">
            <motion.h1
              animate={{ 
                opacity: collapsed ? 0 : 1,
                width: collapsed ? 0 : "100%",
                display: collapsed ? "none" : "block"
              }}
              transition={{ duration: 0.3 }}
              className="text-xl font-bold overflow-hidden whitespace-nowrap"
            >
              Rainbow Money
            </motion.h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="hidden md:flex ml-auto"
            >
              {collapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* User Profile */}
          <div className="flex items-center px-4 py-4 border-b border-primary/20">
            <div className="rounded-full bg-primary-foreground/10 w-10 h-10 flex items-center justify-center">
              <User className="h-6 w-6" />
            </div>
            <motion.div
              animate={{ 
                opacity: collapsed ? 0 : 1,
                width: collapsed ? 0 : "auto",
                marginLeft: collapsed ? 0 : "0.75rem"
              }}
              className="overflow-hidden whitespace-nowrap"
            >
              <p className="text-sm font-medium">{user?.name || "John Doe"}</p>
              <p className="text-xs text-primary-foreground/70">{user?.email || "john@example.com"}</p>
            </motion.div>
          </div>
        </div>
        
        {/* Navigation Links */}
        <NavigationSection />
        
        {/* Footer Section */}
        <div className="flex-none border-t border-primary/20">
          <div className="px-4 py-4">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start"
            >
              <LogOut className="h-5 w-5" />
              <motion.span
                animate={{ 
                  opacity: collapsed ? 0 : 1,
                  width: collapsed ? 0 : "auto",
                  marginLeft: collapsed ? 0 : "0.75rem"
                }}
                className="overflow-hidden whitespace-nowrap"
              >
                Logout
              </motion.span>
            </Button>
          </div>
        </div>
      </motion.div>

      {mobileMenuOpen && (
        <motion.div
          initial={false}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}

function NavItem({ to, icon, label, collapsed }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => cn(
        "flex items-center px-4 py-2 rounded-md text-sm font-medium",
        "hover:bg-primary-foreground/10",
        isActive ? "bg-primary-foreground/20" : "text-primary-foreground/70",
        collapsed && "justify-center px-2"
      )}
    >
      {icon}
      <motion.span
        animate={{ 
          opacity: collapsed ? 0 : 1,
          width: collapsed ? 0 : "auto",
          marginLeft: collapsed ? 0 : "0.75rem"
        }}
        className="overflow-hidden whitespace-nowrap"
      >
        {label}
      </motion.span>
    </NavLink>
  );
}