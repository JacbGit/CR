'use client';

import { useState } from 'react';
import { soundManager } from '@/lib/soundManager';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

interface AddCreditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddCreditModal({ isOpen, onClose }: AddCreditModalProps) {
  const { refreshUser } = useAuth();
  const [creditAmount, setCreditAmount] = useState(100);

  const handleAddCredit = async () => {
    if (creditAmount <= 0) {
      alert('El monto debe ser mayor a 0');
      return;
    }
    
    soundManager.playClickSound();

    try {
      await api.post('/transactions/deposit', { amount: creditAmount });

      await refreshUser();
      onClose();
      soundManager.playMoneyFall();
      alert(`¡Crédito agregado exitosamente! +$${creditAmount}`);
    } catch (error: any) {
      console.error('Error:', error);
      const message = error.response?.data?.message || 'Error al agregar crédito';
      alert(message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60]">
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 max-w-md w-full mx-4 border border-yellow-500/30 shadow-2xl animate-fade-in-up relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>
        
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 text-center mb-8">
          💰 Recargar Saldo
        </h2>
        
        <div className="mb-8">
          <label className="block text-gray-400 text-sm font-bold mb-3 uppercase tracking-wider">Monto a agregar</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500 font-bold text-xl">$</span>
            <input
              type="number"
              min="1"
              value={creditAmount}
              onChange={(e) => setCreditAmount(parseInt(e.target.value) || 0)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-10 pr-4 text-white font-bold text-2xl focus:border-yellow-500 focus:outline-none transition-colors"
              autoFocus
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-8">
          {[10, 50, 100, 500].map((amount) => (
            <button
              key={amount}
              onClick={() => setCreditAmount(amount)}
              className={`py-2 rounded-lg font-bold transition-all border ${
                creditAmount === amount 
                  ? 'bg-yellow-500 text-black border-yellow-500' 
                  : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:border-yellow-500/50'
              }`}
            >
              ${amount}
            </button>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleAddCredit}
            className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-black py-4 rounded-xl shadow-lg shadow-yellow-500/20 transition-all transform hover:scale-105 active:scale-95"
          >
            CONFIRMAR
          </button>
        </div>
      </div>
    </div>
  );
}
