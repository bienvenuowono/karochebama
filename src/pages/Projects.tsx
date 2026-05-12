import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Calendar, CheckCircle2, Sprout, Building, Fish, Leaf, Loader2 } from 'lucide-react';
import axios from 'axios';
import { API_BASE, API_URL } from '../api';

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/projects`);
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('agriculture')) return Sprout;
    if (t.includes('pisciculture') || t.includes('poisson')) return Fish;
    if (t.includes('infrastructure') || t.includes('usine') || t.includes('bâtiment')) return Building;
    if (t.includes('plantation')) return Leaf;
    return Building;
  };

  const featuredProjects = projects.filter(p => p.status === 'ONGOING').slice(0, 2);
  const otherProjects = projects.filter(p => !featuredProjects.find(fp => fp.id === p.id));

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

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
          <p className="text-gray-500 font-medium">Chargement des projets...</p>
        </div>
      ) : projects.length > 0 ? (
        <>
          {/* Featured Projects Section */}
          {featuredProjects.length > 0 && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
              <div className="flex justify-between items-end mb-10">
                <div>
                  <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Projets Phares</h2>
                  <p className="text-gray-500">Nos initiatives les plus impactantes</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {featuredProjects.map((project) => {
                  const Icon = getIcon(project.title);
                  return (
                    <div key={project.id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300">
                      <div className="relative h-72 overflow-hidden">
                        <img 
                          src={project.imageUrl ? (project.imageUrl.startsWith('http') ? project.imageUrl : `${API_URL}${project.imageUrl}`) : 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c6c13?auto=format&fit=crop&w=1200&q=80'} 
                          alt={project.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                          referrerPolicy="no-referrer" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                        
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm uppercase tracking-wider flex items-center gap-1.5">
                          <Icon className={`h-3.5 w-3.5 text-emerald-600`} />
                          {project.title.length > 20 ? project.title.substring(0, 20) + '...' : project.title}
                        </div>
                        
                        <div className="absolute top-4 right-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                          {project.status === 'ONGOING' ? 'En cours' : (project.status === 'COMPLETED' ? 'Réalisé' : 'Planifié')}
                        </div>

                        <div className="absolute bottom-0 left-0 p-6 w-full">
                          <div className="flex items-center text-sm text-gray-300 mb-2">
                            <MapPin className="h-4 w-4 mr-1.5" /> Cameroun
                          </div>
                          <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                        </div>
                      </div>
                      
                      <div className="p-6 flex flex-col flex-1">
                        <p className="text-gray-600 leading-relaxed mb-6 flex-1 line-clamp-3">
                          {project.description}
                        </p>
                        <Link 
                          to={`/projet/${project.id}`}
                          className="inline-flex items-center justify-center w-full px-6 py-3 text-sm font-bold rounded-xl text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                        >
                          Voir le projet <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Projects Grid */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Tous nos projets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(otherProjects.length > 0 ? otherProjects : projects).map((project) => {
                const Icon = getIcon(project.title);
                return (
                  <div key={project.id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300">
                    <div className="relative h-56 overflow-hidden">
                      <img 
                        src={project.imageUrl ? (project.imageUrl.startsWith('http') ? project.imageUrl : `${API_URL}${project.imageUrl}`) : 'https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?auto=format&fit=crop&w=800&q=80'} 
                        alt={project.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                        referrerPolicy="no-referrer" 
                      />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-900 text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm uppercase tracking-wider flex items-center gap-1">
                        <Icon className={`h-3 w-3 text-emerald-600`} />
                        Projet
                      </div>
                      <div className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm ${
                        project.status === 'ONGOING' ? 'bg-blue-500 text-white' : 
                        project.status === 'COMPLETED' ? 'bg-emerald-500 text-white' : 
                        'bg-amber-500 text-white'
                      }`}>
                        {project.status === 'ONGOING' ? 'En cours' : (project.status === 'COMPLETED' ? 'Réalisé' : 'Planifié')}
                      </div>
                    </div>
                    
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{project.title}</h3>
                      
                      <div className="flex items-center text-xs text-gray-500 mb-4">
                        <MapPin className="h-3.5 w-3.5 mr-1" /> Cameroun
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
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 max-w-7xl mx-auto px-4">
          <p className="text-gray-500 text-lg">Aucun projet répertorié pour le moment.</p>
        </div>
      )}

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
