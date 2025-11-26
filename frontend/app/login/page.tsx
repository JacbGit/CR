'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      router.push('/lobby');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Decoración superior */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce">🎰</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
            Casino Royal
          </h1>
          <p className="text-gray-400 mt-2">Inicia sesión para jugar</p>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800/50 backdrop-blur-xl border border-yellow-500/20 rounded-2xl p-8 shadow-2xl"
        >
          {/* Mensajes de error */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">❌ {error}</p>
            </div>
          )}

          {/* Campo Usuario */}
          <div className="mb-6">
            <label className="block text-yellow-400 text-sm font-bold mb-2">
              Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingresa tu usuario"
              className="w-full px-4 py-3 bg-gray-700/50 border border-yellow-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all"
            />
          </div>

          {/* Campo Contraseña */}
          <div className="mb-8">
            <label className="block text-yellow-400 text-sm font-bold mb-2">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                className="w-full px-4 py-3 bg-gray-700/50 border border-yellow-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-yellow-400 transition-colors"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Botón Login */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 disabled:from-gray-500 disabled:to-gray-600 text-gray-900 font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-yellow-500/50 disabled:shadow-none"
          >
            {loading ? '⏳ Iniciando sesión...' : '🎮 Inicia sesión'}
          </button>

          {/* Link a registro */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              ¿No tienes cuenta?{' '}
              <Link
                href="/register"
                className="text-yellow-400 hover:text-yellow-300 font-bold transition-colors"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-xs">
          <p>© 2025 Casino Royal. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
}
