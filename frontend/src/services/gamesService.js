import api from './api';

export const getGames = async () => {
  const response = await api.get('/games');
  return response.data;
};

export const playGame = async (gameType, gameData) => {
  const response = await api.post(`/games/${gameType}/play`, gameData);
  return response.data;
};

export const playRoulette = async (gameData) => {
  const response = await api.post('/games/roulette/play', gameData);
  return response.data;
};

export const playCraps = async (gameData) => {
  const response = await api.post('/games/craps/play', gameData);
  return response.data;
};

export const playSlots = async (gameData) => {
  const response = await api.post('/games/slots/play', gameData);
  return response.data;
};

export const getGameHistory = async (limit = 10) => {
  const response = await api.get(`/games/history?limit=${limit}`);
  return response.data;
};

const gamesService = {
  getGames,
  playGame,
  playRoulette,
  playCraps,
  playSlots,
  getGameHistory,
};

export default gamesService;
