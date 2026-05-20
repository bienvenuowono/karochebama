import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
}

export default function SEO({
  title,
  description = "Karochebama est une plateforme e-commerce agro-industrielle de premier plan au Cameroun, spécialisée dans la production, distribution et vente de produits agricoles comme le maïs bio et la banane plantain.",
  keywords = "agriculture, e-commerce, cameroun, maïs bio, banane plantain, agro-industrie, vente en gros, marketplace agricole",
  ogTitle,
  ogDescription,
  ogImage = "/logo.png",
  ogUrl = typeof window !== 'undefined' ? window.location.href : ''
}: SEOProps) {
  useEffect(() => {
    // Mettre à jour le titre
    document.title = `${title} | Karochebama`;

    // Mettre à jour la description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Mettre à jour les mots-clés
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', keywords);

    // Mettre à jour OpenGraph Metas
    const setOgMeta = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    setOgMeta('og:title', ogTitle || `${title} | Karochebama`);
    setOgMeta('og:description', ogDescription || description);
    setOgMeta('og:image', ogImage);
    setOgMeta('og:url', ogUrl || (typeof window !== 'undefined' ? window.location.href : ''));
    setOgMeta('og:type', 'website');
  }, [title, description, keywords, ogTitle, ogDescription, ogImage, ogUrl]);

  return null;
}
