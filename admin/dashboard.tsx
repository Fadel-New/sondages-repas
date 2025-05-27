// admin/dashboard.tsx
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { SurveyResponse } from '../types'; // Using our custom type
import Button from '../components/ui/Button';

// Interface pour l'utilisateur admin connecté (simplifié)
interface AdminUser {
  username: string;
}

const AdminDashboardPage = () => {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Vérifier si l'admin est connecté (ceci est une vérification côté client,
    // la vraie protection est via withSessionSsr sur la page)
    // Idéalement, récupérer les infos de l'utilisateur de la session via un endpoint ou getServerSideProps
    const fetchAdminSession = async () => {
        try {
            const res = await fetch('/api/check-session'); // Un endpoint simple qui renvoie req.session.admin
            if (res.ok) {
                const data = await res.json();
                if (data.admin && data.admin.isLoggedIn) {
                    setAdminUser(data.admin);
                } else {
                    router.push('/admin/login');
                }
            } else {
                router.push('/admin/login');
            }
        } catch (e) {
            router.push('/admin/login');
        }
    };
    fetchAdminSession(); // Vous devrez créer cette route API `/api/check-session`

    const fetchResponses = async () => {
      try {
        setLoading(true);
        // Utiliser l'API directe pour récupérer les réponses
        const res = await fetch('/api/responses-direct');
        if (!res.ok) {
          if (res.status === 401) {
            router.push('/admin/login'); // Rediriger si non autorisé
            return;
          }
          throw new Error('Impossible de charger les réponses.');
        }
        const data: SurveyResponse[] = await res.json();
        setResponses(data);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, [router]);


   const handleLogout = async () => {
    try {
        await fetch('/api/logout', { method: 'POST' }); // Vous devrez créer cette route API
        router.push('/admin/login');
    } catch (err) {
        console.error("Failed to logout", err);
        setError("Déconnexion échouée.");
    }
  };

  const handleExportCsv = () => {
    window.location.href = '/api/export-csv-direct';
  };

  if (loading && !responses.length) { // Affiche loading seulement si aucune réponse n'est encore chargée
    return <div className="min-h-screen flex items-center justify-center bg-gray-100"><p className="text-xl text-gray-600">Chargement des réponses...</p></div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-red-50"><p className="text-xl text-red-600 p-8 bg-red-100 rounded-lg shadow">{error}</p></div>;
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard - Réponses du Sondage</title>
      </Head>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-gray-800 text-white shadow-lg">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Tableau de Bord Administrateur</h1>
            <div className="flex items-center">
              {adminUser && <span className="mr-4">Connecté: {adminUser.username}</span>}
              <Button onClick={() => router.push('/admin/statistics')} variant="primary" className="mr-3">
                Voir les statistiques
              </Button>
              <Button onClick={handleExportCsv} variant="primary" className="mr-3">
                Exporter en CSV
              </Button>
              <Button onClick={handleLogout} variant="secondary">
                Déconnexion
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
          <h2 className="text-3xl font-semibold text-gray-700 mb-6">Réponses au Sondage ({responses.length})</h2>

          {responses.length === 0 && !loading ? (
            <p className="text-gray-600 text-lg text-center py-10">Aucune réponse pour le moment.</p>
          ) : (
            <div className="bg-white shadow-xl rounded-lg overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Ville</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Situation Pro.</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Mange Ext.</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Intérêt Solution</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Budget Jour.</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Commentaires</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {responses.map((res) => (
                    <tr key={res.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{res.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(res.createdAt).toLocaleDateString('fr-FR')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{res.ville}{res.villeAutre ? ` (${res.villeAutre})` : ''}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{res.situationProfessionnelle}{res.situationProfAutre ? ` (${res.situationProfAutre})` : ''}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{res.mangeExterieurFreq}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{res.interetSolutionRepas}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{res.budgetJournalierRepas}</td>
                      <td className="px-6 py-4 text-sm text-gray-800 max-w-xs truncate" title={res.commentaires || ''}>{res.commentaires || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        <Button 
                          variant="primary" 
                          size="small" 
                          onClick={() => router.push(`/admin/response/${res.id}`)}
                        >
                          Voir détails
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default AdminDashboardPage;