import { Link } from 'react-router-dom';
import { Leaf, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex flex-col items-start group mb-6">
              <div className="flex items-center justify-center relative">
                <span className="text-4xl font-serif font-black text-white tracking-tighter group-hover:text-emerald-400 transition-colors">
                  GTK
                </span>
                {/* Decorative leaf element to mimic the logo's leaves */}
                <svg className="absolute -left-3 -bottom-1 h-5 w-5 text-emerald-500 opacity-80" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.5,11.4c1.7-2.9,2.2-6.4,1.1-9.5c-3.1,1.1-6.6,2.6-9.5,4.3C6.2,8.9,3.8,12.5,3.1,16.3c-0.7,3.8,0.3,7.7,2.8,10.6 c1.1-3.1,2.6-6.6,4.3-9.5C13.1,14.5,15.5,10.9,17.5,11.4z"/>
                </svg>
              </div>
              <div className="flex flex-col items-start mt-0.5">
                <span className="text-[8px] sm:text-[9px] font-medium text-white tracking-wide border-b-[1px] border-white pb-0.5 mb-0.5">
                  Groupe Trebor Karochebama
                </span>
                <span className="text-[8px] sm:text-[9px] font-serif italic text-emerald-400">
                  Feeding the world
                </span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Entreprise camerounaise spécialisée dans l’agriculture, l’agro-industrie et la pisciculture, KAROCHEBAMA œuvre pour une production durable et une meilleure sécurité alimentaire à travers l’Afrique et le monde
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Entreprise
            </h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-sm hover:text-emerald-500 transition-colors">À propos</Link></li>
              <li><Link to="/careers" className="text-sm hover:text-emerald-500 transition-colors">Carrières</Link></li>
              <li><Link to="/blog" className="text-sm hover:text-emerald-500 transition-colors">Blog & Actualités</Link></li>
              <li><Link to="/contact" className="text-sm hover:text-emerald-500 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Marketplace */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Boutique
            </h3>
            <ul className="space-y-3">
              <li><Link to="/marketplace?category=fish" className="text-sm hover:text-emerald-500 transition-colors">Poissons frais</Link></li>
              <li><Link to="/marketplace?category=agriculture" className="text-sm hover:text-emerald-500 transition-colors">Produits agricoles</Link></li>
              <li><Link to="/wholesale" className="text-sm hover:text-emerald-500 transition-colors">Commandes en gros</Link></li>
              <li><Link to="/track-order" className="text-sm hover:text-emerald-500 transition-colors">Suivre ma commande</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Nous contacter
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-400">123 Zone Agro-Industrielle, Yaoundé, Cameroun</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                <span className="text-sm text-gray-400">+237 677 11 80 81</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                <span className="text-sm text-gray-400">contact@karochebama.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Karochebama. Tous droits réservés.
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-sm text-gray-500 hover:text-white transition-colors">Politique de confidentialité</Link>
            <Link to="/terms" className="text-sm text-gray-500 hover:text-white transition-colors">Conditions d'utilisation</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
