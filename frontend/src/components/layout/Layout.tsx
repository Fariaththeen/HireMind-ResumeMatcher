import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Menu, Layers } from 'lucide-react';

export function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      
      {/* Mobile Top Header */}
      <header className="lg:hidden h-16 bg-white border-b border-gray-100 flex items-center justify-between px-5 sticky top-0 z-30 shadow-sm shrink-0">
        <Link to="/app" className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg shadow-sm">
            <Layers className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-bold text-gray-900 tracking-tight">HireMind</span>
        </Link>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl transition"
          title="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* Responsive Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Main content body */}
      <main className="flex-1 lg:ml-64 overflow-x-hidden min-h-0">
        <Outlet />
      </main>
    </div>
  );
}
