'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Ticket } from '@/lib/types';

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/tickets')
      .then(res => res.json())
      .then(data => {
        setTickets(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredTickets = tickets.filter(ticket =>
    Object.values(ticket).some(value =>
      value.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open': return 'bg-green-200 text-green-800 border-green-400';
      case 'closed': return 'bg-gray-200 text-gray-700 border-gray-400';
      default: return 'bg-blue-200 text-blue-800 border-blue-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-200 text-red-800 border-red-400';
      case 'medium': return 'bg-yellow-200 text-yellow-800 border-yellow-400';
      case 'low': return 'bg-blue-200 text-blue-800 border-blue-400';
      default: return 'bg-gray-200 text-gray-700 border-gray-400';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Window Header */}
      <div className="bg-gradient-to-b from-green-400 to-green-500 border-3 border-black rounded-t-lg p-3 flex items-center justify-between shadow-lg mb-0">
        <div className="flex items-center space-x-2">
          <span className="text-white font-bold text-lg">● Tickets List</span>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-3 py-1 border-2 border-black rounded text-sm font-mono w-48"
          />
          <button className="w-6 h-6 bg-white border-2 border-black rounded flex items-center justify-center text-xs font-bold hover:bg-gray-100">
            ✕
          </button>
        </div>
      </div>

      <div className="bg-white border-3 border-t-0 border-black rounded-b-lg shadow-lg overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-gray-600 font-mono">Loading tickets...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-b from-gray-200 to-gray-300 border-b-2 border-gray-400">
                  <th className="p-3 text-left font-bold text-xs uppercase tracking-wider text-gray-700 border-r border-gray-300">ID</th>
                  <th className="p-3 text-left font-bold text-xs uppercase tracking-wider text-gray-700 border-r border-gray-300">Customer</th>
                  <th className="p-3 text-left font-bold text-xs uppercase tracking-wider text-gray-700 border-r border-gray-300">Subject</th>
                  <th className="p-3 text-left font-bold text-xs uppercase tracking-wider text-gray-700 border-r border-gray-300">Channel</th>
                  <th className="p-3 text-left font-bold text-xs uppercase tracking-wider text-gray-700 border-r border-gray-300">Status</th>
                  <th className="p-3 text-left font-bold text-xs uppercase tracking-wider text-gray-700 border-r border-gray-300">Priority</th>
                  <th className="p-3 text-left font-bold text-xs uppercase tracking-wider text-gray-700 border-r border-gray-300">Created</th>
                  <th className="p-3 text-left font-bold text-xs uppercase tracking-wider text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket, index) => (
                  <tr key={ticket.id} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-yellow-50 transition-colors`}>
                    <td className="p-3 text-gray-700 font-mono text-sm border-r border-gray-200">#{ticket.id}</td>
                    <td className="p-3 font-bold text-sm text-gray-800 border-r border-gray-200">{ticket.customer_name}</td>
                    <td className="p-3 text-sm text-gray-700 border-r border-gray-200">{ticket.subject}</td>
                    <td className="p-3 text-sm text-gray-600 capitalize border-r border-gray-200">{ticket.channel}</td>
                    <td className="p-3 border-r border-gray-200">
                      <span className={`px-2 py-1 rounded border-2 text-xs font-bold uppercase ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="p-3 border-r border-gray-200">
                      <span className={`px-2 py-1 rounded border-2 text-xs font-bold uppercase ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="p-3 text-xs text-gray-600 font-mono border-r border-gray-200">
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <Link
                        href={`/tickets/${ticket.id}`}
                        className="inline-block px-3 py-1 bg-blue-400 text-white border-2 border-blue-600 rounded font-bold text-xs hover:bg-blue-500 retro-button"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredTickets.length === 0 && (
              <div className="text-center py-12 text-gray-500 font-mono">
                No tickets found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
