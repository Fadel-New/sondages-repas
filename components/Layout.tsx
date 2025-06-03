// components/Layout.tsx
import Head from 'next/head';
import React, { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  title?: string;
  description?: string;
  imageUrl?: string;
};

const Layout = ({ 
  children, 
  title = 'Sondage Repas Quotidiens',
  description = 'Participez à notre sondage sur les habitudes alimentaires pour contribuer au développement de solutions de repas pratiques et adaptées à vos besoins.',
  imageUrl = '/images/repas-social.jpeg'
}: Props) => {
  // Utilisez une URL absolue fixe pour l'environnement de production
  const domain = 'https://sondages-repas.vercel.app';
  // Assurez-vous que l'URL de l'image est absolue
  const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${domain}${imageUrl}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-teal-500 to-blue-600 text-gray-800 flex flex-col items-center py-8 px-4">
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        
        {/* Meta tags pour le SEO */}
        <meta name="description" content={description} />
        
        {/* Meta tags Open Graph pour le partage sur les réseaux sociaux */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={fullImageUrl} />
        <meta property="og:image:secure_url" content={fullImageUrl} />
        <meta property="og:url" content={domain} />
        <meta property="og:type" content="website" />
        
        {/* Meta tags spécifiques pour WhatsApp */}
        <meta property="og:site_name" content="Sondage Repas Quotidiens" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Image représentant des repas sains et délicieux" />
        
        {/* Meta tags pour Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={fullImageUrl} />
      </Head>
      <main className="container mx-auto max-w-3xl w-full bg-white p-6 sm:p-10 rounded-xl shadow-2xl">
        {children}
      </main>
      <footer className="text-center text-white text-sm mt-8">
        <p>&copy; {new Date().getFullYear()} Votre Entreprise. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default Layout;