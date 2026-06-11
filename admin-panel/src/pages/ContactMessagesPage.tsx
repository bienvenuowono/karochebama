import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Mail, CheckCircle, Trash2, Eye, Calendar, User, Phone, MessageSquare } from 'lucide-react';

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filter, setFilter] = useState<string>('ALL'); // ALL, READ, UNREAD
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      let isReadFilter: boolean | undefined = undefined;
      if (filter === 'READ') isReadFilter = true;
      if (filter === 'UNREAD') isReadFilter = false;

      const params: any = { page, limit: 10 };
      if (isReadFilter !== undefined) {
        params.isRead = isReadFilter;
      }

      const res = await api.get('/contact', { params });
      if (res.data && res.data.success) {
        setMessages(res.data.data || []);
        if (res.data.pagination) {
          setTotalPages(res.data.pagination.totalPages || 1);
        }
      } else {
        setError('Format de réponse invalide');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Erreur lors de la récupération des messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [page, filter]);

  const handleToggleRead = async (id: number, currentStatus: boolean) => {
    try {
      const res = await api.patch(`/contact/${id}`, { isRead: !currentStatus });
      if (res.data && res.data.success) {
        fetchMessages();
        if (selectedMessage && selectedMessage.id === id) {
          setSelectedMessage({ ...selectedMessage, isRead: !currentStatus });
        }
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erreur lors de la mise à jour du message');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) return;
    try {
      const res = await api.delete(`/contact/${id}`);
      if (res.data && res.data.success) {
        fetchMessages();
        if (selectedMessage && selectedMessage.id === id) {
          setSelectedMessage(null);
        }
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erreur lors de la suppression du message');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-outfit">Messages de Contact</h1>
          <p className="text-sm text-slate-500">Gérez les demandes de contact reçues depuis le site public.</p>
        </div>

        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          <button
            onClick={() => { setFilter('ALL'); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === 'ALL' ? 'bg-primary-500 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Tous
          </button>
          <button
            onClick={() => { setFilter('UNREAD'); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === 'UNREAD' ? 'bg-primary-500 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Non lus
          </button>
          <button
            onClick={() => { setFilter('READ'); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === 'READ' ? 'bg-primary-500 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Lus
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-2xl text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des messages */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
          {loading ? (
            <div className="flex-1 flex items-center justify-center p-8 text-slate-500">
              Chargement des messages...
            </div>
          ) : messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-500">
              <Mail className="w-12 h-12 text-slate-300 mb-3" />
              <p className="font-semibold">Aucun message trouvé</p>
              <p className="text-xs">Les nouveaux messages apparaîtront ici.</p>
            </div>
          ) : (
            <div className="flex-1 divide-y divide-slate-100 overflow-y-auto max-h-[600px]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors flex items-start gap-4 ${selectedMessage?.id === msg.id ? 'bg-primary-50/30 border-l-4 border-primary-500' : ''} ${!msg.isRead ? 'bg-blue-50/20' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${!msg.isRead ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                    <Mail size={18} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className={`text-sm font-semibold truncate ${!msg.isRead ? 'text-slate-900' : 'text-slate-700'}`}>
                        {msg.name}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {new Date(msg.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <p className={`text-xs truncate mt-0.5 ${!msg.isRead ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>
                      {msg.subject}
                    </p>
                    <p className="text-xs text-slate-400 truncate mt-1">
                      {msg.message}
                    </p>
                  </div>

                  <div className="flex gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleToggleRead(msg.id, msg.isRead)}
                      title={msg.isRead ? 'Marquer comme non lu' : 'Marquer comme lu'}
                      className={`p-1.5 rounded-lg border transition-colors ${msg.isRead ? 'border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}
                    >
                      <CheckCircle size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(msg.id)}
                      title="Supprimer"
                      className="p-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50/50">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
              >
                Précédent
              </button>
              <span className="text-xs text-slate-500 font-medium">
                Page {page} sur {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
              >
                Suivant
              </button>
            </div>
          )}
        </div>

        {/* Détails du message */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 min-h-[500px]">
          {selectedMessage ? (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 font-outfit">{selectedMessage.subject}</h2>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <Calendar size={12} /> Reçu le {new Date(selectedMessage.createdAt).toLocaleString('fr-FR')}
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${selectedMessage.isRead ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                  {selectedMessage.isRead ? 'Lu' : 'Non lu'}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                    <User size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Expéditeur</p>
                    <p className="font-semibold text-slate-800">{selectedMessage.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                    <Mail size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Email</p>
                    <a href={`mailto:${selectedMessage.email}`} className="font-semibold text-primary-600 hover:underline">
                      {selectedMessage.email}
                    </a>
                  </div>
                </div>

                {selectedMessage.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                      <Phone size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Téléphone</p>
                      <a href={`tel:${selectedMessage.phone}`} className="font-semibold text-slate-800 hover:underline">
                        {selectedMessage.phone}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-2 flex items-center gap-1">
                  <MessageSquare size={12} /> Message
                </p>
                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.message}
                </p>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleToggleRead(selectedMessage.id, selectedMessage.isRead)}
                  className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    selectedMessage.isRead 
                      ? 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50' 
                      : 'border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/10'
                  }`}
                >
                  <CheckCircle size={16} />
                  {selectedMessage.isRead ? 'Marquer non lu' : 'Marquer comme lu'}
                </button>
                <button
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="py-2.5 px-4 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center justify-center gap-2 text-xs font-bold"
                >
                  <Trash2 size={16} />
                  Supprimer
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center">
              <Eye className="w-12 h-12 text-slate-200 mb-3" />
              <p className="font-semibold text-sm">Aucun message sélectionné</p>
              <p className="text-xs">Sélectionnez un message dans la liste de gauche pour en afficher les détails.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
