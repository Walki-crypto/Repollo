import React, { useState } from 'react';
import {
    Home,
    ShieldAlert,
    Activity,
    FileText,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Globe
} from 'lucide-react';

export const Sidebar = ({ isCollapsed, toggleSidebar, activeSection = 'dashboard', onLogout, onNavigate }) => {
    const menuItems = [
        { id: 'dashboard', icon: Home, label: 'Dashboard' },
        { id: 'incidents', icon: ShieldAlert, label: 'Incidentes', badge: 5 },
        { id: 'threats', icon: Globe, label: 'Amenazas Globales' },
        { id: 'activity', icon: Activity, label: 'Actividad en Vivo' },
        { id: 'reports', icon: FileText, label: 'Reportes y Logs' },
    ];

    return (
        <aside
            className={`
        fixed left-0 top-0 h-screen bg-white border-r border-gray-200 z-30 transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}
        >
            {/* Logo Area */}
            <div className="h-16 flex items-center justify-center border-b border-gray-100">
                <div onClick={() => onNavigate && onNavigate('dashboard')} className={`flex items-center cursor-pointer ${isCollapsed ? 'justify-center' : 'px-6 w-full'}`}>
                    <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <ShieldAlert className="w-5 h-5 text-white" />
                    </div>
                    {!isCollapsed && (
                        <span className="ml-3 font-bold text-gray-800 text-lg whitespace-nowrap">
                            CyberMonitor
                        </span>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-2">
                {menuItems.map((item) => {
                    const isActive = activeSection === item.id;
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate && onNavigate(item.id)}
                            className={`
                w-full flex items-center p-3 rounded-xl transition-all duration-200 group relative
                ${isActive
                                    ? 'bg-blue-50 text-blue-600 shadow-sm'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
                ${isCollapsed ? 'justify-center' : ''}
              `}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'group-hover:text-gray-700'}`} />

                            {!isCollapsed && (
                                <span className="ml-3 font-medium">{item.label}</span>
                            )}

                            {/* Badge */}
                            {item.badge && (
                                <span className={`
                  absolute ${isCollapsed ? 'top-2 right-2 w-2 h-2 p-0' : 'right-3 py-0.5 px-2'}
                  bg-red-500 text-white text-xs font-bold rounded-full
                `}>
                                    {!isCollapsed && item.badge}
                                </span>
                            )}

                            {/* Tooltip for collapsed state */}
                            {isCollapsed && (
                                <div className="absolute left-full ml-4 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                                    {item.label}
                                </div>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="absolute bottom-0 w-full p-4 border-t border-gray-100 bg-gray-50/50">
                <button
                    onClick={onLogout}
                    className={`
            w-full flex items-center p-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors
            ${isCollapsed ? 'justify-center' : ''}
          `}>
                    <LogOut className="w-5 h-5" />
                    {!isCollapsed && <span className="ml-3 font-medium">Cerrar Sesión</span>}
                </button>

                <button
                    onClick={toggleSidebar}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md text-gray-500 hover:text-blue-600 transition-colors"
                >
                    {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            </div>
        </aside>
    );
};
