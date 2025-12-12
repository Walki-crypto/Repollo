# 🛡️ CyberMonitor RD

**CyberMonitor RD** es un prototipo funcional avanzado de un sistema de monitoreo de ciberseguridad basado en principios **Zero Trust** e **Inteligencia Artificial**. Diseñado para ofrecer una visualización en tiempo real de amenazas, incidentes críticos y métricas de seguridad en una interfaz moderna y profesional.

## 🚀 Características Principales

*   **Autenticación Zero Trust (Simulada):**
    *   Login moderno con efectos visuales "Glassmorphism".
    *   Verificación de Doble Factor (MFA) simulada para demostraciones fluidas.
*   **Dashboard Interactivo:**
    *   Visualización de KPIs en tiempo real (Amenazas críticas, Tasa de detección, Tiempo de respuesta).
    *   Gráficos dinámicos de actividad de red y distribución de amenazas.
    *   Simulación de "Live Data" (datos vivos) que se actualizan automáticamente.
*   **Gestión de Incidentes:**
    *   Tabla de incidentes con filtrado rápido e inteligente (Búsqueda por IP, tipo, nivel).
    *   Clasificación visual por niveles de severidad (Crítico, Alto, Medio).
*   **Experiencia de Usuario (UX/UI):**
    *   Diseño responsivo y adaptativo.
    *   Modo de navegación fluido entre módulos (Incidentes, Mapa de Amenazas, Reportes).
    *   Interfaz oscura/profesional inspirada en plataformas de seguridad de nivel militar/corporativo.

## 🛠️ Tecnologías Utilizadas

### Frontend
*   **React 18** (Vite): Motor principal de la interfaz.
*   **Tailwind CSS**: Estilizado avanzado y sistema de diseño.
*   **Chart.js**: Visualización de datos y gráficos.
*   **Lucide React**: Iconografía moderna.

### Backend (Simulación Prototipo)
*   **FastAPI (Python)**: Estructura base preparada para escalabilidad real.
*   *Nota: En este prototipo, la lógica de autenticación y datos ha sido adaptada al cliente para facilitar la demostración sin dependencia de base de datos.*

## 📋 Requisitos Previos

Para ejecutar este proyecto localmente necesitas tener instalado:
*   [Node.js](https://nodejs.org/) (v16 o superior)
*   [Python](https://www.python.org/) (v3.8 o superior)

## ⚡ Instalación y Ejecución Rápida

Este proyecto incluye un script de automatización para Windows.

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/Walki-crypto/Repollo.git
    cd Repollo
    ```

2.  **Iniciar todo el sistema:**
    Haz doble clic en el archivo `start.bat` o ejecútalo desde la terminal:
    ```bash
    .\start.bat
    ```
    *Este script instalará automáticamente las dependencias de Python y Node.js si faltan, y levantará ambos servidores.*

3.  **Acceder:**
    Abrirá automáticamente tu navegador en: `http://localhost:3000`

## 🔑 Credenciales de Acceso (Demo)

El sistema está configurado en **Modo Prototipo** para facilitar el acceso:

*   **Usuario/Correo:** Cualquier correo válido (ej: `admin@cyber.com`)
*   **Contraseña:** Cualquiera (ej: `1234`)
*   **Código MFA:** `123456`

## � Capturas

*(Puedes agregar aquí capturas de pantalla de tu dashboard)*

---
Desarrollado con ❤️ para CyberMonitor RD.
