import React, { useState } from 'react';
import { LoginForm } from '../components/Login/LoginForm';
import { MFAVerification } from '../components/Login/MFAVerification';

export const LoginPage = ({ onLogin }) => {
    const [step, setStep] = useState(1); // 1: Login, 2: MFA
    const [tempToken, setTempToken] = useState(null);

    const handleLoginSuccess = (data) => {
        if (data.mfa_required) {
            setTempToken(data.temp_token);
            setStep(2);
        } else {
            // Direct login (si no hubiera MFA)
            onLogin(data.user);
        }
    };

    const handleMfaVerified = (data) => {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin(data.user);
    };

    return (
        <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center p-4">
            {/* Background Dinámico */}
            <div className="absolute inset-0 bg-slate-50">
                <div className="absolute inset-0 bg-[radial-gradient(at_0%_0%,rgba(59,130,246,0.15)_0px,transparent_50%)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(at_100%_100%,rgba(139,92,246,0.15)_0px,transparent_50%)]"></div>
                <div className="absolute w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            </div>

            {step === 1 ? (
                <LoginForm onSuccess={handleLoginSuccess} />
            ) : (
                <MFAVerification
                    tempToken={tempToken}
                    onVerified={handleMfaVerified}
                    onBack={() => setStep(1)}
                />
            )}
        </div>
    );
};
