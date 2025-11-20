'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';

export default function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [showTimeout, setShowTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Mostrar/ocultar header según posición del mouse
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Si el mouse está en los primeros 100px del top
      if (e.clientY < 100) {
        // Limpiar timeout anterior si existe
        if (showTimeout) clearTimeout(showTimeout);
        
        // Mostrar después de 1 segundo
        const timeout = setTimeout(() => {
          setIsVisible(true);
        }, 1000);
        setShowTimeout(timeout);
      } else {
        // Ocultar inmediatamente si sale de la zona
        if (showTimeout) clearTimeout(showTimeout);
        setIsVisible(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (showTimeout) clearTimeout(showTimeout);
    };
  }, [showTimeout]);

  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  // Si estamos en Home (ruta raiz), mantener siempre visible
  const visibleAlwaysOnHome = pathname === '/';
  const finalVisible = visibleAlwaysOnHome ? true : isVisible;

  return (
    <>
      {/* Header - Relative para ocupar espacio */}
      <header 
        className={`relative z-40 overflow-hidden transition-all duration-500 ease-in-out ${
          finalVisible ? 'h-auto opacity-100 py-4' : 'h-0 opacity-0 py-0'
        }`}
        style={{
          maxHeight: finalVisible ? '200px' : '0px',
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* Fondo gradient premium */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/10 via-purple-900 to-indigo-900/95 backdrop-blur-md border-b-2 border-yellow-400/30"></div>
        
        {/* Contenido */}
        <div className="relative container mx-auto px-6 py-4 max-w-full">
        <div className="flex justify-between items-center">
          {/* Logo y Nav */}
          <div className="flex items-center space-x-8">
            <Link 
              href="/lobby" 
              className="text-3xl font-black bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 bg-clip-text text-transparent hover:from-yellow-400 hover:to-yellow-600 transition-all duration-300 drop-shadow-lg"
            >
              🎰 Casino Royal
            </Link>
            
            {user && (
              <nav className="flex space-x-6 border-l-2 border-yellow-400/30 pl-8">
                <Link
                  href="/lobby"
                  className={`font-bold transition-all duration-300 ${
                    pathname === '/lobby' 
                      ? 'text-yellow-400 text-lg scale-105' 
                      : 'text-gray-100 hover:text-yellow-300'
                  }`}
                >
                  🎮 Lobby
                </Link>
                <Link
                  href="/history"
                  className={`font-bold transition-all duration-300 ${
                    pathname === '/history' 
                      ? 'text-yellow-400 text-lg scale-105' 
                      : 'text-gray-100 hover:text-yellow-300'
                  }`}
                >
                  📊 Historial
                </Link>
              </nav>
            )}
          </div>

          {/* Balance y Logout */}
          {user && (
            <div className="flex items-center space-x-6">
              {/* Info Usuario */}
              <div className="text-right border-r-2 border-yellow-400/30 pr-6">
                <p className="font-bold text-white text-sm">{user.username}</p>
                <p className="text-lg font-black bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg">
                  ${typeof user.balance === 'number' ? user.balance.toFixed(2) : parseFloat(user.balance || '0').toFixed(2)}
                </p>
              </div>
              
              {/* Botón Logout */}
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-red-500/50 border-2 border-red-500/50 transform hover:scale-105 active:scale-95"
              >
                Salir
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Línea decorativa inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent"></div>
      </header>
    </>
  );
}

