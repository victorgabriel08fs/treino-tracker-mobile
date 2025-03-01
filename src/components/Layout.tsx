
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, PlusCircle, History, User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { icon: Home, path: '/', label: 'Home' },
    { icon: Calendar, path: '/history', label: 'Histórico' },
    { icon: PlusCircle, path: '/new', label: 'Adicionar' },
    { icon: User, path: '/profile', label: 'Perfil' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col w-full max-w-lg mx-auto">
      <main className="flex-1 px-4 py-6 pb-20 overflow-y-auto thin-scrollbar">
        {children}
      </main>
      <nav className="fixed bottom-0 left-0 right-0 z-10">
        <div className="max-w-lg mx-auto">
          <div className="glass-card rounded-t-2xl shadow-lg px-4 py-3 flex justify-around items-center">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center transition-all duration-200 ${
                  isActive(item.path)
                    ? 'text-primary scale-110'
                    : 'text-muted-foreground'
                }`}
              >
                <item.icon size={20} className="mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Layout;
