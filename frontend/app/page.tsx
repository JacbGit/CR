'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Redirect to lobby if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push('/lobby');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden font-sans">
      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-black to-yellow-900/20 z-0"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-500/20 via-transparent to-transparent"></div>
        
        {/* Navbar removed - using global Header */}
        <div className="h-20"></div>

        {/* Main Content */}
        <main className="relative z-10 flex-1 container mx-auto px-6 flex flex-col justify-center items-center text-center">
          <div className="animate-fade-in-up max-w-4xl mx-auto">
            <span className="inline-block py-1 px-3 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-xs font-bold mb-8 tracking-[0.2em] uppercase backdrop-blur-sm">
              La mejor experiencia de casino online
            </span>
            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight tracking-tight">
              <span className="block text-white drop-shadow-2xl">JUEGA A LO</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-300 drop-shadow-lg animate-pulse-slow">
                GRANDE
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              Disfruta de tus juegos favoritos: <span className="text-white font-semibold">Ruleta</span>, <span className="text-white font-semibold">Tragamonedas</span> y <span className="text-white font-semibold">Dados</span>. 
              Regístrate ahora y vive la emoción de ganar.
            </p>
            
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
              <Link href="/register" className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-black text-lg hover:transform hover:scale-105 transition-all shadow-[0_0_40px_-10px_rgba(234,179,8,0.3)] overflow-hidden">
                <span className="relative z-10">EMPEZAR A JUGAR</span>
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </Link>
              <Link href="/login" className="px-8 py-4 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all hover:border-white/30">
                YA TENGO CUENTA
              </Link>
            </div>
          </div>

          {/* Game Previews */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            {[
              { icon: '🎡', title: 'Ruleta', desc: 'Prueba tu suerte en nuestra ruleta europea y americana.' },
              { icon: '🎰', title: 'Slots', desc: 'Cientos de máquinas tragamonedas con jackpots increíbles.' },
              { icon: '🎲', title: 'Dados', desc: 'La emoción de los dados en tiempo real.' }
            ].map((game, i) => (
              <div key={i} className="p-8 rounded-3xl bg-gradient-to-b from-gray-800/50 to-gray-900/50 border border-white/5 hover:border-yellow-500/30 transition-all group backdrop-blur-sm hover:bg-gray-800/80 hover:-translate-y-2 duration-300">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">{game.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-3">{game.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{game.desc}</p>
              </div>
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 py-8 text-center text-gray-600 text-sm border-t border-white/5 mt-12">
          <p>© 2025 Casino Royal. Todos los derechos reservados.</p>
        </footer>
      </div>
    </div>
  );
}
