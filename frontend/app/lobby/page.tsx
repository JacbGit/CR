'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const games = [
  {
    id: 'roulette',
    name: 'Ruleta',
    icon: '🎡',
    description: 'Apuesta a números o colores',
    path: '/game/roulette',
  },
  {
    id: 'craps',
    name: 'Dados (Craps)',
    icon: '🎲',
    description: 'Lanza los dados y gana',
    path: '/game/craps',
  },
  {
    id: 'slots',
    name: 'Tragamonedas',
    icon: '🎰',
    description: 'Prueba tu suerte',
    path: '/game/slots',
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-900">
        <div className="text-white text-2xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="casino-title text-6xl text-white mb-4">🎰 Casino Royal 🎰</h1>
          <p className="text-xl text-purple-200">Bienvenido, {user.firstName}! Elige tu juego favorito</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {games.map((game, index) => (
            <Link
              key={game.id}
              href={game.path}
              className="bg-white rounded-2xl shadow-2xl p-8 hover:transform hover:scale-105 transition-all duration-300 cursor-pointer animate-fade-in-up"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="text-center">
                <div className="text-7xl mb-4 animate-pulse-glow">{game.icon}</div>
                <h2 className="text-3xl font-bold text-purple-900 mb-2">{game.name}</h2>
                <p className="text-gray-600">{game.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center animate-fade-in-up" style={{animationDelay: '0.3s'}}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 inline-block">
            <p className="text-gray-700 text-lg">
              <span className="font-semibold">Balance actual:</span>{' '}
              <span className="text-3xl font-bold text-green-600">
                ${typeof user.balance === 'number' ? user.balance.toFixed(2) : parseFloat(user.balance || '0').toFixed(2)}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
