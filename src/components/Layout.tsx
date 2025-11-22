import React, { useState, useEffect } from 'react';
import NavigationSidebar from './NavigationSidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  return (
    <div className="flex h-screen overflow-hidden">
      <NavigationSidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <main 
        className="flex-1 overflow-auto bg-background transition-all duration-300"
        style={{ 
          marginLeft: sidebarOpen ? '337px' : '81px'
        }}
      >
        {children}
      </main>
    </div>
  );
}
