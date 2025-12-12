import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Shield, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import axios from 'axios';

export const LoginForm = ({ onSuccess }) => {
    const [email, setEmail] = useState('admin@hospital.com');
    const [password, setPassword] = useState('Admin123!');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // SIMULACIÓN DE PROTOTIPO (Frontend Only)
        setTimeout(() => {
            // Aceptar cualquier correo validando formato básico
            if (email.includes('@')) {
                onSuccess({
                    mfa_required: true, // Simular flujo completo
                    temp_token: email,
                    user: {
                        email: email,
                        full_name: 'Usuario Prototipo',
                        role: 'Analista'
                    }
                });
            } else {
                setError('Por favor ingresa un correo válido.');
            }
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="w-full max-w-md animate-fade-in">
            <div className="text-center mb-8">
                <div className="relative inline-block">
                    <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
                    <div className="relative bg-white p-4 rounded-2xl shadow-lg mb-4 inline-flex">
                        <Shield className="w-10 h-10 text-blue-600" />
                    </div>
                </div>
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-700">
                    Bienvenido de nuevo
                </h2>
                <p className="text-gray-500 mt-2">Accede a tu panel de monitoreo Zero Trust</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50">
                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm flex items-center border border-red-100">
                        <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Correo Corporativo</label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                placeholder="nombre@hospital.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Contraseña</label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center text-gray-500 cursor-pointer hover:text-gray-700 transition-colors">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2" />
                        Recordar este dispositivo
                    </label>
                    <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">¿Olvidaste tu contraseña?</a>
                </div>

                <Button
                    type="submit"
                    variant="cyber"
                    className="w-full h-12 text-lg shadow-blue-500/25"
                    isLoading={isLoading}
                    icon={ArrowRight}
                >
                    {isLoading ? 'Verificando...' : 'Continuar'}
                </Button>
            </form>

            <p className="text-center mt-8 text-sm text-gray-400">
                Protegido por CyberMonitor RD v1.0
            </p>
        </div>
    );
};
