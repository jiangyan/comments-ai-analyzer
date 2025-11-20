import React from 'react';
import { MessageSquareText, BarChart3 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="container flex h-16 items-center px-4">
          <div className="flex items-center gap-2 font-bold text-xl text-blue-600 mr-8">
            <MessageSquareText className="h-6 w-6" />
            <span>CommentAnalyzer</span>
          </div>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <button 
              onClick={() => navigate('/')}
              className={`transition-colors hover:text-blue-600 ${location.pathname === '/' ? 'text-blue-600' : 'text-slate-600'}`}
            >
              Parser
            </button>
            <button 
              onClick={() => navigate('/analysis')}
              className={`transition-colors hover:text-blue-600 ${location.pathname === '/analysis' ? 'text-blue-600' : 'text-slate-600'}`}
            >
              Analysis
            </button>
          </nav>
        </div>
      </header>
      <main className="container mx-auto p-4 py-8 h-[calc(100vh-64px)]">
        {children}
      </main>
    </div>
  );
};