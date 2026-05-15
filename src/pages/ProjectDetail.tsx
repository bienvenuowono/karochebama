import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, CheckCircle2, Sprout, Building, Fish, Leaf, ArrowRight, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://karochebama.com/api/v1/projects/${id}`);
        setProject(response.data);
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Chargement du projet...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Projet introuvable</h2>
        <Link to="/projets" className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold flex items-center gap-2 mt-4">
          <ArrowLeft size={18} /> Retour aux projets
        </Link>
      </div>
    );
  }

  // Mapper pour les icônes en fonction du contenu
  const getIcon = (category: string = '') => {
    const c = category.toLowerCase();
    if (c.includes('piscicole') || c.includes('poisson')) return Fish;
    if (c.includes('agro') || c.includes('industrie')) return Building;
    return Sprout;
  };

  const Icon = getIcon(project.category);

  return (
    <div className="bg-[#f8f9fa] min-h-screen font-sans pb-20">
      
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
        {project.imageUrl && (
          <img 
            src={project.imageUrl.startsWith('http') ? project.imageUrl : `https://karochebama.com/api/v1${project.imageUrl}`} 
            alt={project.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
        
        <div className="absolute top-8 left-4 sm:left-6 lg:left-8 z-10">
          <Link 
            to="/projets"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-bold rounded-xl text-white bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-md transition-all"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux projets
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 w-full p-8 md:p-16 max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
              {project.status === 'ONGOING' ? 'En cours' : project.status === 'COMPLETED' ? 'Terminé' : project.status}
            </div>
            <div className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5">
              <Icon className="h-3.5 w-3.5" />
              {project.category || 'Projet'}
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 max-w-4xl">
            {project.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-gray-300 text-sm md:text-base">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-emerald-400" /> {project.location || 'Cameroun'}
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-emerald-400" /> 
              {project.startDate ? new Date(project.startDate).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : 'Date non définie'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Content */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Description */}
            <section className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-gray-100">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-6 font-outfit">À propos du projet</h2>
              <div 
                className="prose prose-lg text-gray-600 max-w-none leading-relaxed"
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {project.description}
              </div>
            </section>

          </div>

          {/* Right Column: Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              
              {/* Summary Card */}
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Résumé du projet</h3>
                
                <div className="space-y-6">
                  <div>
                    <div className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-1">Statut</div>
                    <div className="font-bold text-gray-900">{project.status === 'ONGOING' ? 'En cours' : 'Terminé'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-1">Catégorie</div>
                    <div className="font-bold text-gray-900">{project.category || 'Non spécifiée'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-1">Localisation</div>
                    <div className="font-bold text-gray-900">{project.location || 'Cameroun'}</div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100">
                  <Link 
                    to="/contact"
                    className="flex items-center justify-center w-full px-6 py-4 text-sm font-bold rounded-2xl text-white bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 transition-all hover:-translate-y-0.5"
                  >
                    Demander plus d'infos
                  </Link>
                </div>
              </div>

              {/* Other Projects Link */}
              <div className="bg-[#1a2b3c] p-8 rounded-[2.5rem] shadow-sm text-center">
                <h3 className="text-xl font-bold text-white mb-4">D'autres initiatives ?</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Découvrez l'ensemble de nos projets agricoles et agro-industriels.
                </p>
                <Link 
                  to="/projets"
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold rounded-xl text-gray-900 bg-white hover:bg-gray-100 transition-colors"
                >
                  Voir tout <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
