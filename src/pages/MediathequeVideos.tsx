import { useState } from 'react';
import { Play, Video, X } from 'lucide-react';

export default function MediathequeVideos() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const videos = [
    {
      id: 1,
      title: 'Présentation de la ferme Ambam',
      category: 'Projets',
      duration: '3:45',
      thumbnail: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c6c13?auto=format&fit=crop&w=800&q=80',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' // Placeholder URL
    },
    {
      id: 2,
      title: 'Processus de récolte du maïs',
      category: 'Production',
      duration: '2:10',
      thumbnail: 'https://images.unsplash.com/photo-1500937386664-56d1dfefcb0c?auto=format&fit=crop&w=800&q=80',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: 3,
      title: 'Interview de nos agriculteurs',
      category: 'Témoignages',
      duration: '5:30',
      thumbnail: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: 4,
      title: 'Nouveau système d\'irrigation',
      category: 'Infrastructures',
      duration: '1:55',
      thumbnail: 'https://images.unsplash.com/photo-1586528116311-ad8ed7450951?auto=format&fit=crop&w=800&q=80',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
  ];

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
        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {videos.map((video) => (
            <div 
              key={video.id} 
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div 
                className="relative aspect-video cursor-pointer overflow-hidden"
                onClick={() => setSelectedVideo(video.url)}
              >
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gray-900/40 group-hover:bg-gray-900/20 transition-colors duration-300 flex items-center justify-center">
                  <div className="w-16 h-16 bg-emerald-600/90 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Play className="h-6 w-6 text-white ml-1" fill="currentColor" />
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 bg-gray-900/80 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-md">
                  {video.duration}
                </div>
              </div>
              <div className="p-6">
                <div className="text-emerald-600 text-xs font-bold uppercase tracking-wider mb-2">
                  {video.category}
                </div>
                <h3 className="text-gray-900 text-xl font-bold mb-2 group-hover:text-emerald-700 transition-colors">
                  {video.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
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
            <iframe 
              src={selectedVideo} 
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}
