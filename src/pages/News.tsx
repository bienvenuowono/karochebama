import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Newspaper } from 'lucide-react';

export default function News() {
  const news = [
    {
      id: 1,
      title: 'Lancement de notre nouvelle plateforme agro-industrielle',
      excerpt: 'Découvrez comment Karochebama révolutionne la distribution agricole avec sa nouvelle marketplace B2B.',
      date: '15 Mars 2024',
      category: 'Entreprise',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 2,
      title: 'Partenariat stratégique avec les coopératives locales',
      excerpt: 'Nous renforçons nos liens avec les producteurs locaux pour garantir une qualité optimale.',
      date: '10 Mars 2024',
      category: 'Partenariat',
      image: 'https://images.unsplash.com/photo-1595856345917-f370a4427027?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 3,
      title: 'Innovation dans nos techniques d\'irrigation',
      excerpt: 'Mise en place de nouveaux systèmes d\'irrigation intelligents pour préserver nos ressources en eau.',
      date: '5 Mars 2024',
      category: 'Innovation',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8ed7450951?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 4,
      title: 'Formation des jeunes agriculteurs',
      excerpt: 'Karochebama lance son programme de formation pour la nouvelle génération d\'agriculteurs.',
      date: '28 Février 2024',
      category: 'Formation',
      image: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c6c13?auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <div className="bg-[#f8f9fa] min-h-screen font-sans pb-20">
      {/* Hero Section */}
      <div className="bg-[#1a2b3c] py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-500/20 rounded-2xl mb-6">
            <Newspaper className="h-8 w-8 text-emerald-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
            Actualités <span className="text-emerald-400">Karochebama</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Restez informé de nos dernières innovations, partenariats et événements.
          </p>
        </div>
      </div>

      {/* News Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group flex flex-col">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                    {item.category}
                  </span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <Calendar className="h-4 w-4 mr-2 text-emerald-600" />
                  {item.date}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-700 transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-6 line-clamp-3 flex-grow">
                  {item.excerpt}
                </p>
                <Link 
                  to={`/actualite/${item.id}`}
                  className="inline-flex items-center text-emerald-600 font-semibold hover:text-emerald-700 transition-colors mt-auto"
                >
                  Lire la suite
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
