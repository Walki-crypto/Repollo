import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ArcElement
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { Card, CardHeader, CardTitle } from '../ui/Card';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ArcElement
);

// ACTIVITY CHART
export const ActivityChart = () => {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top', labels: { usePointStyle: true, boxWidth: 8 } },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#1e293b',
                bodyColor: '#475569',
                borderColor: '#e2e8f0',
                borderWidth: 1,
                padding: 10,
            }
        },
        scales: {
            y: {
                grid: { color: '#f1f5f9' },
                border: { dash: [4, 4] },
                ticks: { color: '#94a3b8' }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#94a3b8' }
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    };

    const data = {
        labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
        datasets: [
            {
                label: 'Tráfico Normal',
                data: [65, 59, 80, 81, 56, 55, 40],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Amenazas Bloqueadas',
                data: [28, 48, 40, 19, 86, 27, 90],
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.05)',
                fill: true,
                borderDash: [5, 5],
                tension: 0.4,
            },
        ],
    };

    return (
        <Card className="h-[400px]">
            <CardHeader>
                <CardTitle>Actividad de Red (24h)</CardTitle>
                <select className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 outline-none">
                    <option>Últimas 24h</option>
                    <option>7 días</option>
                    <option>30 días</option>
                </select>
            </CardHeader>
            <div className="h-[320px] w-full">
                <Line options={options} data={data} />
            </div>
        </Card>
    );
};

// DONUT CHART
export const ThreatDistributionChart = () => {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'right' },
        },
        cutout: '70%',
    };

    const data = {
        labels: ['Malware', 'Phishing', 'DDoS', 'Intrusión', 'Otros'],
        datasets: [
            {
                data: [12, 19, 3, 5, 2],
                backgroundColor: [
                    '#ef4444', // Red
                    '#f97316', // Orange
                    '#eab308', // Yellow
                    '#3b82f6', // Blue
                    '#94a3b8', // Slate
                ],
                borderWidth: 0,
            },
        ],
    };

    return (
        <Card className="h-[400px]">
            <CardHeader>
                <CardTitle>Distribución de Amenazas</CardTitle>
            </CardHeader>
            <div className="h-[320px] w-full relative">
                <Doughnut options={options} data={data} />
                <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                    <span className="text-3xl font-bold text-gray-800">1,248</span>
                    <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Total</span>
                </div>
            </div>
        </Card>
    );
};
