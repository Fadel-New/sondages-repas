// components/Layout.tsx
import Head from 'next/head';
import React, { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  title?: string;
};

const Layout = ({ children, title = 'Sondage Repas Quotidiens' }: Props) => (
  <div className="min-h-screen bg-gradient-to-br from-green-400 via-teal-500 to-blue-600 text-gray-800 flex flex-col items-center py-8 px-4">
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <main className="container mx-auto max-w-3xl w-full bg-white p-6 sm:p-10 rounded-xl shadow-2xl">
      {children}
    </main>
    <footer className="text-center text-white text-sm mt-8">
      <p>&copy; {new Date().getFullYear()} Votre Entreprise. Tous droits réservés.</p>
    </footer>
  </div>
);

export default Layout;