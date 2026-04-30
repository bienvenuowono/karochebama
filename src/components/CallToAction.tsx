import { Link } from 'react-router-dom';

export default function CallToAction() {
  return (
    <div className="bg-[#1a2b3c] py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-extrabold text-white mb-6">Prêt à transformer votre agro-business ?</h2>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          Que vous soyez un agriculteur cherchant à étendre son marché ou un acheteur à la recherche de fournisseurs fiables, Karochebama est votre plateforme.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            to="/devenir-partenaire"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg transition-all hover:-translate-y-0.5"
          >
            Devenir partenaire
          </Link>
          <Link 
            to="/marketplace"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-xl text-gray-900 bg-white hover:bg-gray-100 shadow-lg transition-all hover:-translate-y-0.5"
          >
            Commencer à Acheter
          </Link>
        </div>
      </div>
    </div>
  );
}
