import React from 'react';
import { Card } from '../ui/Card';
import { ArrowUp, ArrowDown } from 'lucide-react';

export const KPIWidget = ({ title, value, subtext, icon: Icon, color, trend }) => {
    const isPositive = trend > 0;

    const colorStyles = {
        red: "bg-red-50 text-red-600",
        green: "bg-green-50 text-green-600",
        blue: "bg-blue-50 text-blue-600",
        yellow: "bg-yellow-50 text-yellow-600",
        orange: "bg-orange-50 text-orange-600"
    };

    return (
        <Card className="hover:scale-[1.02] active:scale-[0.98]">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{value}</h3>
                </div>
                <div className={`p-3 rounded-lg ${colorStyles[color] || colorStyles.blue}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
                <div className={`flex items-center text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                    <span>{Math.abs(trend)}% vs mes anterior</span>
                </div>
                <div className="text-xs text-gray-400 font-medium">
                    {subtext}
                </div>
            </div>

            {/* Mini Sparkline Simulation */}
            <div className="mt-3 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${color === 'red' ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${Math.random() * 40 + 40}%` }}></div>
            </div>
        </Card>
    );
};
