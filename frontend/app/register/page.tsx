'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      router.push('/lobby');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 px-4 py-8 relative overflow-hidden">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Card de Registro */}
      <div className="relative z-10 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 rounded-3xl shadow-2xl p-8 w-full max-w-md border-2 border-yellow-400 backdrop-blur-sm">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-3 drop-shadow-lg animate-bounce" style={{animationDuration: '2s'}}>🎰</div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 mb-2 drop-shadow-lg" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>
            CASINO ROYAL
          </h1>
          <p className="text-yellow-200 font-semibold tracking-widest text-sm">CREA TU CUENTA</p>
          <div className="h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full mt-3"></div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/30 border-2 border-red-400 text-red-100 px-4 py-3 rounded-lg mb-4 font-semibold flex items-center gap-2">
            <span>⚠️</span>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Usuario */}
          <div>
            <label className="block text-yellow-300 font-black mb-2 drop-shadow-lg text-sm">USUARIO</label>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg blur opacity-30"></div>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="relative w-full px-4 py-2 border-2 border-yellow-400 rounded-lg text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300 bg-white/90 backdrop-blur placeholder-gray-500"
                placeholder="Tu usuario"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-yellow-300 font-black mb-2 drop-shadow-lg text-sm">EMAIL</label>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg blur opacity-30"></div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="relative w-full px-4 py-2 border-2 border-yellow-400 rounded-lg text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300 bg-white/90 backdrop-blur placeholder-gray-500"
                placeholder="tu@email.com"
                required
              />
            </div>
          </div>

          {/* Nombre y Apellido */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-yellow-300 font-black mb-2 drop-shadow-lg text-xs">NOMBRE</label>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg blur opacity-30"></div>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="relative w-full px-4 py-2 border-2 border-yellow-400 rounded-lg text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300 bg-white/90 backdrop-blur placeholder-gray-500"
                  placeholder="Juan"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-yellow-300 font-black mb-2 drop-shadow-lg text-xs">APELLIDO</label>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg blur opacity-30"></div>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="relative w-full px-4 py-2 border-2 border-yellow-400 rounded-lg text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300 bg-white/90 backdrop-blur placeholder-gray-500"
                  placeholder="Pérez"
                  required
                />
              </div>
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-yellow-300 font-black mb-2 drop-shadow-lg text-sm">CONTRASEÑA</label>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg blur opacity-30"></div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="relative w-full px-4 py-2 border-2 border-yellow-400 rounded-lg text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300 bg-white/90 backdrop-blur placeholder-gray-500"
                placeholder="••••••••"
                required
              />
            </div>
            <p className="text-gray-400 text-xs mt-1">Mínimo 6 caracteres</p>
          </div>

          {/* Botón Registrarse */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-yellow-900 font-black py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg border-2 border-yellow-300 transform hover:scale-105 active:scale-95 mt-6 ${
              loading ? 'animate-pulse' : ''
            }`}
            style={{textShadow: '1px 1px 2px rgba(0,0,0,0.3)'}}
          >
            {loading ? '⏳ REGISTRANDO...' : 'CREAR CUENTA'}
          </button>
        </form>

        {/* Separador */}
        <div className="my-6 flex items-center gap-4">
          <div className="h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent flex-1"></div>
          <span className="text-yellow-300 font-bold text-xs">O</span>
          <div className="h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent flex-1"></div>
        </div>

        {/* Link a Login */}
        <div className="text-center">
          <p className="text-gray-300 mb-3">
            ¿Ya tienes cuenta?
          </p>
          <Link
            href="/login"
            className="w-full block bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black py-3 rounded-lg transition-all duration-200 border-2 border-purple-400 transform hover:scale-105 active:scale-95"
            style={{textShadow: '1px 1px 2px rgba(0,0,0,0.3)'}}
          >
            INICIA SESIÓN
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-xs">
            🔒 Conexión segura | Juega responsablemente
          </p>
        </div>
      </div>
    </div>
  );
}
