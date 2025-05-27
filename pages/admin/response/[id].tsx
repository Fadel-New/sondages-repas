// pages/admin/response/[id].tsx
import { GetServerSideProps } from 'next';
import { withSessionSsr } from '../../../lib/auth';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Button from '../../../components/ui/Button';
import Link from 'next/link';

// Interface pour les réponses au sondage
interface SurveyResponse {
  id: number;
  createdAt: string;
  ville: string;
  villeAutre?: string;
  situationProfessionnelle: string;
  situationProfAutre?: string;
  mangeExterieurFreq: string;
  tempsPreparationRepas: string;
  typesRepas: string[];
  typesRepasAutre?: string;
  defisAlimentation: string[];
  defisAlimentationAutre?: string;
  satisfactionAccesRepas: number;
  interetSolutionRepas: string;
  aspectsImportants: string[];
  aspectsImportantsAutre?: string;
  budgetJournalierRepas: string;
  prixMaxRepas: string;
  budgetMensuelAbo: string;
  commentaires?: string;
}

export const getServerSideProps: GetServerSideProps = withSessionSsr(
  async function getServerSideProps({ req, params }) {
    const admin = req.session?.admin;

    if (!admin || !admin.isLoggedIn) {
      return {
        redirect: {
          destination: '/admin/login?redirected=true',
          permanent: false,
        },
      };
    }

    const id = params?.id as string;
    
    return {
      props: { 
        admin,
        responseId: id 
      },
    };
  }
);

// Composant de détail de réponse
const ResponseDetail = ({ admin, responseId }: { admin: any, responseId: string }) => {
  const [response, setResponse] = useState<SurveyResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchResponseDetail = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/responses-direct/${responseId}`);
        
        if (!res.ok) {
          throw new Error('Impossible de charger les détails de la réponse');
        }
        
        const data = await res.json();
        setResponse(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (responseId) {
      fetchResponseDetail();
    }
  }, [responseId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="p-8 bg-white shadow-lg rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xl text-gray-600">Chargement des détails...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="p-8 bg-white shadow-lg rounded-lg">
          <p className="text-xl text-red-600">{error}</p>
          <Button 
            variant="secondary" 
            className="mt-4" 
            onClick={() => router.push('/admin/dashboard')}
          >
            Retour au tableau de bord
          </Button>
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-50">
        <div className="p-8 bg-white shadow-lg rounded-lg">
          <p className="text-xl text-yellow-600">Aucune réponse trouvée avec l'ID: {responseId}</p>
          <Button 
            variant="secondary" 
            className="mt-4" 
            onClick={() => router.push('/admin/dashboard')}
          >
            Retour au tableau de bord
          </Button>
        </div>
      </div>
    );
  }

  // Formatter la date pour l'affichage
  const formattedDate = new Date(response.createdAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <>
      <Head>
        <title>Détails de la réponse #{responseId}</title>
      </Head>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-gray-800 text-white shadow-lg">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Détails de la réponse #{responseId}</h1>
            <div>
              <Link href="/admin/dashboard">
                <Button variant="secondary" className="mr-3">
                  Retour au tableau de bord
                </Button>
              </Link>
              <Link href="/admin/statistics">
                <Button variant="primary" className="mr-3">
                  Voir les statistiques
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-green-50">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-700">Réponse #{response.id}</h2>
                <span className="text-gray-500">{formattedDate}</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 p-6">
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Informations personnelles</h3>
                <div className="space-y-3">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Ville</span>
                    <span className="text-gray-800">{response.ville} {response.villeAutre ? `(${response.villeAutre})` : ''}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Situation professionnelle</span>
                    <span className="text-gray-800">{response.situationProfessionnelle} {response.situationProfAutre ? `(${response.situationProfAutre})` : ''}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Habitudes alimentaires</h3>
                <div className="space-y-3">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Fréquence des repas à l'extérieur</span>
                    <span className="text-gray-800">{response.mangeExterieurFreq}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Temps de préparation des repas</span>
                    <span className="text-gray-800">{response.tempsPreparationRepas}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Types de repas à l'extérieur</span>
                    <span className="text-gray-800">
                      {response.typesRepas.join(', ')}
                      {response.typesRepasAutre ? ` (${response.typesRepasAutre})` : ''}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Défis et besoins</h3>
                <div className="space-y-3">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Défis alimentaires</span>
                    <span className="text-gray-800">
                      {response.defisAlimentation.join(', ')}
                      {response.defisAlimentationAutre ? ` (${response.defisAlimentationAutre})` : ''}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Satisfaction accès aux repas (1-5)</span>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${response.satisfactionAccesRepas * 20}%` }}></div>
                      </div>
                      <span className="ml-2 text-gray-800 font-medium">{response.satisfactionAccesRepas}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Intérêt pour des solutions</h3>
                <div className="space-y-3">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Intérêt pour une solution de repas</span>
                    <span className="text-gray-800">{response.interetSolutionRepas}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Aspects importants</span>
                    <span className="text-gray-800">
                      {response.aspectsImportants.join(', ')}
                      {response.aspectsImportantsAutre ? ` (${response.aspectsImportantsAutre})` : ''}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Budget</h3>
                <div className="space-y-3">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Budget journalier</span>
                    <span className="text-gray-800">{response.budgetJournalierRepas}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Prix maximum par repas</span>
                    <span className="text-gray-800">{response.prixMaxRepas}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Budget abonnement mensuel</span>
                    <span className="text-gray-800">{response.budgetMensuelAbo}</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Commentaires</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{response.commentaires || 'Aucun commentaire'}</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ResponseDetail;
