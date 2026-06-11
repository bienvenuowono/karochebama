import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Handshake, CheckCircle, Trash2, Eye, Calendar, User, Phone, Mail, Briefcase, MapPin, MessageSquare } from 'lucide-react';

export default function PartnerApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filter, setFilter] = useState<string>('ALL'); // ALL, PROCESSED, UNPROCESSED
  const [selectedApp, setSelectedApp] = useState<any>(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      let isProcessedFilter: boolean | undefined = undefined;
      if (filter === 'PROCESSED') isProcessedFilter = true;
      if (filter === 'UNPROCESSED') isProcessedFilter = false;

      const params: any = { page, limit: 10 };
      if (isProcessedFilter !== undefined) {
        params.isProcessed = isProcessedFilter;
      }

      const res = await api.get('/partners', { params });
      if (res.data && res.data.success) {
        setApplications(res.data.data || []);
        if (res.data.pagination) {
          setTotalPages(res.data.pagination.totalPages || 1);
        }
      } else {
        setError('Format de réponse invalide');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Erreur lors de la récupération des demandes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [page, filter]);

  const handleToggleProcessed = async (id: number, currentStatus: boolean) => {
    try {
      const res = await api.patch(`/partners/${id}`, { isProcessed: !currentStatus });
      if (res.data && res.data.success) {
        fetchApplications();
        if (selectedApp && selectedApp.id === id) {
          setSelectedApp({ ...selectedApp, isProcessed: !currentStatus });
        }
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erreur lors de la mise à jour de la demande');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette demande de partenaire ?')) return;
    try {
      const res = await api.delete(`/partners/${id}`);
      if (res.data && res.data.success) {
        fetchApplications();
        if (selectedApp && selectedApp.id === id) {
          setSelectedApp(null);
        }
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erreur lors de la suppression de la demande');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-outfit">Demandes de Partenaires</h1>
          <p className="text-sm text-slate-500">Gérez les demandes d'adhésion et de partenariat reçues.</p>
        </div>

        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          <button
            onClick={() => { setFilter('ALL'); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === 'ALL' ? 'bg-primary-500 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Tous
          </button>
          <button
            onClick={() => { setFilter('UNPROCESSED'); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === 'UNPROCESSED' ? 'bg-primary-500 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            En attente
          </button>
          <button
            onClick={() => { setFilter('PROCESSED'); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === 'PROCESSED' ? 'bg-primary-500 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Traitées
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-2xl text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des candidatures */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
          {loading ? (
            <div className="flex-1 flex items-center justify-center p-8 text-slate-500">
              Chargement des demandes...
            </div>
          ) : applications.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-500">
              <Handshake className="w-12 h-12 text-slate-300 mb-3" />
              <p className="font-semibold">Aucune demande trouvée</p>
              <p className="text-xs">Les nouvelles demandes apparaîtront ici.</p>
            </div>
          ) : (
            <div className="flex-1 divide-y divide-slate-100 overflow-y-auto max-h-[600px]">
              {applications.map((app) => (
                <div
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors flex items-start gap-4 ${selectedApp?.id === app.id ? 'bg-primary-50/30 border-l-4 border-primary-500' : ''} ${!app.isProcessed ? 'bg-amber-50/20' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${!app.isProcessed ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                    <Handshake size={18} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className={`text-sm font-semibold truncate ${!app.isProcessed ? 'text-slate-900' : 'text-slate-700'}`}>
                        {app.companyName || `${app.firstName} ${app.lastName}`}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {new Date(app.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <p className="text-xs text-primary-600 font-medium mt-0.5 uppercase tracking-wide">
                      {app.partnerType}
                    </p>
                    <p className="text-xs text-slate-500 truncate mt-1">
                      {app.description}
                    </p>
                  </div>

                  <div className="flex gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleToggleProcessed(app.id, app.isProcessed)}
                      title={app.isProcessed ? 'Marquer comme en attente' : 'Marquer comme traitée'}
                      className={`p-1.5 rounded-lg border transition-colors ${app.isProcessed ? 'border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}
                    >
                      <CheckCircle size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(app.id)}
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

        {/* Détails du partenaire */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 min-h-[500px]">
          {selectedApp ? (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 font-outfit">{selectedApp.companyName || 'Demande Individuelle'}</h2>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <Calendar size={12} /> Reçu le {new Date(selectedApp.createdAt).toLocaleString('fr-FR')}
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${selectedApp.isProcessed ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {selectedApp.isProcessed ? 'Traitée' : 'En attente'}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                    <User size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Représentant</p>
                    <p className="font-semibold text-slate-800">{selectedApp.firstName} {selectedApp.lastName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                    <Briefcase size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Type de Partenaire</p>
                    <p className="font-semibold text-primary-600">{selectedApp.partnerType}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                    <Mail size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Email</p>
                    <a href={`mailto:${selectedApp.email}`} className="font-semibold text-primary-600 hover:underline">
                      {selectedApp.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                    <Phone size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Téléphone</p>
                    <a href={`tel:${selectedApp.phone}`} className="font-semibold text-slate-800 hover:underline">
                      {selectedApp.phone}
                    </a>
                  </div>
                </div>

                {selectedApp.address && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Adresse / Localisation</p>
                      <p className="font-semibold text-slate-800">{selectedApp.address}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-2 flex items-center gap-1">
                  <MessageSquare size={12} /> Description du projet & compétences
                </p>
                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {selectedApp.description}
                </p>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleToggleProcessed(selectedApp.id, selectedApp.isProcessed)}
                  className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    selectedApp.isProcessed 
                      ? 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50' 
                      : 'border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/10'
                  }`}
                >
                  <CheckCircle size={16} />
                  {selectedApp.isProcessed ? 'Marquer en attente' : 'Marquer comme traitée'}
                </button>
                <button
                  onClick={() => handleDelete(selectedApp.id)}
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
              <p className="font-semibold text-sm">Aucune demande sélectionnée</p>
              <p className="text-xs">Sélectionnez une demande dans la liste de gauche pour en afficher les détails.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
