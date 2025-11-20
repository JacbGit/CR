'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const games = [
  {
    id: 'roulette',
    name: 'Ruleta Royale',
    icon: '🎡',
    description: 'La elegancia de la ruleta europea. Apuesta a tus números de la suerte.',
    path: '/game/roulette',
    color: 'from-red-600 to-red-900'
  },
  {
    id: 'craps',
    name: 'Dados (Craps)',
    icon: '🎲',
    description: 'Siente la adrenalina de los dados. ¿Será tu día de suerte?',
    path: '/game/craps',
    color: 'from-green-600 to-green-900'
  },
  {
    id: 'slots',
    name: 'Tragamonedas',
    icon: '🎰',
    description: 'Jackpots millonarios te esperan. ¡Gira y gana a lo grande!',
    path: '/game/slots',
    color: 'from-yellow-600 to-yellow-900'
  },
];

export default function LobbyPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden font-sans relative pt-24">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-yellow-900/10 z-0"></div>
      <div className="absolute top-0 left-0 w-full h-full opacity-20 z-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-yellow-500/20 via-transparent to-transparent"></div>

      <div className="container mx-auto max-w-7xl px-4 py-12 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-300 drop-shadow-lg">
              CASINO ROYAL
            </span>
          </h1>
          <p className="text-xl text-gray-400 font-light">
            Bienvenido, <span className="text-white font-bold">{user.firstName}</span>. Tu racha ganadora comienza aquí.
          </p>
        </div>

        {/* Balance Card */}
        <div className="flex justify-center mb-16 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 px-12 flex flex-col items-center shadow-[0_0_30px_-5px_rgba(234,179,8,0.1)]">
            <span className="text-gray-400 text-sm uppercase tracking-widest mb-2">Balance Disponible</span>
            <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
              ${typeof user.balance === 'number' ? user.balance.toFixed(2) : parseFloat(user.balance || '0').toFixed(2)}
            </span>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {games.map((game, index) => (
            <Link
              key={game.id}
              href={game.path}
              className="group relative bg-gray-900/50 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden hover:border-yellow-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] animate-fade-in-up"
              style={{animationDelay: `${0.2 + (index * 0.1)}s`}}
            >
              {/* Card Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              
              <div className="p-8 flex flex-col items-center text-center h-full relative z-10">
                <div className="text-7xl mb-6 transform group-hover:scale-110 transition-transform duration-500 drop-shadow-2xl filter group-hover:brightness-125">
                  {game.icon}
                </div>
                
                <h2 className="text-3xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">
                  {game.name}
                </h2>
                
                <p className="text-gray-400 mb-8 leading-relaxed flex-grow">
                  {game.description}
                </p>

                <span className="px-8 py-3 rounded-full bg-white/10 border border-white/20 text-white font-bold text-sm uppercase tracking-wider group-hover:bg-yellow-500 group-hover:text-black group-hover:border-yellow-500 transition-all duration-300">
                  Jugar Ahora
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
