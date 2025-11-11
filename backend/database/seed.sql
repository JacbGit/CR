-- ================================================
-- CASINO ROYAL - DATOS DE PRUEBA (SEED)
-- ================================================
-- Descripción: Inserta datos de prueba para desarrollo
-- Ejecutar después de schema.sql
-- ================================================

-- Conectar a la base de datos
\c casino_royal_db;

-- ================================================
-- USUARIOS DE PRUEBA
-- ================================================
-- Contraseña para todos los usuarios: Test123
-- Hash generado con bcrypt (10 rounds): $2b$10$YourActualHashHere

-- Insertar usuarios de prueba
INSERT INTO users (username, first_name, last_name, email, password, balance, role, profile_picture) VALUES
('admin', 'Admin', 'Casino', 'admin@casino.com', '$2b$10$K7L1Ll8YiJDdT5dP6w5ibe.VWVv5K/WKDvgZqFzpQJ0EhfZH.bT8C', 10000.00, 'admin', 'https://i.pravatar.cc/150?img=1'),
('jugador1', 'Juan', 'Pérez', 'juan@example.com', '$2b$10$K7L1Ll8YiJDdT5dP6w5ibe.VWVv5K/WKDvgZqFzpQJ0EhfZH.bT8C', 1500.00, 'player', 'https://i.pravatar.cc/150?img=2'),
('jugador2', 'María', 'García', 'maria@example.com', '$2b$10$K7L1Ll8YiJDdT5dP6w5ibe.VWVv5K/WKDvgZqFzpQJ0EhfZH.bT8C', 2000.00, 'player', 'https://i.pravatar.cc/150?img=3'),
('jugador3', 'Carlos', 'López', 'carlos@example.com', '$2b$10$K7L1Ll8YiJDdT5dP6w5ibe.VWVv5K/WKDvgZqFzpQJ0EhfZH.bT8C', 800.00, 'player', 'https://i.pravatar.cc/150?img=4'),
('jugador4', 'Ana', 'Martínez', 'ana@example.com', '$2b$10$K7L1Ll8YiJDdT5dP6w5ibe.VWVv5K/WKDvgZqFzpQJ0EhfZH.bT8C', 3000.00, 'player', 'https://i.pravatar.cc/150?img=5'),
('jugador5', 'Pedro', 'Sánchez', 'pedro@example.com', '$2b$10$K7L1Ll8YiJDdT5dP6w5ibe.VWVv5K/WKDvgZqFzpQJ0EhfZH.bT8C', 500.00, 'player', 'https://i.pravatar.cc/150?img=6')
ON CONFLICT (username) DO NOTHING;

-- ================================================
-- HISTORIAL DE JUEGOS DE PRUEBA
-- ================================================

-- Obtener IDs de usuarios para los inserts
DO $$
DECLARE
    user1_id UUID;
    user2_id UUID;
    user3_id UUID;
BEGIN
    -- Obtener IDs
    SELECT id INTO user1_id FROM users WHERE username = 'jugador1';
    SELECT id INTO user2_id FROM users WHERE username = 'jugador2';
    SELECT id INTO user3_id FROM users WHERE username = 'jugador3';

    -- Historial para jugador1 - Ruleta
    INSERT INTO game_history (user_id, game_type, bet_amount, win_amount, result, balance_before, balance_after, game_data) VALUES
    (user1_id, 'roulette', 50.00, 100.00, 'win', 1000.00, 1050.00, '{"winningNumber": 17, "betType": "number", "betValue": 17, "isRed": true}'),
    (user1_id, 'roulette', 25.00, 0.00, 'loss', 1050.00, 1025.00, '{"winningNumber": 8, "betType": "color", "betValue": "red", "isRed": false}'),
    (user1_id, 'roulette', 100.00, 100.00, 'win', 1025.00, 1025.00, '{"winningNumber": 24, "betType": "odd-even", "betValue": "even", "isRed": false}');

    -- Historial para jugador1 - Dados
    INSERT INTO game_history (user_id, game_type, bet_amount, win_amount, result, balance_before, balance_after, game_data) VALUES
    (user1_id, 'dice', 30.00, 180.00, 'win', 1025.00, 1175.00, '{"dice1": 3, "dice2": 4, "total": 7, "prediction": 7}'),
    (user1_id, 'dice', 50.00, 0.00, 'loss', 1175.00, 1125.00, '{"dice1": 2, "dice2": 5, "total": 7, "prediction": 8}');

    -- Historial para jugador1 - Slots
    INSERT INTO game_history (user_id, game_type, bet_amount, win_amount, result, balance_before, balance_after, game_data) VALUES
    (user1_id, 'slots', 20.00, 200.00, 'win', 1125.00, 1305.00, '{"reels": ["💎", "💎", "💎"], "multiplier": 30}'),
    (user1_id, 'slots', 15.00, 0.00, 'loss', 1305.00, 1290.00, '{"reels": ["🍒", "🍋", "🍊"], "multiplier": 0}'),
    (user1_id, 'slots', 25.00, 50.00, 'win', 1290.00, 1315.00, '{"reels": ["⭐", "⭐", "🍉"], "multiplier": 2}');

    -- Historial para jugador2 - Ruleta
    INSERT INTO game_history (user_id, game_type, bet_amount, win_amount, result, balance_before, balance_after, game_data) VALUES
    (user2_id, 'roulette', 100.00, 0.00, 'loss', 2000.00, 1900.00, '{"winningNumber": 0, "betType": "color", "betValue": "red", "isRed": false}'),
    (user2_id, 'roulette', 50.00, 50.00, 'win', 1900.00, 1900.00, '{"winningNumber": 12, "betType": "color", "betValue": "red", "isRed": true}');

    -- Historial para jugador2 - Dados
    INSERT INTO game_history (user_id, game_type, bet_amount, win_amount, result, balance_before, balance_after, game_data) VALUES
    (user2_id, 'dice', 75.00, 450.00, 'win', 1900.00, 2275.00, '{"dice1": 6, "dice2": 6, "total": 12, "prediction": 12}'),
    (user2_id, 'dice', 100.00, 0.00, 'loss', 2275.00, 2175.00, '{"dice1": 1, "dice2": 3, "total": 4, "prediction": 7}');

    -- Historial para jugador3 - Slots
    INSERT INTO game_history (user_id, game_type, bet_amount, win_amount, result, balance_before, balance_after, game_data) VALUES
    (user3_id, 'slots', 10.00, 500.00, 'win', 500.00, 990.00, '{"reels": ["7️⃣", "7️⃣", "7️⃣"], "multiplier": 50}'),
    (user3_id, 'slots', 50.00, 0.00, 'loss', 990.00, 940.00, '{"reels": ["🍒", "🍋", "💎"], "multiplier": 0}');

END $$;

-- ================================================
-- TRANSACCIONES DE PRUEBA
-- ================================================

DO $$
DECLARE
    user1_id UUID;
    user2_id UUID;
    user3_id UUID;
BEGIN
    SELECT id INTO user1_id FROM users WHERE username = 'jugador1';
    SELECT id INTO user2_id FROM users WHERE username = 'jugador2';
    SELECT id INTO user3_id FROM users WHERE username = 'jugador3';

    -- Transacciones para jugador1
    INSERT INTO transactions (user_id, type, amount, balance_before, balance_after, status, game_type, description) VALUES
    (user1_id, 'deposit', 500.00, 1000.00, 1500.00, 'completed', NULL, 'Depósito inicial'),
    (user1_id, 'bet', -50.00, 1500.00, 1450.00, 'completed', 'roulette', 'Apuesta en ruleta'),
    (user1_id, 'win', 100.00, 1450.00, 1550.00, 'completed', 'roulette', 'Ganancia en ruleta'),
    (user1_id, 'bet', -30.00, 1550.00, 1520.00, 'completed', 'dice', 'Apuesta en dados'),
    (user1_id, 'win', 180.00, 1520.00, 1700.00, 'completed', 'dice', 'Ganancia en dados');

    -- Transacciones para jugador2
    INSERT INTO transactions (user_id, type, amount, balance_before, balance_after, status, game_type, description) VALUES
    (user2_id, 'deposit', 1000.00, 1000.00, 2000.00, 'completed', NULL, 'Depósito inicial'),
    (user2_id, 'bet', -100.00, 2000.00, 1900.00, 'completed', 'roulette', 'Apuesta en ruleta'),
    (user2_id, 'bet', -75.00, 1900.00, 1825.00, 'completed', 'dice', 'Apuesta en dados'),
    (user2_id, 'win', 450.00, 1825.00, 2275.00, 'completed', 'dice', 'Ganancia en dados');

    -- Transacciones para jugador3
    INSERT INTO transactions (user_id, type, amount, balance_before, balance_after, status, game_type, description) VALUES
    (user3_id, 'bet', -10.00, 500.00, 490.00, 'completed', 'slots', 'Apuesta en slots'),
    (user3_id, 'win', 500.00, 490.00, 990.00, 'completed', 'slots', 'Jackpot en slots');

END $$;

-- ================================================
-- VERIFICACIÓN DE DATOS
-- ================================================

-- Contar registros
SELECT 'Users' as tabla, COUNT(*) as total FROM users
UNION ALL
SELECT 'Game History', COUNT(*) FROM game_history
UNION ALL
SELECT 'Transactions', COUNT(*) FROM transactions;

-- Mostrar estadísticas por usuario
SELECT 
    u.username,
    u.balance,
    COUNT(gh.id) as total_games,
    COUNT(CASE WHEN gh.result = 'win' THEN 1 END) as wins,
    COUNT(CASE WHEN gh.result = 'loss' THEN 1 END) as losses
FROM users u
LEFT JOIN game_history gh ON u.id = gh.user_id
GROUP BY u.username, u.balance
ORDER BY u.username;

-- ================================================
-- NOTA IMPORTANTE
-- ================================================
-- El hash de contraseña mostrado es un ejemplo.
-- Para generar el hash real de "Test123":
-- 
-- const bcrypt = require('bcrypt');
-- const hash = await bcrypt.hash('Test123', 10);
-- console.log(hash);
-- 
-- Luego reemplazar en el INSERT de usuarios
-- ================================================
