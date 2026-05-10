import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, CheckCircle2, Sprout, Building, Fish, Leaf, ArrowRight } from 'lucide-react';

export default function ProjectDetail() {
  const { id } = useParams();

  // In a real app, you would fetch the project data based on the ID.
  // For now, we'll use placeholder data that matches the structure.
  const project = {
    id: id || 'extension-ambam',
    title: 'Extension du Site Agricole Ambam',
    summary: 'Développement majeur de nos capacités de production sur le site du Sud Cameroun avec de nouvelles techniques agro-écologiques.',
    category: 'Agriculture',
    location: 'Ambam, Sud Cameroun',
    status: 'En cours',
    date: '2023 - Présent',
    img: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c6c13?auto=format&fit=crop&w=2000&q=80',
    icon: Sprout,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    description: `Le projet d'extension du site agricole d'Ambam s'inscrit dans notre stratégie globale d'augmentation de la production locale pour répondre à la demande croissante en produits agricoles de qualité. Situé dans une zone au climat favorable, ce projet vise à exploiter le potentiel du site tout en respectant les principes de l'agro-écologie.
    
    Nous avons mis en place des systèmes d'irrigation modernes et des pratiques de culture durables pour maximiser les rendements tout en préservant les ressources naturelles. Ce projet est également une opportunité de créer des emplois locaux et de former les agriculteurs du site aux nouvelles techniques agricoles.`,
    objectives: [
      'Augmenter la production de cultures vivrières de 40% d\'ici 2025.',
      'Mettre en place des systèmes d\'irrigation goutte-à-goutte sur 50 hectares.',
      'Former 200 agriculteurs locaux aux pratiques agro-écologiques.',
      'Créer plus de 50 emplois directs sur le site d\'Ambam.'
    ],
    activities: [
      'Préparation et aménagement des nouvelles parcelles.',
      'Installation des infrastructures d\'irrigation et de stockage.',
      'Plantation des premières cultures selon les nouveaux itinéraires techniques.',
      'Organisation d\'ateliers de formation pour les communautés locales.'
    ],
    impact: 'Ce projet aura un impact significatif sur la sécurité alimentaire du site, tout en contribuant au développement économique local par la création d\'emplois et le transfert de compétences.',
    gallery: [
      'https://images.unsplash.com/photo-1500937386664-56d1dfefcb0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586528116311-ad8ed7450951?auto=format&fit=crop&w=800&q=80'
    ]
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen font-sans pb-20">
      
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
        <img 
          src={project.img} 
          alt={project.title} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
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
              {project.status}
            </div>
            <div className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5">
              <project.icon className="h-3.5 w-3.5" />
              {project.category}
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 max-w-4xl">
            {project.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-gray-300 text-sm md:text-base">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-emerald-400" /> {project.location}
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-emerald-400" /> {project.date}
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
            <section>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-6">À propos du projet</h2>
              <div className="prose prose-lg text-gray-600 max-w-none">
                {project.description.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-4 leading-relaxed">{paragraph}</p>
                ))}
              </div>
            </section>

            {/* Objectives */}
            <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <CheckCircle2 className="h-6 w-6 mr-3 text-emerald-600" />
                Objectifs principaux
              </h3>
              <ul className="space-y-4">
                {project.objectives.map((obj, idx) => (
                  <li key={idx} className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-emerald-50 flex items-center justify-center mt-0.5 mr-4">
                      <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                    </div>
                    <span className="text-gray-700 leading-relaxed">{obj}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Activities */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Activités réalisées</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.activities.map((activity, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-gray-700 font-medium">{activity}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Impact */}
            <section className="bg-emerald-50 p-8 rounded-[2rem] border border-emerald-100">
              <h3 className="text-2xl font-bold text-emerald-900 mb-4">Impact attendu</h3>
              <p className="text-emerald-800 leading-relaxed text-lg">
                {project.impact}
              </p>
            </section>

            {/* Gallery */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Galerie</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {project.gallery.map((img, idx) => (
                  <div key={idx} className="relative h-48 rounded-2xl overflow-hidden group">
                    <img 
                      src={img} 
                      alt={`Gallery ${idx + 1}`} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Right Column: Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              
              {/* Summary Card */}
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Résumé du projet</h3>
                
                <div className="space-y-6">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Statut</div>
                    <div className="font-semibold text-gray-900">{project.status}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Catégorie</div>
                    <div className="font-semibold text-gray-900">{project.category}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Localisation</div>
                    <div className="font-semibold text-gray-900">{project.location}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Période</div>
                    <div className="font-semibold text-gray-900">{project.date}</div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100">
                  <Link 
                    to="/contact"
                    className="flex items-center justify-center w-full px-6 py-4 text-sm font-bold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all hover:-translate-y-0.5"
                  >
                    Nous contacter pour ce projet
                  </Link>
                </div>
              </div>

              {/* Other Projects Link */}
              <div className="bg-[#1a2b3c] p-8 rounded-[2rem] shadow-sm text-center">
                <h3 className="text-xl font-bold text-white mb-4">Intéressé par nos autres initiatives ?</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Découvrez l'ensemble de nos projets agricoles et agro-industriels.
                </p>
                <Link 
                  to="/projets"
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold rounded-xl text-gray-900 bg-white hover:bg-gray-100 transition-colors"
                >
                  Voir tous les projets <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
