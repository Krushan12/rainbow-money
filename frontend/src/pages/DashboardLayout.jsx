import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/SideBar';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar onCollapse={setCollapsed} />
      
      <motion.main 
        initial={false}
        animate={{ 
          paddingLeft: collapsed ? 80 : 256,
        }}
        transition={{ 
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1]
        }}
        className="min-h-screen"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="container mx-auto p-6"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </motion.main>
    </div>
  );
}
