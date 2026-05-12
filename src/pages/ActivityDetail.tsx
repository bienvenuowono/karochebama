import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Share2, Facebook, Twitter, Linkedin, Loader2, Sprout, Calendar } from 'lucide-react';
import axios from 'axios';

export default function ActivityDetail() {
  const { id } = useParams();
  const [activity, setActivity] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5001/api/v1/activities/${id}`);
        setActivity(response.data);
      } catch (error) {
        console.error('Error fetching activity:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Chargement de l'activité...</p>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Activité introuvable</h2>
        <Link to="/nos-activites" className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold flex items-center gap-2 mt-4">
          <ArrowLeft size={18} /> Retour aux activités
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen font-sans pb-20">
      {/* Activity Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link to="/nos-activites" className="inline-flex items-center text-emerald-600 font-semibold hover:text-emerald-700 transition-colors mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux activités
          </Link>
          
          <div className="flex items-center gap-4 mb-6">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-2">
              <Sprout size={12} /> Expertise
            </span>
            <span className="flex items-center text-gray-400 text-sm">
              <Calendar className="h-4 w-4 mr-2" />
              {new Date(activity.createdAt).toLocaleDateString('fr-FR')}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
            {activity.title}
          </h1>
          
          <div className="flex items-center justify-between border-t border-gray-100 pt-6 mt-6">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-lg mr-3 shadow-lg shadow-emerald-200">
                K
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Karochebama Group</p>
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Division Agro-industrielle</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="h-9 w-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all border border-gray-100">
                <Facebook className="h-4 w-4" />
              </button>
              <button className="h-9 w-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all border border-gray-100">
                <Linkedin className="h-4 w-4" />
              </button>
              <button className="h-9 w-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all border border-gray-100">
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activity.imageUrl && (
          <div className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-emerald-900/10 mb-12">
            <img 
              src={activity.imageUrl.startsWith('http') ? activity.imageUrl : `http://localhost:5001${activity.imageUrl}`} 
              alt={activity.title} 
              className="w-full h-auto object-cover max-h-[600px]"
              referrerPolicy="no-referrer"
            />
          </div>
        )}
        
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div 
            className="prose prose-lg prose-emerald max-w-none text-gray-700 leading-relaxed"
            style={{ whiteSpace: 'pre-wrap' }}
          >
            {activity.description}
          </div>
        </div>
      </div>
    </div>
  );
}
