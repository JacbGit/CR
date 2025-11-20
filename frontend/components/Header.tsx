'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import AddCreditModal from './AddCreditModal';

export default function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [showAddCredit, setShowAddCredit] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Detectar scroll para efecto de fondo
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  return (
    <>
      <AddCreditModal 
        isOpen={showAddCredit} 
        onClose={() => setShowAddCredit(false)} 
      />

      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-black/80 backdrop-blur-xl border-b border-white/10 py-3 shadow-2xl' 
            : 'bg-transparent py-5'
        }`}
      >
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link 
            href="/lobby" 
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-yellow-500/50 transition-all transform group-hover:rotate-12">
              <span className="text-2xl">👑</span>
            </div>
            <span className="text-2xl font-black text-white tracking-wider drop-shadow-lg">
              CASINO <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">ROYAL</span>
            </span>
          </Link>
            
          {user ? (
            <>
              {/* Nav Central */}
              <nav className="hidden md:flex items-center bg-white/5 rounded-full px-2 py-1 border border-white/10 backdrop-blur-md">
                {[
                  { name: 'Lobby', path: '/lobby', icon: '🎮' },
                  { name: 'Historial', path: '/history', icon: '📊' },
                ].map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all duration-300 ${
                      pathname === item.path
                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-lg shadow-yellow-500/20'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>

              {/* Panel Derecho */}
              <div className="flex items-center gap-6">
                {/* Balance Card */}
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Balance</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-yellow-400 drop-shadow-glow">
                      ${typeof user.balance === 'number' ? user.balance.toFixed(2) : parseFloat(user.balance || '0').toFixed(2)}
                    </span>
                    <button
                      onClick={() => setShowAddCredit(true)}
                      className="w-6 h-6 rounded-full bg-yellow-500 text-black flex items-center justify-center hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-500/20"
                      title="Recargar Saldo"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* User Menu */}
                <div className="flex items-center gap-4 pl-6 border-l border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg border-2 border-white/20">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden lg:block font-bold text-white">{user.username}</span>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-white/5"
                    title="Cerrar Sesión"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link 
                href="/login" 
                className="px-6 py-2 rounded-full border border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 transition-all font-bold text-sm uppercase tracking-wide"
              >
                Iniciar Sesión
              </Link>
              <Link 
                href="/register" 
                className="px-6 py-2 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold hover:shadow-lg hover:shadow-yellow-500/20 transition-all text-sm uppercase tracking-wide"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
    </>
  );
}

