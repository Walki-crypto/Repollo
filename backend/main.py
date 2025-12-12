# backend/main.py
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta
from typing import Optional, List
import logging
from dotenv import load_dotenv
import os

# Cargar variables de entorno
load_dotenv()

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Crear aplicación FastAPI
app = FastAPI(
    title="CyberMonitor RD API",
    description="API para el sistema de monitoreo de seguridad Zero Trust",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configurar CORS (permite comunicación con frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configurar OAuth2
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# Variables de configuración
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "fallback_secret_key_change_in_production")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "15"))

# ==================== ENDPOINTS BÁSICOS ====================

@app.get("/")
async def root():
    """Endpoint raíz - información básica"""
    return {
        "message": "Bienvenido a CyberMonitor RD API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health")
async def health_check():
    """Verificar estado del sistema"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "CyberMonitor RD API",
        "environment": os.getenv("APP_ENVIRONMENT", "development")
    }

@app.get("/api/info")
async def system_info():
    """Información del sistema"""
    return {
        "system": "CyberMonitor RD",
        "architecture": "Zero Trust + IA",
        "components": ["FastAPI Backend", "React Frontend", "PostgreSQL", "Scikit-learn"],
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }

# ==================== ENDPOINTS DE AUTENTICACIÓN ====================

@app.post("/api/auth/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login de usuario - Zero Trust"""
    # Permitir cualquier usuario/contraseña para demo
    logger.info(f"Login attempt for user: {form_data.username}")
    
    # Generar código MFA simulado
    mfa_code = "123456"  # En producción sería generado aleatoriamente
    
    return {
        "message": "MFA requerido",
        "mfa_required": True,
        "temp_token": form_data.username, # Usamos el username como token temporal para demo
        "mfa_code": mfa_code if os.getenv("MFA_SIMULATION_ENABLED", "True") == "True" else None
    }

@app.post("/api/auth/verify-mfa")
async def verify_mfa(code: str, temp_token: str):
    """Verificación MFA - Segundo factor"""
    if code != "123456":  # Simulación
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Código MFA incorrecto"
        )
    
    # El temp_token es el email en esta demo
    user_email = temp_token
    
    # Generar token JWT real
    from jose import jwt
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = jwt.encode(
        {
            "sub": user_email,
            "role": "admin",
            "exp": datetime.utcnow() + access_token_expires
        },
        JWT_SECRET_KEY,
        algorithm=ALGORITHM
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "email": user_email,
            "full_name": f"Usuario {user_email.split('@')[0]}",
            "role": "Analista de Seguridad"
        }
    }

# ==================== ENDPOINTS DE INCIDENTES ====================

@app.get("/api/incidents")
async def get_incidents(
    token: str = Depends(oauth2_scheme),
    status_filter: Optional[str] = None,
    threat_level: Optional[str] = None,
    limit: int = 50
):
    """Obtener lista de incidentes"""
    # Verificar token
    from jose import jwt, JWTError
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado"
        )
    
    # Datos simulados (en producción vendrían de Supabase)
    incidents = [
        {
            "id": 1,
            "title": "Intento de fuerza bruta SSH",
            "description": "25 intentos fallidos de SSH desde IP 192.168.1.100",
            "threat_level": "high",
            "source_ip": "192.168.1.100",
            "protocol": "SSH",
            "classification": "Brute Force Attack",
            "confidence_score": 92.5,
            "status": "open",
            "created_at": "2025-01-15T10:30:00Z",
            "ia_recommendation": "Bloquear IP inmediatamente"
        },
        {
            "id": 2,
            "title": "Tráfico HTTP anómalo",
            "description": "Alto volumen de peticiones POST a endpoint /api/admin",
            "threat_level": "critical",
            "source_ip": "10.0.0.50",
            "protocol": "HTTP",
            "classification": "Possible DDoS",
            "confidence_score": 88.3,
            "status": "in_progress",
            "created_at": "2025-01-15T09:15:00Z",
            "ia_recommendation": "Implementar rate limiting"
        },
        {
            "id": 3,
            "title": "Acceso geográficamente inusual",
            "description": "Login desde Rusia para usuario local",
            "threat_level": "medium",
            "source_ip": "95.213.255.98",
            "protocol": "HTTPS",
            "classification": "Account Compromise",
            "confidence_score": 76.7,
            "status": "open",
            "created_at": "2025-01-15T08:45:00Z",
            "ia_recommendation": "Forzar cambio de contraseña"
        }
    ]
    
    # Aplicar filtros
    if status_filter:
        incidents = [i for i in incidents if i["status"] == status_filter]
    if threat_level:
        incidents = [i for i in incidents if i["threat_level"] == threat_level]
    
    return {"incidents": incidents[:limit], "count": len(incidents)}

# ==================== ENDPOINTS DE DETECCIÓN DE AMENAZAS ====================

@app.post("/api/threats/detect")
async def detect_threat(
    log_data: dict,
    token: str = Depends(oauth2_scheme)
):
    """Detectar amenazas usando motor de IA"""
    # Verificar token
    from jose import jwt, JWTError
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado"
        )
    
    # Simulación de análisis con IA
    import random
    threat_score = random.uniform(0.1, 0.95)
    is_threat = threat_score > 0.85
    
    recommendations = [
        "Bloquear IP y revisar logs",
        "Notificar al equipo de seguridad",
        "Incrementar logging en el endpoint",
        "Revisar configuración de firewall"
    ]
    
    return {
        "detection_result": {
            "is_threat": is_threat,
            "threat_score": round(threat_score, 3),
            "classification": "Possible Intrusion" if is_threat else "Normal Traffic",
            "confidence": round(threat_score * 100, 1),
            "ia_recommendation": random.choice(recommendations) if is_threat else "No action required",
            "timestamp": datetime.now().isoformat()
        },
        "log_analyzed": log_data
    }

@app.get("/api/dashboard/stats")
async def get_dashboard_stats(token: str = Depends(oauth2_scheme)):
    """Estadísticas para el dashboard"""
    # Verificar token
    from jose import jwt, JWTError
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado"
        )
    
    # Datos simulados del dashboard
    import random
    return {
        "kpis": {
            "total_incidents": random.randint(50, 150),
            "open_incidents": random.randint(5, 25),
            "critical_threats": random.randint(1, 10),
            "detection_rate": round(random.uniform(85, 99), 1),
            "avg_response_time": random.randint(5, 30),
            "false_positives": random.randint(1, 15)
        },
        "threat_distribution": {
            "critical": random.randint(1, 10),
            "high": random.randint(5, 20),
            "medium": random.randint(10, 30),
            "low": random.randint(20, 50)
        },
        "top_threats": [
            {"type": "Brute Force", "count": random.randint(10, 30)},
            {"type": "DDoS", "count": random.randint(5, 15)},
            {"type": "Malware", "count": random.randint(3, 10)},
            {"type": "Phishing", "count": random.randint(8, 25)}
        ]
    }

# ==================== WEBSOCKETS PARA TIEMPO REAL ====================

from fastapi import WebSocket, WebSocketDisconnect
import asyncio

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except:
                pass

manager = ConnectionManager()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Mantener conexión abierta
            await asyncio.sleep(10)
            await websocket.send_json({
                "type": "heartbeat",
                "timestamp": datetime.now().isoformat()
            })
    except WebSocketDisconnect:
        manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
