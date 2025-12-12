import React from 'react';

const variantStyles = {
    critical: "bg-red-50 text-red-700 border-red-200 ring-red-500/10",
    high: "bg-orange-50 text-orange-700 border-orange-200 ring-orange-500/10",
    medium: "bg-yellow-50 text-yellow-700 border-yellow-200 ring-yellow-500/10",
    low: "bg-green-50 text-green-700 border-green-200 ring-green-500/10",
    info: "bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/10",
    neutral: "bg-gray-50 text-gray-600 border-gray-200 ring-gray-500/10",
    cyber: "bg-slate-800 text-cyan-400 border-cyan-900/50 shadow-[0_0_10px_rgba(34,211,238,0.2)]"
};

export const Badge = ({
    children,
    variant = 'neutral',
    className = '',
    icon: Icon
}) => {
    return (
        <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
      border ring-1 ring-inset transition-colors duration-200
      ${variantStyles[variant] || variantStyles.neutral} 
      ${className}
    `}>
            {Icon && <Icon className="w-3 h-3 mr-1" />}
            {children}
        </span>
    );
};
