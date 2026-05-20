import { useState } from 'react';
import { Briefcase, Users, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { API_BASE } from '../api';

export default function CommercialForms() {
  const [activeTab, setActiveTab] = useState<'commercial' | 'demarcheur'>('commercial');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [commercialData, setCommercialData] = useState({
    agentName: '',
    clientName: '',
    product: '',
    quantity: '',
    location: '',
    comment: ''
  });

  const [demarcheurData, setDemarcheurData] = useState({
    agentName: '',
    clientName: '', // Nom du prospect
    contact: '', // Contact du prospect
    location: '',
    product: '',
    quantity: '', // Quantité estimée
    comment: ''
  });

  const handleCommercialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await axios.post(`${API_BASE}/commercial`, {
        type: 'COMMERCIAL',
        ...commercialData
      });
      setSubmitted(true);
      setCommercialData({
        agentName: '',
        clientName: '',
        product: '',
        quantity: '',
        location: '',
        comment: ''
      });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err: any) {
      console.error('Error submitting commercial form:', err);
      setError(err.response?.data?.error || 'Une erreur est survenue lors de la soumission du formulaire.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemarcheurSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await axios.post(`${API_BASE}/commercial`, {
        type: 'DEMARCHEUR',
        ...demarcheurData
      });
      setSubmitted(true);
      setDemarcheurData({
        agentName: '',
        clientName: '',
        contact: '',
        location: '',
        product: '',
        quantity: '',
        comment: ''
      });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err: any) {
      console.error('Error submitting demarcheur form:', err);
      setError(err.response?.data?.error || 'Une erreur est survenue lors de la soumission du formulaire.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen font-sans pb-20">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200 py-16 px-4 sm:px-6 lg:px-8 mb-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6 border border-emerald-100">
            <Briefcase className="h-4 w-4" />
            Espace Commercial
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Formulaires de collecte
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
            Enregistrez vos opportunités commerciales et suivez vos prospects en toute simplicité.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab('commercial')}
              className={`flex-1 py-5 px-6 text-center font-bold text-sm transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'commercial' 
                  ? 'text-emerald-700 bg-emerald-50/50 border-b-2 border-emerald-600' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              Formulaire Commercial
            </button>
            <button
              onClick={() => setActiveTab('demarcheur')}
              className={`flex-1 py-5 px-6 text-center font-bold text-sm transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'demarcheur' 
                  ? 'text-emerald-700 bg-emerald-50/50 border-b-2 border-emerald-600' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Users className="w-4 h-4" />
              Formulaire Démarcheur
            </button>
          </div>

          <div className="p-8 md:p-12">
            {submitted && (
              <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <p className="font-medium">Formulaire soumis avec succès !</p>
              </div>
            )}

            {error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-800">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            {activeTab === 'commercial' ? (
              <form onSubmit={handleCommercialSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Nom du commercial</label>
                    <input
                      required
                      type="text"
                      disabled={submitting}
                      value={commercialData.agentName}
                      onChange={(e) => setCommercialData({ ...commercialData, agentName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Client</label>
                    <input
                      required
                      type="text"
                      disabled={submitting}
                      value={commercialData.clientName}
                      onChange={(e) => setCommercialData({ ...commercialData, clientName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow"
                      placeholder="Nom du client"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Produit</label>
                    <input
                      required
                      type="text"
                      disabled={submitting}
                      value={commercialData.product}
                      onChange={(e) => setCommercialData({ ...commercialData, product: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow"
                      placeholder="Produit concerné"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Quantité demandée</label>
                    <input
                      required
                      type="text"
                      disabled={submitting}
                      value={commercialData.quantity}
                      onChange={(e) => setCommercialData({ ...commercialData, quantity: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow"
                      placeholder="Ex: 50 Tonnes"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Localisation</label>
                  <input
                    required
                    type="text"
                    disabled={submitting}
                    value={commercialData.location}
                    onChange={(e) => setCommercialData({ ...commercialData, location: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow"
                    placeholder="Lieu de livraison ou d'activité"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Commentaire</label>
                  <textarea
                    rows={4}
                    disabled={submitting}
                    value={commercialData.comment}
                    onChange={(e) => setCommercialData({ ...commercialData, comment: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow resize-none"
                    placeholder="Détails supplémentaires..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl flex items-center justify-center transition-colors shadow-sm ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Soumettre la demande
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleDemarcheurSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Nom du démarcheur</label>
                    <input
                      required
                      type="text"
                      disabled={submitting}
                      value={demarcheurData.agentName}
                      onChange={(e) => setDemarcheurData({ ...demarcheurData, agentName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Nom du prospect</label>
                    <input
                      required
                      type="text"
                      disabled={submitting}
                      value={demarcheurData.clientName}
                      onChange={(e) => setDemarcheurData({ ...demarcheurData, clientName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow"
                      placeholder="Nom de l'entreprise ou de la personne"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Contact du prospect</label>
                    <input
                      required
                      type="text"
                      disabled={submitting}
                      value={demarcheurData.contact}
                      onChange={(e) => setDemarcheurData({ ...demarcheurData, contact: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow"
                      placeholder="Téléphone ou Email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Localisation</label>
                    <input
                      required
                      type="text"
                      disabled={submitting}
                      value={demarcheurData.location}
                      onChange={(e) => setDemarcheurData({ ...demarcheurData, location: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow"
                      placeholder="Ville, Quartier..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Produit demandé</label>
                    <input
                      required
                      type="text"
                      disabled={submitting}
                      value={demarcheurData.product}
                      onChange={(e) => setDemarcheurData({ ...demarcheurData, product: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow"
                      placeholder="Produit d'intérêt"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Quantité estimée</label>
                    <input
                      required
                      type="text"
                      disabled={submitting}
                      value={demarcheurData.quantity}
                      onChange={(e) => setDemarcheurData({ ...demarcheurData, quantity: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow"
                      placeholder="Volume potentiel"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Commentaire</label>
                  <textarea
                    rows={4}
                    disabled={submitting}
                    value={demarcheurData.comment}
                    onChange={(e) => setDemarcheurData({ ...demarcheurData, comment: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow resize-none"
                    placeholder="Notes sur l'échange, prochaines étapes..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl flex items-center justify-center transition-colors shadow-sm ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Enregistrer le prospect
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
