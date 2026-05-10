import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';

export default function NewsDetail() {
  const { id } = useParams();

  // In a real app, fetch news details based on ID
  const article = {
    title: 'Lancement de notre nouvelle plateforme agro-industrielle',
    content: `
      <p>Nous sommes fiers d'annoncer le lancement officiel de la nouvelle plateforme agro-industrielle Karochebama. Cette initiative marque un tournant majeur dans notre engagement à moderniser la chaîne d'approvisionnement agricole.</p>
      
      <h3>Une vision pour l'avenir</h3>
      <p>Notre nouvelle plateforme a été conçue avec un objectif clair : faciliter la connexion entre les producteurs locaux et les acheteurs professionnels. En numérisant les processus d'achat et de vente, nous réduisons les intermédiaires et garantissons une meilleure traçabilité des produits.</p>
      
      <h3>Fonctionnalités clés</h3>
      <ul>
        <li><strong>Marketplace B2B :</strong> Un espace dédié aux transactions en gros, sécurisé et transparent.</li>
        <li><strong>Suivi en temps réel :</strong> Les acheteurs peuvent suivre l'état de leurs commandes de la ferme à la livraison.</li>
        <li><strong>Gestion des stocks :</strong> Des outils avancés pour aider les producteurs à gérer leurs inventaires.</li>
      </ul>
      
      <p>Nous invitons tous nos partenaires à rejoindre cette nouvelle aventure et à découvrir les nombreuses opportunités qu'offre notre plateforme.</p>
    `,
    date: '15 Mars 2024',
    category: 'Entreprise',
    author: 'L\'équipe Karochebama',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80'
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen font-sans pb-20">
      {/* Article Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link to="/actualite" className="inline-flex items-center text-emerald-600 font-semibold hover:text-emerald-700 transition-colors mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux actualités
          </Link>
          
          <div className="flex items-center gap-4 mb-6">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
              {article.category}
            </span>
            <span className="flex items-center text-gray-500 text-sm">
              <Calendar className="h-4 w-4 mr-2" />
              {article.date}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
            {article.title}
          </h1>
          
          <div className="flex items-center justify-between border-t border-gray-100 pt-6 mt-6">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-lg mr-3">
                K
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{article.author}</p>
                <p className="text-xs text-gray-500">Auteur</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 font-medium mr-2 hidden sm:block">Partager :</span>
              <button className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-emerald-100 hover:text-emerald-600 transition-colors">
                <Facebook className="h-4 w-4" />
              </button>
              <button className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-emerald-100 hover:text-emerald-600 transition-colors">
                <Twitter className="h-4 w-4" />
              </button>
              <button className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-emerald-100 hover:text-emerald-600 transition-colors">
                <Linkedin className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-2xl overflow-hidden shadow-lg mb-12">
          <img 
            src={article.image} 
            alt={article.title} 
            className="w-full h-auto object-cover max-h-[500px]"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div 
          className="prose prose-lg prose-emerald max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>
    </div>
  );
}
