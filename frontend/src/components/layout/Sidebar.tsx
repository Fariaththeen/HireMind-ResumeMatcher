import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  GitCompare, 
  History,
  Layers,
  Home
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/app', icon: LayoutDashboard },
  { name: 'Jobs', href: '/app/jobs', icon: Briefcase },
  { name: 'Resumes', href: '/app/resumes', icon: FileText },
  { name: 'Match & Score', href: '/app/match', icon: GitCompare },
  { name: 'History', href: '/app/history', icon: History },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile Sidebar Overlay Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"
        />
      )}

      <aside className={`
        fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-100 flex flex-col justify-between p-6 z-40
        transition-transform duration-300 lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="space-y-8">
          {/* Brand Logo & Close Button for mobile */}
          <div className="flex items-center justify-between">
            <Link to="/app" onClick={onClose} className="flex items-center gap-3 px-2">
              <div className="bg-indigo-600 p-2 rounded-xl shadow-md shadow-indigo-600/20">
                <Layers className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">HireMind</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                end={item.href === '/app'}
                onClick={onClose}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium
                  transition-all duration-300
                  ${isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Go to Landing Page Link at the bottom */}
        <div className="pt-4 border-t border-gray-100">
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center justify-center gap-2.5 w-full px-4 py-3.5 rounded-xl text-sm font-bold text-indigo-600 bg-indigo-50/70 hover:bg-indigo-100 hover:text-indigo-700 transition-all duration-300 border border-indigo-100/50"
          >
            <Home className="w-4 h-4" />
            Go to Landing Page
          </Link>
        </div>
      </aside>
    </>
  );
}
