'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Ticket } from '@/lib/types';

export default function TicketDetailPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Estado local para edição
  const [editedStatus, setEditedStatus] = useState('');
  const [editedPriority, setEditedPriority] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8000/tickets`)
        .then(res => res.json())
        .then(tickets => {
          const t = tickets.find((t: Ticket) => t.id === parseInt(id as string));
          setTicket(t);
          if (t) {
            setEditedStatus(t.status);
            setEditedPriority(t.priority);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id]);

  useEffect(() => {
    if (ticket) {
      setHasChanges(
        editedStatus !== ticket.status ||
        editedPriority !== ticket.priority
      );
    }
  }, [editedStatus, editedPriority, ticket]);

  const handleSave = async () => {
    if (!ticket || !hasChanges) return;

    setSaving(true);
    try {
      await fetch(`http://localhost:8000/tickets/${ticket.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: editedStatus,
          priority: editedPriority
        }),
      });

      // Atualiza o ticket com os novos valores
      setTicket({ ...ticket, status: editedStatus, priority: editedPriority });
      setHasChanges(false);
    } catch (err) {
      console.error('Failed to update ticket', err);
      alert('Erro ao salvar alterações!');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (ticket) {
      setEditedStatus(ticket.status);
      setEditedPriority(ticket.priority);
      setHasChanges(false);
    }
  };

  if (loading) return <div className="text-center py-12 text-gray-600 font-mono">Loading...</div>;
  if (!ticket) return <div className="text-center py-12 text-red-600 font-mono">Ticket not found</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/tickets" className="inline-block mb-4 text-blue-600 hover:text-blue-800 font-mono text-sm">
        ← Back to Tickets
      </Link>

      {/* Window Header */}
      <div className="bg-gradient-to-b from-orange-400 to-orange-500 border-3 border-black rounded-t-lg p-3 flex items-center justify-between shadow-lg mb-0">
        <div className="flex items-center space-x-2">
          <span className="text-white font-bold text-lg">● Ticket #{ticket.id}</span>
          {hasChanges && (
            <span className="px-2 py-1 bg-yellow-300 border-2 border-yellow-500 text-yellow-900 text-xs font-bold rounded animate-pulse">
              UNSAVED
            </span>
          )}
        </div>
        <button className="w-6 h-6 bg-white border-2 border-black rounded flex items-center justify-center text-xs font-bold hover:bg-gray-100">
          ✕
        </button>
      </div>

      <div className="bg-white border-3 border-t-0 border-black rounded-b-lg shadow-lg">
        {/* Ticket Information */}
        <div className="p-6 space-y-6">
          {/* Header Info */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-300 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase mb-1">Ticket ID</p>
                <p className="text-lg font-bold text-gray-800">#{ticket.id}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase mb-1">Created At</p>
                <p className="text-sm text-gray-700 font-mono">{new Date(ticket.created_at).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="border-2 border-blue-300 bg-blue-50 rounded-lg p-4">
            <h3 className="text-sm font-bold text-gray-800 uppercase mb-3 border-b-2 border-blue-200 pb-2">👤 Customer Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold text-gray-600 mb-1">Name</p>
                <p className="text-base font-bold text-gray-800">{ticket.customer_name}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-600 mb-1">Channel</p>
                <p className="text-base text-gray-700 capitalize">{ticket.channel}</p>
              </div>
            </div>
          </div>

          {/* Ticket Details */}
          <div className="border-2 border-purple-300 bg-purple-50 rounded-lg p-4">
            <h3 className="text-sm font-bold text-gray-800 uppercase mb-3 border-b-2 border-purple-200 pb-2">📋 Ticket Details</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-bold text-gray-600 mb-1">Subject</p>
                <p className="text-base font-bold text-gray-800">{ticket.subject}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-gray-600 mb-2">Current Status</p>
                  <span className={`inline-block px-3 py-1 rounded border-2 text-sm font-bold uppercase ${ticket.status === 'open' ? 'bg-green-200 text-green-800 border-green-400' : 'bg-gray-200 text-gray-700 border-gray-400'
                    }`}>
                    {ticket.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-600 mb-2">Current Priority</p>
                  <span className={`inline-block px-3 py-1 rounded border-2 text-sm font-bold uppercase ${ticket.priority === 'high' ? 'bg-red-200 text-red-800 border-red-400' :
                      ticket.priority === 'medium' ? 'bg-yellow-200 text-yellow-800 border-yellow-400' : 'bg-blue-200 text-blue-800 border-blue-400'
                    }`}>
                    {ticket.priority}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Actions */}
          <div className="border-2 border-green-300 bg-green-50 rounded-lg p-4">
            <h3 className="text-sm font-bold text-gray-800 uppercase mb-3 border-b-2 border-green-200 pb-2">⚙️ Edit Ticket</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs font-bold text-gray-700 mb-2 uppercase">Change Status:</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditedStatus('open')}
                    className={`flex-1 py-2 px-3 rounded border-2 text-sm font-bold retro-button ${editedStatus === 'open'
                        ? 'bg-green-400 border-green-600 text-white'
                        : 'bg-white border-gray-400 text-gray-700'
                      }`}
                  >
                    Open
                  </button>
                  <button
                    onClick={() => setEditedStatus('closed')}
                    className={`flex-1 py-2 px-3 rounded border-2 text-sm font-bold retro-button ${editedStatus === 'closed'
                        ? 'bg-gray-400 border-gray-600 text-white'
                        : 'bg-white border-gray-400 text-gray-700'
                      }`}
                  >
                    Closed
                  </button>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-700 mb-2 uppercase">Change Priority:</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditedPriority('low')}
                    className={`flex-1 py-2 px-2 rounded border-2 text-xs font-bold retro-button ${editedPriority === 'low' ? 'bg-blue-400 border-blue-600 text-white' : 'bg-white border-gray-400 text-gray-700'
                      }`}
                  >
                    Low
                  </button>
                  <button
                    onClick={() => setEditedPriority('medium')}
                    className={`flex-1 py-2 px-2 rounded border-2 text-xs font-bold retro-button ${editedPriority === 'medium' ? 'bg-yellow-400 border-yellow-600 text-white' : 'bg-white border-gray-400 text-gray-700'
                      }`}
                  >
                    Med
                  </button>
                  <button
                    onClick={() => setEditedPriority('high')}
                    className={`flex-1 py-2 px-2 rounded border-2 text-xs font-bold retro-button ${editedPriority === 'high' ? 'bg-red-400 border-red-600 text-white' : 'bg-white border-gray-400 text-gray-700'
                      }`}
                  >
                    High
                  </button>
                </div>
              </div>
            </div>

            {/* Save/Cancel Buttons */}
            <div className="flex gap-3 pt-3 border-t-2 border-green-200">
              <button
                onClick={handleSave}
                disabled={!hasChanges || saving}
                className={`flex-1 py-3 px-4 rounded border-2 text-sm font-bold retro-button ${hasChanges && !saving
                    ? 'bg-blue-500 border-blue-700 text-white hover:bg-blue-600'
                    : 'bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed'
                  }`}
              >
                {saving ? '💾 Saving...' : '💾 Save Changes'}
              </button>
              <button
                onClick={handleCancel}
                disabled={!hasChanges || saving}
                className={`flex-1 py-3 px-4 rounded border-2 text-sm font-bold retro-button ${hasChanges && !saving
                    ? 'bg-red-400 border-red-600 text-white hover:bg-red-500'
                    : 'bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed'
                  }`}
              >
                ✕ Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
