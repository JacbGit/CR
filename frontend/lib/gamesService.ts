import api from './api';

export const gamesService = {
  async getGames() {
    const response = await api.get('/games');
    return response.data;
  },

  async playRoulette(betData: { 
    gameType: string;
    betType: string;
    value?: any;
    amount: number;
  }) {
    const response = await api.post('/games/roulette/play', betData);
    return response.data;
  },

  async playCraps(betData: { 
    gameType: string;
    betType?: string;
    prediction?: number;
    amount: number;
  }) {
    const response = await api.post('/games/dice/play', betData);
    return response.data;
  },

  async playSlots(amount: number) {
    const response = await api.post('/games/slots/play', { 
      amount,
      gameType: 'slots'
    });
    return response.data;
  },

  async getHistory() {
    const response = await api.get('/game-history');
    return response.data;
  },

  async getBalance() {
    const response = await api.get('/users/me');
    return response.data;
  },

  async getStats() {
    const response = await api.get('/games/stats');
    return response.data;
  },
};
