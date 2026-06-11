import { useState } from 'react';
import { Handshake, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { API_BASE } from '../api';

export default function PartnerForm() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [partnerData, setPartnerData] = useState({
    name: '',
    type: '',
    email: '',
    phone: '',
    location: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await axios.post(`${API_BASE}/partners`, partnerData);
      setSubmitted(true);
      setPartnerData({
        name: '',
        type: '',
        email: '',
        phone: '',
        location: '',
        description: ''
      });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err: any) {
      console.error('Error submitting partner form:', err);
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
            <Handshake className="h-4 w-4" />
            Partenariat
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Devenir partenaire
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
            Rejoignez notre réseau de producteurs et partenaires pour développer votre activité agricole avec Karochebama.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden p-8 md:p-12">
          {submitted && (
            <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <p className="font-medium">Votre demande de partenariat a été soumise avec succès ! Notre équipe vous contactera sous peu.</p>
            </div>
          )}

          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-800">
              <AlertCircle className="w-5 h-5 text-red-600 animate-bounce" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Nom complet / Raison sociale</label>
                <input
                  required
                  type="text"
                  disabled={submitting}
                  value={partnerData.name}
                  onChange={(e) => setPartnerData({ ...partnerData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow"
                  placeholder="Votre nom ou celui de votre entreprise"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Type de partenariat</label>
                <select
                  required
                  disabled={submitting}
                  value={partnerData.type}
                  onChange={(e) => setPartnerData({ ...partnerData, type: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow bg-white"
                >
                  <option value="">Sélectionnez un type</option>
                  <option value="producteur">Producteur agricole</option>
                  <option value="distributeur">Distributeur / Revendeur</option>
                  <option value="logistique">Partenaire logistique</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Email</label>
                <input
                  required
                  type="email"
                  disabled={submitting}
                  value={partnerData.email}
                  onChange={(e) => setPartnerData({ ...partnerData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow"
                  placeholder="votre@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Téléphone</label>
                <input
                  required
                  type="tel"
                  disabled={submitting}
                  value={partnerData.phone}
                  onChange={(e) => setPartnerData({ ...partnerData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow"
                  placeholder="+237 ..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Localisation / Zone d'activité</label>
              <input
                required
                type="text"
                disabled={submitting}
                value={partnerData.location}
                onChange={(e) => setPartnerData({ ...partnerData, location: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow"
                placeholder="Ville, Région, Pays"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Description de votre activité</label>
              <textarea
                required
                rows={5}
                disabled={submitting}
                value={partnerData.description}
                onChange={(e) => setPartnerData({ ...partnerData, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow resize-none"
                placeholder="Décrivez brièvement votre activité, vos produits ou services, et ce que vous attendez de ce partenariat..."
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
                  Envoyer la demande
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
