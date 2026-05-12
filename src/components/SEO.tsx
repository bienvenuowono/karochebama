import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export default function SEO({ 
  title, 
  description, 
  keywords, 
  image = '/hero-bg.jpg', 
  url = 'https://karochebama.com' 
}: SEOProps) {
  const fullTitle = title ? `${title} | Karochebama` : 'Karochebama - Agro-industrie et Pisciculture au Cameroun';
  const fullDescription = description || "Développement de l'agriculture moderne, de l'agro-industrie et de la pisciculture durable au Cameroun.";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      
      {/* Twitter */}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
