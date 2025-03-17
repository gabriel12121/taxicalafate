
import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, RefreshCw, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBankContext } from '@/context/BankContext';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, title, showBack = false }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const { currentUser } = useBankContext();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen max-w-lg mx-auto bg-white shadow-lg relative overflow-hidden">
      {/* Header */}
      <header className="p-4 flex items-center justify-between bg-white border-b">
        <div className="flex items-center">
          <button 
            onClick={toggleMenu}
            className="p-2 mr-2 rounded-full hover:bg-bank-gray transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-2xl font-bold text-bank-purple">FinBank</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-full hover:bg-bank-gray transition-colors">
            <RefreshCw size={20} className="text-bank-purple" />
          </button>
          {currentUser?.isAdmin && (
            <Link to="/admin" className="p-2 rounded-full bg-bank-purple text-white hover:bg-bank-purple-dark transition-colors">
              <Shield size={20} />
            </Link>
          )}
        </div>
      </header>

      {/* Mobile Menu */}
      <div 
        className={cn(
          "absolute top-[72px] left-0 w-full h-screen z-50 bg-white transform transition-all duration-300 ease-in-out",
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 space-y-4">
          <div className="space-y-1">
            <Link 
              to="/login" 
              onClick={toggleMenu}
              className="block p-3 rounded-lg hover:bg-bank-gray transition-colors text-lg"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              onClick={toggleMenu}
              className="block p-3 rounded-lg hover:bg-bank-gray transition-colors text-lg"
            >
              Cadastro
            </Link>
            <Link 
              to="/dashboard" 
              onClick={toggleMenu}
              className="block p-3 rounded-lg hover:bg-bank-gray transition-colors text-lg"
            >
              Conta Pessoal
            </Link>
            {currentUser?.isAdmin && (
              <Link 
                to="/admin" 
                onClick={toggleMenu}
                className="block p-3 rounded-lg bg-bank-purple text-white hover:bg-bank-purple-dark transition-colors text-lg"
              >
                Admin
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Page Content */}
      <main className="p-4">
        {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
        {children}
      </main>
    </div>
  );
};

export default Layout;
