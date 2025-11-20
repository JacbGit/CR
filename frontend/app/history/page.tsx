'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { gamesService } from '@/lib/gamesService';

export default function HistoryPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  const loadHistory = async () => {
    try {
      const data = await gamesService.getHistory();
      setHistory(data);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    // Normalizar formato para asegurar que sea ISO 8601 UTC
    let normalized = dateString.replace(' ', 'T');
    if (!normalized.endsWith('Z') && !normalized.match(/[+-]\d{2}:?\d{2}$/)) {
      normalized += 'Z';
    }
    try {
      return new Date(normalized).toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 pt-32 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => router.push('/lobby')}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-all border border-white/20 font-medium"
          >
            ← Volver al Lobby
          </button>
          <h1 className="text-4xl font-bold text-white text-center tracking-tight">Historial de Juegos</h1>
          <div className="w-[140px]"></div> {/* Spacer for centering */}
        </div>

        {loadingHistory ? (
          <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : history.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-12 text-center border border-white/10">
            <p className="text-gray-300 text-xl">No hay historial de juegos aún</p>
          </div>
        ) : (
          <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black/40 text-gray-300 uppercase text-sm tracking-wider">
                  <tr>
                    <th className="px-6 py-5 text-left font-medium">Fecha</th>
                    <th className="px-6 py-5 text-left font-medium">Juego</th>
                    <th className="px-6 py-5 text-left font-medium">Apuesta</th>
                    <th className="px-6 py-5 text-left font-medium">Resultado</th>
                    <th className="px-6 py-5 text-left font-medium">Ganancia</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {history.map((item, index) => (
                    <tr key={index} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-gray-300 whitespace-nowrap">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-white font-semibold uppercase tracking-wide">
                        {item.gameType === 'roulette' && '🎡 Ruleta'}
                        {item.gameType === 'slots' && '🎰 Slots'}
                        {item.gameType === 'dice' && '🎲 Dados'}
                        {!['roulette', 'slots', 'dice'].includes(item.gameType) && item.gameType}
                      </td>
                      <td className="px-6 py-4 text-gray-300 font-mono">${Number(item.betAmount).toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            item.result === 'win' 
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}
                        >
                          {item.result === 'win' ? 'Ganó' : 'Perdió'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono">
                        <span
                          className={`font-bold ${item.result === 'win' ? 'text-green-400' : 'text-red-400'}`}
                        >
                          {item.result === 'win' ? `+$${Number(item.winAmount).toFixed(2)}` : `-$${Number(item.betAmount).toFixed(2)}`}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
