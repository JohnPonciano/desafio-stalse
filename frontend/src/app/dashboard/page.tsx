'use client';

import { useState, useEffect } from 'react';

interface Metrics {
    total_tickets: number;
    priority_counts: Record<string, number>;
    type_counts: Record<string, number>;
    queue_counts: Record<string, number>;
    language_counts: Record<string, number>;
}

export default function DashboardPage() {
    const [metrics, setMetrics] = useState<Metrics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:8000/metrics')
            .then(res => res.json())
            .then(data => {
                setMetrics(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch metrics:', err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="text-center py-12 text-gray-600 font-mono">Loading dashboard...</div>;
    if (!metrics) return <div className="text-center py-12 text-red-600 font-mono">Failed to load metrics.</div>;

    return (
        <div className="max-w-6xl mx-auto">
            {/* Window Header */}
            <div className="bg-gradient-to-b from-blue-400 to-blue-500 border-3 border-black rounded-t-lg p-3 flex items-center justify-between shadow-lg mb-0">
                <div className="flex items-center space-x-2">
                    <span className="text-white font-bold text-lg">● Dashboard Overview</span>
                </div>
                <button className="w-6 h-6 bg-white border-2 border-black rounded flex items-center justify-center text-xs font-bold hover:bg-gray-100">
                    ✕
                </button>
            </div>

            <div className="bg-white border-3 border-t-0 border-black rounded-b-lg p-6 shadow-lg mb-6">
                {/* Main Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-pink-100 to-pink-200 border-3 border-pink-400 rounded-lg p-4 shadow-md">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-gray-700 text-xs font-bold uppercase tracking-wider">Total Tickets</h2>
                            <span className="text-2xl">🎫</span>
                        </div>
                        <p className="text-4xl font-bold text-gray-800">{metrics.total_tickets}</p>
                        <p className="text-xs text-pink-700 mt-1">↑ 12% this month</p>
                    </div>

                    <div className="bg-gradient-to-br from-red-100 to-red-200 border-3 border-red-400 rounded-lg p-4 shadow-md">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-gray-700 text-xs font-bold uppercase tracking-wider">High Priority</h2>
                            <span className="text-2xl">🔥</span>
                        </div>
                        <p className="text-4xl font-bold text-gray-800">{metrics.priority_counts['high'] || 0}</p>
                        <p className="text-xs text-red-700 mt-1">Needs attention!</p>
                    </div>
                </div>

                {/* Detailed Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Priority Distribution */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-3 border-purple-300 rounded-lg p-4 shadow-md">
                        <h2 className="text-sm font-bold text-gray-800 mb-3 border-b-2 border-purple-300 pb-2">📊 Priority Distribution</h2>
                        <div className="space-y-3">
                            {Object.entries(metrics.priority_counts).slice(0, 5).map(([key, value]) => (
                                <div key={key} className="bg-white border-2 border-gray-300 rounded p-2">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="capitalize text-gray-800 font-bold text-sm">{key}</span>
                                        <span className="text-gray-600 text-xs">{value}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 border border-gray-400">
                                        <div
                                            className={`h-full rounded-full ${key === 'high' ? 'bg-red-500' :
                                                    key === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                                                }`}
                                            style={{ width: `${(value / metrics.total_tickets) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Types */}
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-3 border-yellow-300 rounded-lg p-4 shadow-md">
                        <h2 className="text-sm font-bold text-gray-800 mb-3 border-b-2 border-yellow-300 pb-2">🏆 Top Ticket Types</h2>
                        <div className="space-y-2">
                            {Object.entries(metrics.type_counts).slice(0, 5).map(([key, value], index) => (
                                <div key={key} className="flex items-center justify-between p-2 bg-white border-2 border-gray-300 rounded">
                                    <div className="flex items-center space-x-2">
                                        <span className="w-6 h-6 flex items-center justify-center bg-yellow-200 border-2 border-yellow-400 rounded text-xs font-bold">
                                            {index + 1}
                                        </span>
                                        <span className="capitalize text-gray-800 font-medium text-sm">{key}</span>
                                    </div>
                                    <span className="font-bold text-yellow-700">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Queues */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 border-3 border-green-300 rounded-lg p-4 shadow-md">
                        <h2 className="text-sm font-bold text-gray-800 mb-3 border-b-2 border-green-300 pb-2">📋 Queue Volume</h2>
                        <div className="space-y-2">
                            {Object.entries(metrics.queue_counts).slice(0, 5).map(([key, value]) => (
                                <div key={key} className="flex justify-between items-center p-2 bg-white border-2 border-gray-300 rounded">
                                    <span className="capitalize text-gray-800 text-sm">{key}</span>
                                    <span className="px-2 py-1 bg-green-200 text-green-800 border-2 border-green-400 rounded text-xs font-bold">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Languages */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-3 border-blue-300 rounded-lg p-4 shadow-md">
                        <h2 className="text-sm font-bold text-gray-800 mb-3 border-b-2 border-blue-300 pb-2">🌐 Languages</h2>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(metrics.language_counts).slice(0, 8).map(([key, value]) => (
                                <div key={key} className="px-3 py-1 bg-blue-200 text-blue-800 border-2 border-blue-400 rounded-full text-xs font-bold">
                                    {key.toUpperCase()} ({value})
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
