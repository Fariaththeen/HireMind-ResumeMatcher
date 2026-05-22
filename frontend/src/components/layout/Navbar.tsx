import { Link } from 'react-router-dom';
import { Layers } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 px-6 flex items-center justify-between shadow-sm">
      <Link to="/app" className="text-xl font-bold text-gray-900 flex items-center gap-2">
        <div className="bg-primary-600 p-1.5 rounded-lg">
          <Layers className="h-5 w-5 text-white" />
        </div>
        HireMind
      </Link>
    </nav>
  );
}
