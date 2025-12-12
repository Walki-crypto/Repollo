import React from 'react';
import { Bell, Search, Menu, User, ChevronDown } from 'lucide-react';

export const Navbar = ({ onMenuClick, user, onSearch, searchValue }) => {
    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20 backdrop-blur-sm bg-white/80">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="p-2 hover:bg-gray-100 rounded-lg lg:hidden transition-colors"
                >
                    <Menu className="w-6 h-6 text-gray-600" />
                </button>

                {/* Search Bar */}
                <div className="hidden md:flex items-center relative w-96">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3" />
                    <input
                        type="text"
                        value={searchValue}
                        onChange={(e) => onSearch && onSearch(e.target.value)}
                        placeholder="Buscar IPs, alertas o usuarios (Ctrl+K)"
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                    />
                    <div className="hidden lg:flex absolute right-2 gap-1">
                        <kbd className="px-1.5 py-0.5 text-xs font-mono bg-gray-100 text-gray-500 rounded border border-gray-200">Ctrl</kbd>
                        <kbd className="px-1.5 py-0.5 text-xs font-mono bg-gray-100 text-gray-500 rounded border border-gray-200">K</kbd>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
                {/* Organization Selector */}
                <div className="hidden sm:flex flex-col items-end mr-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Organización</span>
                    <span className="text-sm font-bold text-gray-800">Hospital General</span>
                </div>

                <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

                {/* Notifications */}
                <button className="relative p-2.5 hover:bg-gray-100 rounded-full transition-colors group">
                    <Bell className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse"></span>
                </button>

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg transition-colors border border-transparent hover:border-gray-200">
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20 ring-2 ring-white">
                        {user?.full_name?.charAt(0) || 'A'}
                    </div>
                    <div className="hidden md:block text-left">
                        <p className="text-sm font-semibold text-gray-900 leading-none">{user?.full_name || 'Admin User'}</p>
                        <p className="text-xs text-gray-500 mt-1 capitalize leading-none">{user?.role || 'Administrator'}</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
                </div>
            </div>
        </header>
    );
};
