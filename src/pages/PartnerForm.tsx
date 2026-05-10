import { useState } from 'react';
import { Handshake, Send, CheckCircle2 } from 'lucide-react';

export default function PartnerForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Nom complet / Raison sociale</label>
                <input required type="text" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow" placeholder="Votre nom ou celui de votre entreprise" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Type de partenariat</label>
                <select required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow bg-white">
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
                <input required type="email" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow" placeholder="votre@email.com" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Téléphone</label>
                <input required type="tel" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow" placeholder="+237 ..." />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Localisation / Zone d'activité</label>
              <input required type="text" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow" placeholder="Ville, Région, Pays" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Description de votre activité</label>
              <textarea required rows={5} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow resize-none" placeholder="Décrivez brièvement votre activité, vos produits ou services, et ce que vous attendez de ce partenariat..."></textarea>
            </div>

            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl flex items-center justify-center transition-colors shadow-sm">
              <Send className="w-5 h-5 mr-2" />
              Envoyer la demande
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
