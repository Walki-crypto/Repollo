import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';
import axios from 'axios';

export const MFAVerification = ({ tempToken, onVerified, onBack }) => {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const inputsRef = useRef([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutos

    // Focus en el primer input al montar
    useEffect(() => {
        inputsRef.current[0]?.focus();
    }, []);

    // Timer
    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [timeLeft]);

    const handleChange = (index, value) => {
        // Solo números
        if (!/^\d*$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Auto-focus siguiente
        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }

        // Auto-submit si está completo
        if (index === 5 && value && newCode.every(v => v !== '')) {
            // Opcional: trigger submit
        }
    };

    const handleKeyDown = (index, e) => {
        // Backspace para volver al anterior
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);
        if (!/^\d+$/.test(pastedData)) return;

        const digits = pastedData.split('');
        const newCode = [...code];
        digits.forEach((digit, i) => {
            if (i < 6) newCode[i] = digit;
        });
        setCode(newCode);

        // Focus al final
        const focusIndex = Math.min(digits.length, 5);
        inputsRef.current[focusIndex]?.focus();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // SIMULACIÓN DE PROTOTIPO
        setTimeout(() => {
            const fullCode = code.join('');
            if (fullCode === '123456') {
                onVerified({
                    access_token: 'mock_token_xyz',
                    user: {
                        email: tempToken,
                        full_name: `Usuario ${tempToken.split('@')[0]}`,
                        role: 'Analista de Seguridad'
                    }
                });
            } else {
                setError('Código incorrecto. Usa 123456 (Demo)');
            }
            setIsLoading(false);
        }, 1000);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="w-full max-w-md animate-fade-in">
            <div className="bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/50 text-center">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
                    <ShieldCheck className="w-8 h-8 text-blue-600" />
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">Verificación en Dos Pasos</h2>
                <p className="text-gray-500 mb-8 text-sm">
                    Ingresa el código de 6 dígitos enviado a tu dispositivo seguro.
                    <br /><span className="text-blue-600 font-mono mt-2 block">(Demo: 123456)</span>
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="flex justify-center gap-2 mb-8" onPaste={handlePaste}>
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                ref={el => inputsRef.current[index] = el}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-12 h-14 text-center text-2xl font-bold bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                            />
                        ))}
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded-lg">{error}</p>
                    )}

                    <Button
                        type="submit"
                        variant="cyber"
                        className="w-full h-12 text-lg mb-4"
                        isLoading={isLoading}
                        disabled={code.some(c => !c)}
                    >
                        Verificar Acceso
                    </Button>

                    <div className="flex items-center justify-between text-sm">
                        <button
                            type="button"
                            onClick={onBack}
                            className="text-gray-500 hover:text-gray-700 flex items-center"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Volver
                        </button>

                        <button
                            type="button"
                            className="text-blue-600 hover:text-blue-700 font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={timeLeft > 0}
                        >
                            <RefreshCw className={`w-4 h-4 mr-1 ${timeLeft > 0 ? 'animate-spin-slow' : ''}`} />
                            {timeLeft > 0 ? `Reenviar en ${formatTime(timeLeft)}` : 'Reenviar código'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
