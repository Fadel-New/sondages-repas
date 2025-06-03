// pages/debug-image.tsx
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

interface DebugImageProps {
  host: string;
  baseUrl: string;
  imageUrl: string;
  timestamp: string;
}

const DebugImage = ({ host, baseUrl, imageUrl, timestamp }: DebugImageProps) => {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Head>
        <title>Déboguer l'image pour partage social</title>
      </Head>

      <h1>Déboguer l'image pour partage social</h1>
      
      <div style={{ margin: '20px 0', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h2>Informations</h2>
        <p><strong>Hôte:</strong> {host}</p>
        <p><strong>URL de base:</strong> {baseUrl}</p>
        <p><strong>URL de l'image:</strong> {imageUrl}</p>
        <p><strong>Horodatage:</strong> {timestamp}</p>
      </div>

      <div style={{ margin: '20px 0', textAlign: 'center' }}>
        <h2>Aperçu de l'image</h2>
        <img 
          src={imageUrl} 
          alt="Image pour partage social" 
          style={{ maxWidth: '100%', height: 'auto', border: '1px solid #ddd' }} 
        />
        <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
          Cette image devrait avoir une taille de 1200x630 pixels pour une prévisualisation optimale.
        </p>
      </div>

      <div style={{ margin: '20px 0' }}>
        <h2>Tests à effectuer</h2>
        <ol>
          <li>Vérifiez si l'image se charge correctement ci-dessus</li>
          <li>
            <a 
              href={`whatsapp://send?text=${encodeURIComponent(`${baseUrl}?v=${Date.now()}`)}`}
              style={{ 
                display: 'inline-block', 
                margin: '10px 0',
                padding: '10px 15px',
                background: '#25D366',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px'
              }}
            >
              Partager sur WhatsApp avec horodatage
            </a>
          </li>
          <li>
            <a 
              href="/"
              style={{ 
                display: 'inline-block', 
                margin: '10px 0',
                padding: '10px 15px',
                background: '#4CAF50',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px'
              }}
            >
              Retour à la page d'accueil
            </a>
          </li>
        </ol>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const host = context.req.headers.host || 'sondages-repas.vercel.app';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;
  const imageUrl = `${baseUrl}/images/repas-social.jpeg`;
  const timestamp = new Date().toISOString();

  return {
    props: {
      host,
      baseUrl,
      imageUrl,
      timestamp
    }
  };
};

export default DebugImage;
