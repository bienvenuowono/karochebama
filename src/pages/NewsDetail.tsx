import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft, Share2, Facebook, Twitter, Linkedin, Loader2 } from 'lucide-react';
import axios from 'axios';
import SEO from '../components/SEO';

export default function NewsDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5001/api/v1/news/${id}`);
        setArticle(response.data);
      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Chargement de l'article...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Article introuvable</h2>
        <Link to="/actualite" className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold flex items-center gap-2 mt-4">
          <ArrowLeft size={18} /> Retour aux actualités
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen font-sans pb-20">
      <SEO 
        title={article.title}
        description={article.content.substring(0, 160).replace(/<[^>]*>/g, '')}
        image={article.imageUrl ? (article.imageUrl.startsWith('http') ? article.imageUrl : `http://localhost:5001${article.imageUrl}`) : undefined}
      />
      {/* Article Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link to="/actualite" className="inline-flex items-center text-emerald-600 font-semibold hover:text-emerald-700 transition-colors mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux actualités
          </Link>
          
          <div className="flex items-center gap-4 mb-6">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
              {article.status === 'PUBLISHED' ? 'Article' : 'Brouillon'}
            </span>
            <span className="flex items-center text-gray-500 text-sm">
              <Calendar className="h-4 w-4 mr-2" />
              {new Date(article.publishedAt || article.createdAt).toLocaleDateString('fr-FR')}
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
                <p className="text-sm font-semibold text-gray-900">L'équipe Karochebama</p>
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
        {article.imageUrl && (
          <div className="rounded-2xl overflow-hidden shadow-lg mb-12">
            <img 
              src={article.imageUrl.startsWith('http') ? article.imageUrl : `http://localhost:5001${article.imageUrl}`} 
              alt={article.title} 
              className="w-full h-auto object-cover max-h-[500px]"
              referrerPolicy="no-referrer"
            />
          </div>
        )}
        
        <div 
          className="prose prose-lg prose-emerald max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>
    </div>
  );
}
