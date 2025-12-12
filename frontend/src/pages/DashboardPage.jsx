import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Dashboard/Sidebar';
import { Navbar } from '../components/Dashboard/Navbar';
import { KPIWidget } from '../components/Dashboard/KPIWidget';
import { ActivityChart, ThreatDistributionChart } from '../components/Dashboard/Charts';
import { IncidentTable } from '../components/Dashboard/IncidentTable';
import { AlertTriangle, Fingerprint, Clock, Activity, Map as MapIcon } from 'lucide-react';
import { Card } from '../components/ui/Card';

export const DashboardPage = ({ user, handleLogout }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('dashboard');

    const [stats, setStats] = useState({
        kpis: {
            critical_threats: 12,
            detection_rate: 98.2,
            avg_response_time: 4.5,
            total_events: 12480
        },
        threat_distribution: { critical: 5, high: 15, medium: 30, low: 50 },
        top_threats: [
            { type: "Brute Force", count: 24 },
            { type: "Malware", count: 12 },
            { type: "Phishing", count: 35 }
        ]
    });

    const [incidents, setIncidents] = useState(Array(8).fill(null).map((_, i) => ({
        id: i + 1,
        title: i % 2 === 0 ? "Intento de SQL Injection" : "Acceso inusual detectado",
        description: "Actividad sospechosa detectada en firewall perimetral",
        threat_level: i === 0 ? "critical" : i === 1 ? "high" : "medium",
        source_ip: `192.168.1.${100 + i}`,
        classification: "Intrusión",
        ia_recommendation: "Bloquear IP y rotar credenciales",
        status: "open",
        created_at: new Date().toISOString()
    })));

    // Simulación de "Live Data" para el prototipo
    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => ({
                ...prev,
                kpis: {
                    ...prev.kpis,
                    critical_threats: Math.max(0, prev.kpis.critical_threats + (Math.random() > 0.5 ? 1 : -1)),
                    total_events: prev.kpis.total_events + Math.floor(Math.random() * 10)
                }
            }));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // Filtrar incidentes según búsqueda
    const filteredIncidents = incidents.filter(inc =>
        inc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inc.source_ip.includes(searchTerm) ||
        inc.threat_level.includes(searchTerm)
    );

    return (
        <div className="bg-gray-50 min-h-screen">
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                onLogout={handleLogout}
                activeSection={activeTab}
                onNavigate={setActiveTab}
            />

            <div
                className={`transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}
            >
                <Navbar
                    user={user}
                    onMenuClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    searchValue={searchTerm}
                    onSearch={setSearchTerm}
                />

                <main className="p-6 lg:p-8 max-w-[1920px] mx-auto space-y-8 animate-fade-in">

                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 capitalize">
                                {activeTab === 'dashboard' ? 'Panel de Control' : activeTab}
                            </h1>
                            <p className="text-gray-500">
                                {activeTab === 'dashboard' ? 'Resumen de seguridad en tiempo real' : 'Vista detallada'}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="flex items-center text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200 animate-pulse">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                Sistema Operativo
                            </span>
                            <span className="text-sm text-gray-400">Última act: Hace 1m</span>
                        </div>
                    </div>

                    {/* VISTA DASHBOARD (resumen completo) */}
                    {activeTab === 'dashboard' && (
                        <>
                            {/* KPI Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                                <KPIWidget
                                    title="Amenazas Críticas"
                                    value={stats.kpis.critical_threats}
                                    subtext="Requieren atención inmediata"
                                    icon={AlertTriangle}
                                    color="red"
                                    trend={12}
                                />
                                <KPIWidget
                                    title="Tasa de Detección"
                                    value={`${stats.kpis.detection_rate}%`}
                                    subtext="Objetivo: >99%"
                                    icon={Fingerprint}
                                    color="blue"
                                    trend={2.4}
                                />
                                <KPIWidget
                                    title="Tiempo de Respuesta"
                                    value={`${stats.kpis.avg_response_time}m`}
                                    subtext="Promedio últimas 24h"
                                    icon={Clock}
                                    color="orange"
                                    trend={-15}
                                />
                                <KPIWidget
                                    title="Eventos Analizados"
                                    value="12.4k"
                                    subtext="Eventos por minuto: 450"
                                    icon={Activity}
                                    color="green"
                                    trend={8}
                                />
                            </div>

                            {/* Charts Row */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto">
                                <div className="lg:col-span-2">
                                    <ActivityChart />
                                </div>
                                <div>
                                    <ThreatDistributionChart />
                                </div>
                            </div>

                            {/* Bottom Section: Map & Table */}
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                                <div className="xl:col-span-2">
                                    <IncidentTable incidents={filteredIncidents} />
                                </div>
                                <div>
                                    <Card className="h-full min-h-[400px]">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="font-bold text-gray-900">Mapa de Amenazas</h3>
                                            <MapIcon className="text-gray-400 w-5 h-5" />
                                        </div>
                                        <div className="w-full h-[300px] bg-slate-900 rounded-xl relative overflow-hidden group cursor-crosshair">
                                            <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-cover bg-center"></div>
                                            <div className="absolute top-[30%] left-[20%] w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                                            <div className="absolute top-[30%] left-[20%] w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
                                            <div className="absolute top-[40%] right-[30%] w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                                            <div className="absolute bottom-[30%] right-[20%] w-2 h-2 bg-yellow-400 rounded-full"></div>
                                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
                                            <div className="absolute bottom-4 left-4 right-4">
                                                <div className="bg-white/10 backdrop-blur-md p-3 rounded-lg border border-white/10 text-xs text-white">
                                                    <p className="font-mono">Detectado: <span className="text-red-400">192.168.1.100</span> (USA)</p>
                                                    <p className="text-gray-400">Hace 5 segundos</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        </>
                    )}

                    {/* VISTA INCIDENTES (Solo tabla expandida) */}
                    {activeTab === 'incidents' && (
                        <div className="h-full">
                            <IncidentTable incidents={filteredIncidents} />
                        </div>
                    )}

                    {/* VISTA ACTIVIDAD (Solo Gráficos) */}
                    {activeTab === 'activity' && (
                        <div className="grid grid-cols-1 gap-6">
                            <ActivityChart />
                            <div className="grid grid-cols-2 gap-6">
                                <ThreatDistributionChart />
                                <KPIWidget title="Eventos hoy" value="12,500" icon={Activity} color="blue" trend={5} />
                            </div>
                        </div>
                    )}

                    {/* VISTA AMENAZAS (Mapa grande) */}
                    {activeTab === 'threats' && (
                        <Card className="h-[600px] bg-slate-900 text-white border-slate-700">
                            <div className="h-full flex items-center justify-center">
                                <p className="text-2xl text-slate-500">Vista Global de Amenazas (Expandida)</p>
                                {/* Aquí iría el mapa a pantalla completa */}
                            </div>
                        </Card>
                    )}

                    {/* OTROS (Placeholder) */}
                    {(activeTab === 'reports') && (
                        <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-xl">
                            <p className="text-gray-400">Módulo en construcción: {activeTab}</p>
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
};
