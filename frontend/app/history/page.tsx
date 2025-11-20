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

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-5xl font-bold text-white text-center mb-8">📜 Historial de Juegos</h1>

        {loadingHistory ? (
          <div className="text-white text-center text-2xl">Cargando historial...</div>
        ) : history.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <p className="text-gray-600 text-xl">No hay historial de juegos aún</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-purple-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Fecha</th>
                  <th className="px-6 py-4 text-left">Juego</th>
                  <th className="px-6 py-4 text-left">Apuesta</th>
                  <th className="px-6 py-4 text-left">Resultado</th>
                  <th className="px-6 py-4 text-left">Ganancia</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-semibold">{item.gameName}</td>
                    <td className="px-6 py-4 text-gray-900">${item.betAmount}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-white font-semibold ${
                          item.won ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      >
                        {item.won ? 'Ganó' : 'Perdió'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`font-bold ${item.won ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {item.won ? `+$${item.winAmount}` : `-$${item.betAmount}`}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
