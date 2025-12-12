import React from 'react';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { MoreVertical, Shield } from 'lucide-react';

export const IncidentTable = ({ incidents = [] }) => {
    return (
        <Card className="overflow-hidden">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <CardTitle>Incidentes Recientes</CardTitle>
                </div>
                <div className="flex gap-2">
                    <input
                        placeholder="Filtrar por IP..."
                        className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                    <button className="text-sm text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg font-medium transition-colors">
                        Ver Todos
                    </button>
                </div>
            </CardHeader>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-y border-gray-100">
                        <tr>
                            <th className="px-4 py-3">ID</th>
                            <th className="px-4 py-3">Amenaza</th>
                            <th className="px-4 py-3">Nivel</th>
                            <th className="px-4 py-3">Origen</th>
                            <th className="px-4 py-3">Estado</th>
                            <th className="px-4 py-3">Fecha</th>
                            <th className="px-4 py-3 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {incidents.length > 0 ? incidents.map((incident) => (
                            <tr key={incident.id} className="hover:bg-blue-50/50 transition-colors group">
                                <td className="px-4 py-3 font-mono text-gray-500">#{incident.id.toString().padStart(4, '0')}</td>
                                <td className="px-4 py-3">
                                    <p className="font-semibold text-gray-900">{incident.title}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{incident.classification || 'Sin clasificar'}</p>
                                </td>
                                <td className="px-4 py-3">
                                    <Badge variant={incident.threat_level}>{incident.threat_level?.toUpperCase()}</Badge>
                                </td>
                                <td className="px-4 py-3 font-mono text-gray-600">{incident.source_ip}</td>
                                <td className="px-4 py-3">
                                    <span className={`
                    inline-flex w-2 h-2 rounded-full mr-2
                    ${incident.status === 'open' ? 'bg-red-500 animate-pulse' : 'bg-green-500'}
                  `}></span>
                                    <span className="capitalize text-gray-700">{incident.status}</span>
                                </td>
                                <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                                    {new Date(incident.created_at || Date.now()).toLocaleTimeString()}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button className="p-1 hover:bg-gray-200 rounded-md text-gray-400 hover:text-gray-700 transition-colors">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="7" className="text-center py-8 text-gray-500">
                                    No hay incidentes recientes que reportar.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};
