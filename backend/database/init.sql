-- ================================================
-- CASINO ROYAL - SCHEMA DE BASE DE DATOS POSTGRESQL
-- ================================================
-- Fecha: 2024
-- Descripción: Base de datos para plataforma de casino en línea
-- Tecnología: PostgreSQL 15+
-- ================================================
-- Nota: Este script está diseñado para ejecutarse con docker-entrypoint-initdb.d
-- La base de datos ya está creada por POSTGRES_DB en docker-compose.yml
-- ================================================

-- ================================================
-- EXTENSIONES
-- ================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- TABLA: users
-- Descripción: Almacena información de usuarios/jugadores
-- ================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_picture VARCHAR(255),
    balance DECIMAL(10, 2) DEFAULT 1000.00 NOT NULL CHECK (balance >= 0),
    is_active BOOLEAN DEFAULT TRUE,
    role VARCHAR(50) DEFAULT 'player' CHECK (role IN ('player', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para users
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_is_active ON users(is_active);

-- ================================================
-- TABLA: transactions
-- Descripción: Registra todas las transacciones financieras
-- ================================================
CREATE TYPE transaction_type AS ENUM ('bet', 'win', 'deposit', 'withdrawal');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'cancelled');

CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type transaction_type NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    balance_before DECIMAL(10, 2) NOT NULL,
    balance_after DECIMAL(10, 2) NOT NULL,
    status transaction_status DEFAULT 'completed',
    game_type VARCHAR(100),
    game_history_id UUID,
    description VARCHAR(500),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para transactions
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_game_type ON transactions(game_type);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX idx_transactions_status ON transactions(status);

-- ================================================
-- TABLA: game_history
-- Descripción: Almacena el historial de todas las partidas jugadas
-- ================================================
CREATE TYPE game_type AS ENUM ('roulette', 'poker', 'slots', 'blackjack', 'dice');
CREATE TYPE game_result AS ENUM ('win', 'loss', 'draw');

CREATE TABLE IF NOT EXISTS game_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    game_type game_type NOT NULL,
    bet_amount DECIMAL(10, 2) NOT NULL CHECK (bet_amount > 0),
    win_amount DECIMAL(10, 2) DEFAULT 0 CHECK (win_amount >= 0),
    result game_result NOT NULL,
    balance_before DECIMAL(10, 2) NOT NULL,
    balance_after DECIMAL(10, 2) NOT NULL,
    game_data JSONB,
    duration INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para game_history
CREATE INDEX idx_game_history_user_id ON game_history(user_id);
CREATE INDEX idx_game_history_game_type ON game_history(game_type);
CREATE INDEX idx_game_history_result ON game_history(result);
CREATE INDEX idx_game_history_created_at ON game_history(created_at DESC);
CREATE INDEX idx_game_history_user_game ON game_history(user_id, game_type);

-- ================================================
-- TRIGGER: Actualizar updated_at en users
-- ================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- VISTAS ÚTILES
-- ================================================

-- Vista: Estadísticas por usuario
CREATE OR REPLACE VIEW user_statistics AS
SELECT 
    u.id,
    u.username,
    u.balance,
    COUNT(gh.id) as total_games,
    COUNT(CASE WHEN gh.result = 'win' THEN 1 END) as total_wins,
    COUNT(CASE WHEN gh.result = 'loss' THEN 1 END) as total_losses,
    COALESCE(SUM(gh.bet_amount), 0) as total_bet,
    COALESCE(SUM(gh.win_amount), 0) as total_won,
    COALESCE(SUM(gh.win_amount) - SUM(gh.bet_amount), 0) as net_profit
FROM users u
LEFT JOIN game_history gh ON u.id = gh.user_id
GROUP BY u.id, u.username, u.balance;

-- Vista: Estadísticas por juego
CREATE OR REPLACE VIEW game_statistics AS
SELECT 
    game_type,
    COUNT(*) as total_plays,
    COUNT(CASE WHEN result = 'win' THEN 1 END) as total_wins,
    COUNT(CASE WHEN result = 'loss' THEN 1 END) as total_losses,
    ROUND(AVG(bet_amount), 2) as avg_bet,
    ROUND(AVG(win_amount), 2) as avg_win,
    ROUND(SUM(bet_amount), 2) as total_bet,
    ROUND(SUM(win_amount), 2) as total_won
FROM game_history
GROUP BY game_type;

-- Vista: Transacciones recientes
CREATE OR REPLACE VIEW recent_transactions AS
SELECT 
    t.id,
    t.user_id,
    u.username,
    t.type,
    t.amount,
    t.game_type,
    t.status,
    t.created_at
FROM transactions t
JOIN users u ON t.user_id = u.id
ORDER BY t.created_at DESC
LIMIT 100;

-- ================================================
-- FUNCIONES ÚTILES
-- ================================================

-- Función: Obtener top jugadores por ganancia
CREATE OR REPLACE FUNCTION get_top_players(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    user_id UUID,
    username VARCHAR,
    total_games BIGINT,
    net_profit NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.username,
        COUNT(gh.id) as total_games,
        COALESCE(SUM(gh.win_amount) - SUM(gh.bet_amount), 0) as net_profit
    FROM users u
    LEFT JOIN game_history gh ON u.id = gh.user_id
    GROUP BY u.id, u.username
    ORDER BY net_profit DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- COMENTARIOS EN TABLAS
-- ================================================
COMMENT ON TABLE users IS 'Tabla de usuarios del casino';
COMMENT ON TABLE transactions IS 'Historial de transacciones financieras';
COMMENT ON TABLE game_history IS 'Historial completo de partidas jugadas';

COMMENT ON COLUMN users.balance IS 'Saldo virtual del usuario en el casino';
COMMENT ON COLUMN transactions.metadata IS 'Información adicional en formato JSON';
COMMENT ON COLUMN game_history.game_data IS 'Detalles específicos de la partida (cartas, números, etc.)';

-- ================================================
-- FIN DEL SCRIPT
-- ================================================
