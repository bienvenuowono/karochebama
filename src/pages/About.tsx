import { CheckCircle2, MapPin, Award, Users } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="relative bg-emerald-900 py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Farm landscape"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            About Karochebama
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-emerald-100">
            Pioneering sustainable agro-industry and fish farming in Central Africa.
          </p>
        </div>
      </div>

      {/* Story & Mission */}
      <div className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl mb-6">
              Our Story
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Founded with a vision to revolutionize the agricultural landscape, Karochebama started as a small fish farming project. Today, we have grown into a comprehensive agro-industrial complex, integrating modern aquaculture with sustainable crop production.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              We believe that the future of food security lies in the harmonious integration of technology, nature, and community empowerment. Our farms are designed to minimize environmental impact while maximizing yield and quality.
            </p>
          </div>
          <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1589923188900-85dae523342b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
              alt="Fish farming facility"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Hectares of Farmland', value: '500+', icon: MapPin },
              { label: 'Tons of Fish Annually', value: '1,200', icon: CheckCircle2 },
              { label: 'Local Farmers Supported', value: '300+', icon: Users },
              { label: 'Quality Certifications', value: '5', icon: Award },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
                <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <stat.icon className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="text-4xl font-extrabold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
