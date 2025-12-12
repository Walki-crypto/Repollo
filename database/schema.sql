-- ============================================
-- SCRIPT DE INICIALIZACIÓN: CyberMonitor RD
-- Base de datos para prototipo Zero Trust + IA
-- ============================================

-- 1. CREAR ESQUEMA PRINCIPAL
CREATE SCHEMA IF NOT EXISTS cyber_monitor;
SET search_path TO cyber_monitor, public;

-- 2. TABLA DE USUARIOS (para autenticación Zero Trust)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'analyst' CHECK (role IN ('admin', 'analyst', 'viewer')),
    mfa_secret VARCHAR(100),
    institution_id VARCHAR(100) DEFAULT 'hospital_padre_billini',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABLA DE INCIDENTES DE SEGURIDAD
CREATE TABLE IF NOT EXISTS incidents (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    threat_level VARCHAR(20) NOT NULL CHECK (threat_level IN ('low', 'medium', 'high', 'critical')),
    source_ip INET,
    destination_ip INET,
    protocol VARCHAR(50),
    port INTEGER,
    classification VARCHAR(100),
    confidence_score DECIMAL(5,2) CHECK (confidence_score >= 0 AND confidence_score <= 100),
    ia_recommendation TEXT,
    status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'closed', 'escalated')),
    assigned_to INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'
);

-- 4. TABLA DE AUDITORÍA (para trazabilidad Zero Trust)
CREATE TABLE IF NOT EXISTS audit_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id INTEGER,
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TABLA DE LOGS DE RED (datos para análisis de IA)
CREATE TABLE IF NOT EXISTS network_logs (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    source_ip INET NOT NULL,
    destination_ip INET,
    protocol VARCHAR(20),
    port INTEGER,
    packet_size INTEGER,
    flags VARCHAR(50),
    country_code VARCHAR(2),
    is_anomaly BOOLEAN DEFAULT FALSE,
    anomaly_score DECIMAL(5,2),
    processed_at TIMESTAMP WITH TIME ZONE
);

-- 6. INSERTAR USUARIO ADMINISTRADOR INICIAL
-- Contraseña: Admin123! (hash generado con bcrypt)
INSERT INTO users (email, password_hash, full_name, role) 
VALUES (
    'admin@hospital.com',
    '$2b$12$LQv3c1yqBzwZ0Jn6b1qgOe6VY2Vk7X8RZ9VXJm6fH8pLq9N0sT5uC',
    'Administrador Principal',
    'admin'
) ON CONFLICT (email) DO NOTHING;

-- 7. INSERTAR DATOS DE EJEMPLO DE INCIDENTES
INSERT INTO incidents (title, description, threat_level, source_ip, protocol, classification, confidence_score, ia_recommendation) VALUES
('Intento de fuerza bruta SSH', '25 intentos fallidos de SSH desde IP 192.168.1.100 en 2 minutos', 'high', '192.168.1.100', 'SSH', 'Brute Force Attack', 92.5, 'Bloquear IP inmediatamente y revisar logs de autenticación.'),
('Tráfico HTTP anómalo', 'Alto volumen de peticiones POST desde misma IP a endpoint /api/admin', 'critical', '10.0.0.50', 'HTTP', 'Possible DDoS/Scanner', 88.3, 'Implementar rate limiting y revisar reglas de WAF.'),
('Acceso geográficamente inusual', 'Login exitoso desde Rusia para usuario que normalmente accede desde RD', 'medium', '95.213.255.98', 'HTTPS', 'Account Compromise', 76.7, 'Forzar cambio de contraseña y habilitar MFA estricto.'),
('Escaneo de puertos detectado', 'Escaneo secuencial de puertos 22, 80, 443, 3389', 'high', '203.0.113.45', 'TCP', 'Port Scanning', 94.2, 'Bloquear IP y alertar al equipo de seguridad.'),
('Transferencia de datos masiva', '10GB transferidos fuera de horario laboral', 'critical', '172.16.0.25', 'FTP', 'Data Exfiltration', 98.1, 'Aislar sistema y comenzar investigación forense.');

-- 8. INSERTAR LOGS DE RED DE EJEMPLO (para motor de IA)
INSERT INTO network_logs (timestamp, source_ip, destination_ip, protocol, port, packet_size, country_code) VALUES
(NOW() - INTERVAL '10 minutes', '192.168.1.100', '10.0.0.1', 'TCP', 22, 1500, 'US'),
(NOW() - INTERVAL '9 minutes', '192.168.1.100', '10.0.0.1', 'TCP', 22, 1480, 'US'),
(NOW() - INTERVAL '8 minutes', '192.168.1.100', '10.0.0.1', 'TCP', 22, 1520, 'US'),
(NOW() - INTERVAL '7 minutes', '203.0.113.45', '10.0.0.50', 'HTTP', 80, 2500, 'RU'),
(NOW() - INTERVAL '6 minutes', '95.213.255.98', '10.0.0.100', 'HTTPS', 443, 3500, 'RU'),
(NOW() - INTERVAL '5 minutes', '172.16.0.25', '192.168.1.200', 'FTP', 21, 10500000, 'US');

-- 9. HABILITAR ROW LEVEL SECURITY (RLS - Zero Trust)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE network_logs ENABLE ROW LEVEL SECURITY;

-- 10. CREAR POLÍTICAS DE SEGURIDAD (Multitenancy lógico)
-- Usuarios solo ven datos de su propia institución
CREATE POLICY "Users see own institution data" ON users
    FOR SELECT USING (institution_id = current_setting('app.current_institution', TRUE));

CREATE POLICY "Users see incidents from own institution" ON incidents
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM users u 
        WHERE u.institution_id = current_setting('app.current_institution', TRUE)
    ));

-- Solo admins pueden insertar en auditoría
CREATE POLICY "Only admins insert audit logs" ON audit_log
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM users WHERE id = user_id AND role = 'admin')
    );

-- 11. CREAR ÍNDICES PARA OPTIMIZAR RENDIMIENTO
CREATE INDEX idx_incidents_threat_level ON incidents(threat_level);
CREATE INDEX idx_incidents_created_at ON incidents(created_at DESC);
CREATE INDEX idx_incidents_status ON incidents(status);
CREATE INDEX idx_network_logs_timestamp ON network_logs(timestamp DESC);
CREATE INDEX idx_network_logs_source_ip ON network_logs(source_ip);
CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at DESC);

-- 12. CREAR VISTAS ÚTILES PARA EL DASHBOARD
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM incidents WHERE threat_level = 'critical' AND created_at > NOW() - INTERVAL '24 hours') as critical_last_24h,
    (SELECT COUNT(*) FROM incidents WHERE threat_level = 'high' AND created_at > NOW() - INTERVAL '24 hours') as high_last_24h,
    (SELECT COUNT(*) FROM incidents WHERE status = 'open') as open_incidents,
    (SELECT COUNT(DISTINCT source_ip) FROM network_logs WHERE timestamp > NOW() - INTERVAL '1 hour') as unique_ips_last_hour,
    (SELECT COUNT(*) FROM network_logs WHERE is_anomaly = TRUE AND timestamp > NOW() - INTERVAL '1 hour') as anomalies_last_hour;

-- 13. HABILITAR REPLICAción EN TIEMPO REAL (para WebSockets)
ALTER PUBLICATION supabase_realtime ADD TABLE incidents;
ALTER PUBLICATION supabase_realtime ADD TABLE audit_log;

-- 14. MENSAJE DE CONFIRMACIÓN
SELECT '✅ Base de datos CyberMonitor RD inicializada correctamente' as message;
