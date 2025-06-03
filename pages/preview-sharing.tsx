// pages/preview-sharing.tsx
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

const PreviewSharingPage = () => {
  // URL du site pour la prévisualisation
  const siteUrl = process.env.NEXT_PUBLIC_DOMAIN || 'https://sondages-repas.vercel.app';
  const previewUrl = `/api/preview-social-sharing?url=${encodeURIComponent(siteUrl)}`;
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Head>
        <title>Prévisualisation du partage social</title>
      </Head>

      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Prévisualisation du partage social
            </h1>
            <Link href="/" className="text-green-600 hover:text-green-800 font-medium">
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Comment apparaîtra votre site lorsqu'il sera partagé</h2>
                <p className="mt-1 text-gray-600">
                  Voici une représentation approximative de comment votre site apparaîtra lorsqu'il sera partagé sur des plateformes comme WhatsApp, Facebook et Twitter.
                </p>
              </div>
              
              <div className="mt-6 border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="w-full md:w-1/4 relative aspect-video">
                    <Image 
                      src="/images/repas-social.jpeg" 
                      alt="Aperçu de l'image de partage"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                    />
                  </div>
                  <div className="w-full md:w-3/4">
                    <h3 className="text-lg font-semibold text-gray-800">Sondage - Solutions Repas au Bénin</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Participez à notre sondage sur les habitudes alimentaires au Bénin pour contribuer au développement de solutions de repas pratiques, sains et abordables adaptées à vos besoins.
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{siteUrl}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-800">
                  Outils de validation des partages sociaux
                </h3>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <a 
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    Aperçu complet
                  </a>
                  <a 
                    href="https://cards-dev.twitter.com/validator"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600"
                  >
                    Validateur Twitter
                  </a>
                  <a 
                    href="https://developers.facebook.com/tools/debug/"
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Validateur Facebook
                  </a>
                </div>
              </div>
              
              <div className="mt-8 bg-yellow-50 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Note importante
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        Les aperçus réels peuvent varier légèrement selon les plateformes. Pour tester le véritable rendu sur WhatsApp, essayez de partager l'URL de votre site avec un petit groupe de test.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PreviewSharingPage;
