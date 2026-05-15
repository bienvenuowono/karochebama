import { useState, useEffect } from 'react';
import { Play, Video, X, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function MediathequeVideos() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://karochebama.com/api/v1/media');
      const filtered = response.data.filter((m: any) => m.type === 'VIDEO');
      setVideos(filtered);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen font-sans pb-20">
      {/* Header */}
      <div className="bg-[#1a2b3c] py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500937386664-56d1dfefcb0c?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-500/20 rounded-2xl mb-6">
            <Video className="h-8 w-8 text-emerald-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
            Galerie <span className="text-emerald-400">Vidéos</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Plongez au cœur de nos projets et découvrez nos méthodes de production en vidéo.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Chargement des vidéos...</p>
          </div>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {videos.map((video) => {
              const videoUrl = video.url.startsWith('http') ? video.url : `https://karochebama.com/api/v1${video.url}`;
              const isEmbed = videoUrl.includes('youtube.com') || videoUrl.includes('vimeo.com');
              
              return (
                <div 
                  key={video.id} 
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div 
                    className="relative aspect-video cursor-pointer overflow-hidden bg-slate-900"
                    onClick={() => setSelectedVideo(videoUrl)}
                  >
                    {/* Placeholder thumbnail since we don't have real thumbnails for internal videos yet */}
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                      <Play className="h-20 w-20 text-white/10" fill="currentColor" />
                    </div>
                    
                    <div className="absolute inset-0 bg-gray-900/40 group-hover:bg-gray-900/20 transition-colors duration-300 flex items-center justify-center">
                      <div className="w-16 h-16 bg-emerald-600/90 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <Play className="h-6 w-6 text-white ml-1" fill="currentColor" />
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="text-emerald-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
                      {isEmbed ? 'YouTube / Externe' : 'Vidéo Interne'}
                    </div>
                    <h3 className="text-gray-900 text-xl font-bold mb-2 group-hover:text-emerald-700 transition-colors">
                      {video.title || 'Sans titre'}
                    </h3>
                    {video.description && (
                      <p className="text-gray-500 text-sm line-clamp-2">{video.description}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
             <p className="text-gray-500 text-lg">Aucune vidéo dans la galerie pour le moment.</p>
          </div>
        )}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm">
          <button 
            onClick={() => setSelectedVideo(null)}
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors z-10"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl relative">
            {selectedVideo.includes('youtube.com') || selectedVideo.includes('vimeo.com') || selectedVideo.includes('youtu.be') ? (
              <iframe 
                src={selectedVideo} 
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            ) : (
              <video 
                src={selectedVideo} 
                className="absolute inset-0 w-full h-full" 
                controls 
                autoPlay
              ></video>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
