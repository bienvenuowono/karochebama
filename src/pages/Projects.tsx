import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Calendar, CheckCircle2, Sprout, Building, Fish, Leaf } from 'lucide-react';

export default function Projects() {
  const featuredProjects = [
    {
      id: 'extension-ambam',
      title: 'Extension du Site Agricole Ambam',
      summary: 'Développement majeur de nos capacités de production sur le site du Sud Cameroun avec de nouvelles techniques agro-écologiques.',
      category: 'Agriculture',
      location: 'Ambam, Sud Cameroun',
      status: 'En cours',
      img: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c6c13?auto=format&fit=crop&w=1200&q=80',
      icon: Sprout,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      id: 'site-niete',
      title: 'Site Agricole de Niété',
      summary: 'Mise en place d\'une exploitation agricole moderne intégrée, combinant cultures vivrières et de rente pour le marché local et international.',
      category: 'Agro-industrie',
      location: 'Niété, Sud Cameroun',
      status: 'Réalisé',
      img: 'https://images.unsplash.com/photo-1500937386664-56d1dfefcb0c?auto=format&fit=crop&w=1200&q=80',
      icon: Building,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    }
  ];

  const projects = [
    {
      id: 'pisciculture-kribi',
      title: 'Complexe Piscicole de Kribi',
      description: 'Construction de bassins modernes pour l\'élevage de poissons d\'eau douce, visant à réduire les importations.',
      category: 'Pisciculture',
      location: 'Kribi, Sud Cameroun',
      status: 'En cours',
      img: 'https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?auto=format&fit=crop&w=800&q=80',
      icon: Fish,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'transformation-manioc',
      title: 'Usine de Transformation de Manioc',
      description: 'Création d\'une unité de transformation semi-industrielle pour la production de farine de manioc de haute qualité.',
      category: 'Agro-industrie',
      location: 'Ebolowa, Sud Cameroun',
      status: 'À venir',
      img: 'https://images.unsplash.com/photo-1605640840482-d5481d582d77?auto=format&fit=crop&w=800&q=80',
      icon: Building,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    },
    {
      id: 'pepiniere-hevea',
      title: 'Pépinière Communautaire d\'Hévéa',
      description: 'Mise en place d\'une pépinière pour fournir des plants de qualité aux agriculteurs locaux et soutenir la filière hévéa.',
      category: 'Agriculture',
      location: 'Meyomessala, Sud Cameroun',
      status: 'Réalisé',
      img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
      icon: Leaf,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    }
  ];

  const categories = [
    'Tous les projets',
    'Agriculture',
    'Pisciculture',
    'Agro-industrie',
    'Infrastructures',
    'Programmes de développement'
  ];

  return (
    <div className="bg-[#f8f9fa] min-h-screen font-sans pb-20">
      
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200 py-20 px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6 border border-emerald-100">
            <CheckCircle2 className="h-4 w-4" />
            Nos Réalisations
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
            Projets
          </h1>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
            Cette page présente les projets majeurs agricoles, agro-industriels et de développement menés par notre entreprise. Découvrez comment nous transformons l'agriculture locale.
          </p>
        </div>
      </div>

      {/* Featured Projects Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Projets Phares</h2>
            <p className="text-gray-500">Nos initiatives les plus impactantes</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {featuredProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300">
              <div className="relative h-72 overflow-hidden">
                <img 
                  src={project.img} 
                  alt={project.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  referrerPolicy="no-referrer" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm uppercase tracking-wider flex items-center gap-1.5">
                  <project.icon className={`h-3.5 w-3.5 ${project.color}`} />
                  {project.category}
                </div>
                
                <div className="absolute top-4 right-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                  {project.status}
                </div>

                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <div className="flex items-center text-sm text-gray-300 mb-2">
                    <MapPin className="h-4 w-4 mr-1.5" /> {project.location}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <p className="text-gray-600 leading-relaxed mb-6 flex-1">
                  {project.summary}
                </p>
                <Link 
                  to={`/projet/${project.id}`}
                  className="inline-flex items-center justify-center w-full px-6 py-3 text-sm font-bold rounded-xl text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                >
                  Voir le projet <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Filter (Visual only for now) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat, idx) => (
            <button 
              key={idx}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                idx === 0 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300">
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={project.img} 
                  alt={project.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  referrerPolicy="no-referrer" 
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-900 text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm uppercase tracking-wider flex items-center gap-1">
                  <project.icon className={`h-3 w-3 ${project.color}`} />
                  {project.category}
                </div>
                <div className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm ${
                  project.status === 'En cours' ? 'bg-blue-500 text-white' : 
                  project.status === 'Réalisé' ? 'bg-emerald-500 text-white' : 
                  'bg-amber-500 text-white'
                }`}>
                  {project.status}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{project.title}</h3>
                
                <div className="flex items-center text-xs text-gray-500 mb-4">
                  <MapPin className="h-3.5 w-3.5 mr-1" /> {project.location}
                </div>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                  {project.description}
                </p>
                
                <div className="pt-4 border-t border-gray-100 mt-auto">
                  <Link 
                    to={`/projet/${project.id}`}
                    className="inline-flex items-center text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors group-hover:translate-x-1 duration-300"
                  >
                    Voir les détails <ArrowRight className="ml-1.5 h-4 w-4" />
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
                Devenez partenaire de notre croissance
              </h2>
              <p className="text-lg text-gray-400">
                Vous souhaitez investir dans l'agriculture durable, collaborer sur nos projets ou en savoir plus sur nos activités ? Contactez-nous dès aujourd'hui.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0">
              <Link 
                to="/nos-activites"
                className="inline-flex items-center justify-center px-6 py-4 text-sm font-bold rounded-xl text-gray-900 bg-white hover:bg-gray-100 shadow-lg transition-all hover:-translate-y-0.5"
              >
                Activités
              </Link>
              <Link 
                to="/contact"
                className="inline-flex items-center justify-center px-6 py-4 text-sm font-bold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg transition-all hover:-translate-y-0.5"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
