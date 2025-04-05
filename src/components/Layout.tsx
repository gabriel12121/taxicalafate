
import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { RefreshCw, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBankContext } from '@/context/BankContext';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, title, showBack = false }) => {
  const location = useLocation();
  const { currentUser } = useBankContext();
  
  return (
    <div className="min-h-screen max-w-lg mx-auto bg-white shadow-lg relative overflow-hidden">
      {/* Header */}
      <header className="p-4 flex items-center justify-between bg-white border-b">
        <div className="flex items-center">
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

      {/* Page Content */}
      <main className="p-4">
        {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
        {children}
      </main>
    </div>
  );
};

export default Layout;
