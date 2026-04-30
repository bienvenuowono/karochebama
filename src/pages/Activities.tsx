import { Link } from 'react-router-dom';
import { Sprout, Fish, Truck, Factory, Beef, Store, ArrowRight, Mail, Handshake } from 'lucide-react';

export default function Activities() {
  const activities = [
    {
      id: 'agriculture',
      title: 'Production Agricole',
      description: 'Nous cultivons des produits de haute qualité (plantain, hévéa, macabo, etc.) en respectant les normes environnementales pour garantir une agriculture durable et performante.',
      icon: Sprout,
      img: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c6c13?auto=format&fit=crop&w=800&q=80',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      id: 'pisciculture',
      title: 'Pisciculture & Aquaculture',
      description: 'Notre pôle d\'innovation aquacole met en valeur les ressources halieutiques continentales pour offrir une alimentation saine, traçable et respectueuse de l\'écosystème.',
      icon: Fish,
      img: 'https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?auto=format&fit=crop&w=800&q=80',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'agro-industrie',
      title: 'Agro-industrie & Transformation',
      description: 'De la récolte à la table, nous transformons nos matières premières agricoles pour leur donner une nouvelle vie et une forte valeur ajoutée sur les marchés locaux et internationaux.',
      icon: Factory,
      img: 'https://images.unsplash.com/photo-1605640840482-d5481d582d77?auto=format&fit=crop&w=800&q=80',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    },
    {
      id: 'distribution',
      title: 'Distribution de Produits Agricoles',
      description: 'Un réseau logistique optimisé pour acheminer nos récoltes et produits transformés directement vers les consommateurs et les professionnels, en garantissant fraîcheur et qualité.',
      icon: Truck,
      img: 'https://images.unsplash.com/photo-1586528116311-ad8ed7450951?auto=format&fit=crop&w=800&q=80',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      id: 'elevage',
      title: 'Activités d\'Élevage',
      description: 'Développement de filières d\'élevage modernes et responsables, assurant le bien-être animal et fournissant des produits carnés de premier choix.',
      icon: Beef,
      img: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80',
      color: 'text-rose-600',
      bgColor: 'bg-rose-50'
    },
    {
      id: 'marketplace',
      title: 'Services Marketplace',
      description: 'Une plateforme numérique innovante connectant directement les producteurs locaux aux acheteurs, facilitant les transactions sécurisées et transparentes.',
      icon: Store,
      img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    }
  ];

  return (
    <div className="bg-[#f8f9fa] min-h-screen font-sans pb-20">
      
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200 py-20 px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6 border border-emerald-100">
            <Sprout className="h-4 w-4" />
            Notre Expertise
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
            Activités
          </h1>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
            Découvrez nos grands pôles d’expertise au service d’une agriculture durable, innovante et performante. Chez Karochebama, nous couvrons l'ensemble de la chaîne de valeur agro-pastorale.
          </p>
        </div>
      </div>

      {/* Activities Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map((activity) => (
            <div 
              key={activity.id} 
              className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300"
            >
              {/* Image Area */}
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={activity.img} 
                  alt={activity.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  referrerPolicy="no-referrer" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
                <div className={`absolute top-4 right-4 ${activity.bgColor} ${activity.color} p-3 rounded-2xl shadow-sm backdrop-blur-md bg-white/90`}>
                  <activity.icon className="h-6 w-6" />
                </div>
              </div>
              
              {/* Content Area */}
              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                  {activity.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6 flex-1">
                  {activity.description}
                </p>
                
                <div className="pt-6 border-t border-gray-100 mt-auto">
                  <Link 
                    to="/contact" 
                    className="inline-flex items-center text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors group-hover:translate-x-1 duration-300"
                  >
                    En savoir plus <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1a2b3c] rounded-[2.5rem] overflow-hidden shadow-2xl relative">
          <div className="absolute inset-0 opacity-10">
            <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M0 40L40 0H20L0 20M40 40V20L20 40" stroke="currentColor" strokeWidth="2" fill="none"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-pattern)"/>
            </svg>
          </div>
          
          <div className="relative p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-2xl text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                Prêt à collaborer avec nous ?
              </h2>
              <p className="text-lg text-gray-400">
                Que vous souhaitiez explorer notre marketplace, devenir partenaire ou simplement nous contacter pour un projet, notre équipe est à votre disposition.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0">
              <Link 
                to="/marketplace"
                className="inline-flex items-center justify-center px-6 py-4 text-sm font-bold rounded-xl text-gray-900 bg-white hover:bg-gray-100 shadow-lg transition-all hover:-translate-y-0.5"
              >
                <Store className="mr-2 h-5 w-5" />
                Marketplace
              </Link>
              <Link 
                to="/contact"
                className="inline-flex items-center justify-center px-6 py-4 text-sm font-bold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg transition-all hover:-translate-y-0.5"
              >
                <Mail className="mr-2 h-5 w-5" />
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
