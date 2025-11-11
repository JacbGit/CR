-- ================================================
-- CASINO ROYAL - QUERIES SQL ÚTILES
-- ================================================

-- ================================================
-- CONSULTAS DE USUARIOS
-- ================================================

-- Ver todos los usuarios con su saldo
SELECT 
    id,
    username,
    first_name || ' ' || last_name as nombre_completo,
    email,
    balance,
    role,
    is_active,
    created_at
FROM users
ORDER BY balance DESC;

-- Top 10 jugadores por saldo
SELECT 
    username,
    balance,
    created_at
FROM users
WHERE is_active = true
ORDER BY balance DESC
LIMIT 10;

-- Buscar usuario por username o email
SELECT * FROM users 
WHERE username = 'jugador1' OR email = 'jugador1@example.com';

-- Contar usuarios activos vs inactivos
SELECT 
    is_active,
    COUNT(*) as total,
    ROUND(AVG(balance), 2) as saldo_promedio
FROM users
GROUP BY is_active;

-- ================================================
-- CONSULTAS DE JUEGOS
-- ================================================

-- Historial de juegos de un usuario específico
SELECT 
    game_type,
    bet_amount,
    win_amount,
    result,
    balance_after,
    game_data,
    created_at
FROM game_history
WHERE user_id = (SELECT id FROM users WHERE username = 'jugador1')
ORDER BY created_at DESC
LIMIT 20;

-- Estadísticas generales por juego
SELECT 
    game_type,
    COUNT(*) as total_partidas,
    COUNT(CASE WHEN result = 'win' THEN 1 END) as victorias,
    COUNT(CASE WHEN result = 'loss' THEN 1 END) as derrotas,
    ROUND(AVG(bet_amount), 2) as apuesta_promedio,
    ROUND(SUM(bet_amount), 2) as total_apostado,
    ROUND(SUM(win_amount), 2) as total_ganado,
    ROUND((COUNT(CASE WHEN result = 'win' THEN 1 END)::float / COUNT(*)) * 100, 2) as porcentaje_victoria
FROM game_history
GROUP BY game_type
ORDER BY total_partidas DESC;

-- Últimas 50 partidas de todos los usuarios
SELECT 
    u.username,
    gh.game_type,
    gh.bet_amount,
    gh.win_amount,
    gh.result,
    gh.created_at
FROM game_history gh
JOIN users u ON gh.user_id = u.id
ORDER BY gh.created_at DESC
LIMIT 50;

-- Partidas con mayores ganancias
SELECT 
    u.username,
    gh.game_type,
    gh.bet_amount,
    gh.win_amount,
    (gh.win_amount - gh.bet_amount) as ganancia_neta,
    gh.created_at
FROM game_history gh
JOIN users u ON gh.user_id = u.id
WHERE gh.result = 'win'
ORDER BY gh.win_amount DESC
LIMIT 10;

-- Actividad por día de la semana
SELECT 
    TO_CHAR(created_at, 'Day') as dia_semana,
    COUNT(*) as total_partidas,
    ROUND(AVG(bet_amount), 2) as apuesta_promedio
FROM game_history
GROUP BY TO_CHAR(created_at, 'Day'), EXTRACT(DOW FROM created_at)
ORDER BY EXTRACT(DOW FROM created_at);

-- Juegos jugados en las últimas 24 horas
SELECT 
    u.username,
    gh.game_type,
    COUNT(*) as partidas
FROM game_history gh
JOIN users u ON gh.user_id = u.id
WHERE gh.created_at >= NOW() - INTERVAL '24 hours'
GROUP BY u.username, gh.game_type
ORDER BY partidas DESC;

-- ================================================
-- CONSULTAS DE TRANSACCIONES
-- ================================================

-- Ver todas las transacciones de un usuario
SELECT 
    type,
    amount,
    balance_before,
    balance_after,
    status,
    game_type,
    description,
    created_at
FROM transactions
WHERE user_id = (SELECT id FROM users WHERE username = 'jugador1')
ORDER BY created_at DESC;

-- Resumen de transacciones por tipo
SELECT 
    type,
    COUNT(*) as cantidad,
    ROUND(SUM(ABS(amount)), 2) as total,
    ROUND(AVG(ABS(amount)), 2) as promedio
FROM transactions
WHERE status = 'completed'
GROUP BY type
ORDER BY total DESC;

-- Depósitos y retiros del último mes
SELECT 
    u.username,
    t.type,
    SUM(t.amount) as total
FROM transactions t
JOIN users u ON t.user_id = u.id
WHERE t.type IN ('deposit', 'withdrawal')
  AND t.created_at >= NOW() - INTERVAL '30 days'
GROUP BY u.username, t.type
ORDER BY total DESC;

-- Balance de apuestas vs ganancias por usuario
SELECT 
    u.username,
    ROUND(SUM(CASE WHEN t.type = 'bet' THEN ABS(t.amount) ELSE 0 END), 2) as total_apostado,
    ROUND(SUM(CASE WHEN t.type = 'win' THEN t.amount ELSE 0 END), 2) as total_ganado,
    ROUND(SUM(CASE WHEN t.type = 'win' THEN t.amount ELSE 0 END) - 
          SUM(CASE WHEN t.type = 'bet' THEN ABS(t.amount) ELSE 0 END), 2) as ganancia_neta
FROM transactions t
JOIN users u ON t.user_id = u.id
WHERE t.status = 'completed'
GROUP BY u.username
ORDER BY ganancia_neta DESC;

-- ================================================
-- ESTADÍSTICAS AVANZADAS
-- ================================================

-- Perfil completo de jugador
SELECT 
    u.username,
    u.balance,
    COUNT(DISTINCT gh.id) as total_partidas,
    COUNT(DISTINCT CASE WHEN gh.result = 'win' THEN gh.id END) as victorias,
    ROUND((COUNT(DISTINCT CASE WHEN gh.result = 'win' THEN gh.id END)::float / 
           NULLIF(COUNT(DISTINCT gh.id), 0)) * 100, 2) as tasa_victoria,
    ROUND(AVG(gh.bet_amount), 2) as apuesta_promedio,
    ROUND(SUM(gh.bet_amount), 2) as total_apostado,
    ROUND(SUM(gh.win_amount), 2) as total_ganado,
    ROUND(SUM(gh.win_amount) - SUM(gh.bet_amount), 2) as ganancia_neta,
    STRING_AGG(DISTINCT gh.game_type::text, ', ') as juegos_jugados
FROM users u
LEFT JOIN game_history gh ON u.id = gh.user_id
WHERE u.username = 'jugador1'
GROUP BY u.username, u.balance;

-- Ranking de jugadores por ganancias
SELECT 
    ROW_NUMBER() OVER (ORDER BY SUM(gh.win_amount) - SUM(gh.bet_amount) DESC) as ranking,
    u.username,
    u.balance,
    COUNT(gh.id) as partidas,
    ROUND(SUM(gh.win_amount) - SUM(gh.bet_amount), 2) as ganancia_neta
FROM users u
JOIN game_history gh ON u.id = gh.user_id
GROUP BY u.username, u.balance
ORDER BY ganancia_neta DESC
LIMIT 20;

-- Juego más popular por hora del día
SELECT 
    EXTRACT(HOUR FROM created_at) as hora,
    game_type,
    COUNT(*) as partidas
FROM game_history
GROUP BY EXTRACT(HOUR FROM created_at), game_type
ORDER BY hora, partidas DESC;

-- Racha de victorias/derrotas
WITH ranked_games AS (
    SELECT 
        user_id,
        result,
        created_at,
        LAG(result) OVER (PARTITION BY user_id ORDER BY created_at) as prev_result
    FROM game_history
)
SELECT 
    u.username,
    rg.result,
    COUNT(*) as racha_consecutiva
FROM ranked_games rg
JOIN users u ON rg.user_id = u.id
WHERE rg.result = rg.prev_result OR rg.prev_result IS NULL
GROUP BY u.username, rg.result, rg.user_id
ORDER BY racha_consecutiva DESC
LIMIT 10;

-- Promedio de ganancia por tipo de juego y usuario
SELECT 
    u.username,
    gh.game_type,
    COUNT(*) as partidas,
    ROUND(AVG(gh.win_amount - gh.bet_amount), 2) as ganancia_promedio_por_partida
FROM game_history gh
JOIN users u ON gh.user_id = u.id
GROUP BY u.username, gh.game_type
HAVING COUNT(*) >= 5
ORDER BY ganancia_promedio_por_partida DESC;

-- ================================================
-- CONSULTAS DE MANTENIMIENTO
-- ================================================

-- Ver tamaño de las tablas
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Índices y su uso
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan as index_scans,
    pg_size_pretty(pg_relation_size(indexrelid)) as index_size
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- Usuarios sin actividad reciente (30 días)
SELECT 
    u.username,
    u.email,
    u.balance,
    MAX(gh.created_at) as ultima_partida
FROM users u
LEFT JOIN game_history gh ON u.id = gh.user_id
GROUP BY u.username, u.email, u.balance
HAVING MAX(gh.created_at) < NOW() - INTERVAL '30 days' OR MAX(gh.created_at) IS NULL
ORDER BY ultima_partida DESC NULLS LAST;

-- Limpiar partidas antiguas (ejemplo - NO ejecutar sin precaución)
-- DELETE FROM game_history WHERE created_at < NOW() - INTERVAL '90 days';

-- ================================================
-- BACKUP Y EXPORTACIÓN
-- ================================================

-- Exportar datos de un usuario específico
COPY (
    SELECT * FROM users WHERE username = 'jugador1'
) TO '/tmp/usuario_backup.csv' WITH CSV HEADER;

-- Exportar historial de juegos
COPY (
    SELECT 
        u.username,
        gh.*
    FROM game_history gh
    JOIN users u ON gh.user_id = u.id
    WHERE gh.created_at >= NOW() - INTERVAL '30 days'
) TO '/tmp/historial_mes.csv' WITH CSV HEADER;

-- ================================================
-- FIN DE QUERIES
-- ================================================
