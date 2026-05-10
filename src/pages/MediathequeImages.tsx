import { useState } from 'react';
import { Camera, X, Play } from 'lucide-react';

export default function MediathequeImages() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const images = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c6c13?auto=format&fit=crop&w=800&q=80',
      title: 'Récolte de maïs',
      category: 'Récoltes'
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1500937386664-56d1dfefcb0c?auto=format&fit=crop&w=800&q=80',
      title: 'Vue aérienne des champs',
      category: 'Infrastructures'
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
      title: 'Plantation de tomates',
      category: 'Fermes'
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1586528116311-ad8ed7450951?auto=format&fit=crop&w=800&q=80',
      title: 'Système d\'irrigation',
      category: 'Infrastructures'
    },
    {
      id: 5,
      url: 'https://images.unsplash.com/photo-1595856345917-f370a4427027?auto=format&fit=crop&w=800&q=80',
      title: 'Élevage de poissons',
      category: 'Pisciculture'
    },
    {
      id: 6,
      url: 'https://images.unsplash.com/photo-1595856345917-f370a4427027?auto=format&fit=crop&w=800&q=80',
      title: 'Formation des agriculteurs',
      category: 'Événements'
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
            <Camera className="h-8 w-8 text-emerald-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
            Galerie <span className="text-emerald-400">Images</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Découvrez nos fermes, nos récoltes et nos infrastructures en images.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <div 
              key={image.id} 
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
              onClick={() => setSelectedImage(image.url)}
            >
              <img 
                src={image.url} 
                alt={image.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 w-full p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
                  {image.category}
                </div>
                <h3 className="text-white text-lg font-bold">{image.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm">
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          <img 
            src={selectedImage} 
            alt="Enlarged view" 
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            referrerPolicy="no-referrer"
          />
        </div>
      )}
    </div>
  );
}
