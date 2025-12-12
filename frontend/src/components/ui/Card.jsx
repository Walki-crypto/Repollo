import React from 'react';

export const Card = ({
    children,
    className = '',
    noPadding = false,
    variant = 'default',
    ...props
}) => {
    const baseStyles = "relative overflow-hidden transition-all duration-300";

    const variants = {
        default: "bg-white border border-gray-100 shadow-sm",
        elevated: "bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-gray-100",
        glass: "bg-white/70 backdrop-blur-xl border border-white/50 shadow-lg",
        cyber: "bg-slate-900 border border-slate-700 text-white shadow-2xl shadow-blue-900/10",
        interactive: "bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md cursor-pointer group"
    };

    return (
        <div
            className={`${baseStyles} ${variants[variant]} ${!noPadding ? 'p-6' : ''} rounded-xl ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export const CardHeader = ({ children, className = '' }) => (
    <div className={`mb-4 flex items-center justify-between ${className}`}>
        {children}
    </div>
);

export const CardTitle = ({ children, className = '' }) => (
    <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
        {children}
    </h3>
);
