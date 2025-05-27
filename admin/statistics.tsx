// admin/statistics.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PieController,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
} from 'chart.js';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import Button from '../components/ui/Button';

// Enregistrer les composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PieController,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale
);

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

// Interface pour l'utilisateur admin connecté (simplifié)
interface AdminUser {
  username: string;
}

const StatisticsPage = () => {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAdminSession = async () => {
        try {
            const res = await fetch('/api/check-session');
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
    fetchAdminSession();

    const fetchResponses = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/responses-direct');
        if (!res.ok) {
          if (res.status === 401) {
            router.push('/admin/login');
            return;
          }
          throw new Error('Impossible de charger les réponses.');
        }
        
        const data: SurveyResponse[] = await res.json();
        setResponses(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, [router]);

  const handleLogout = async () => {
    try {
        await fetch('/api/logout', { method: 'POST' });
        router.push('/admin/login');
    } catch (err) {
        console.error("Failed to logout", err);
        setError("Déconnexion échouée.");
    }
  };

  // Fonctions pour calculer les statistiques et préparer les données pour les graphiques
  const processVillesData = () => {
    const villesCount: Record<string, number> = {};
    
    responses.forEach(resp => {
      const ville = resp.villeAutre && resp.ville === 'Autre' ? 'Autre' : resp.ville;
      villesCount[ville] = (villesCount[ville] || 0) + 1;
    });
    
    return {
      labels: Object.keys(villesCount),
      datasets: [
        {
          label: 'Répartition par villes',
          data: Object.values(villesCount),
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const processSituationProData = () => {
    const situationsCount: Record<string, number> = {};
    
    responses.forEach(resp => {
      const situation = resp.situationProfAutre && resp.situationProfessionnelle === 'Autre' 
        ? 'Autre' : resp.situationProfessionnelle;
      situationsCount[situation] = (situationsCount[situation] || 0) + 1;
    });
    
    return {
      labels: Object.keys(situationsCount),
      datasets: [
        {
          label: 'Répartition par situation professionnelle',
          data: Object.values(situationsCount),
          backgroundColor: [
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 99, 132, 0.6)',
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 99, 132, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const processMangeExterieurData = () => {
    const freqCount: Record<string, number> = {};
    
    responses.forEach(resp => {
      freqCount[resp.mangeExterieurFreq] = (freqCount[resp.mangeExterieurFreq] || 0) + 1;
    });
    
    return {
      labels: Object.keys(freqCount),
      datasets: [
        {
          label: 'Fréquence de repas à l\'extérieur',
          data: Object.values(freqCount),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const processInteresSolutionData = () => {
    const interetCount: Record<string, number> = {};
    
    responses.forEach(resp => {
      interetCount[resp.interetSolutionRepas] = (interetCount[resp.interetSolutionRepas] || 0) + 1;
    });
    
    return {
      labels: Object.keys(interetCount),
      datasets: [
        {
          label: 'Intérêt pour une solution de repas',
          data: Object.values(interetCount),
          backgroundColor: [
            'rgba(92, 184, 92, 0.6)',
            'rgba(240, 173, 78, 0.6)',
            'rgba(217, 83, 79, 0.6)',
            'rgba(91, 192, 222, 0.6)',
          ],
          borderColor: [
            'rgba(92, 184, 92, 1)',
            'rgba(240, 173, 78, 1)',
            'rgba(217, 83, 79, 1)',
            'rgba(91, 192, 222, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const processSatisfactionData = () => {
    const satisfactionLevels = [0, 0, 0, 0, 0]; // indices 0-4 représentent les niveaux 1-5
    
    responses.forEach(resp => {
      if (resp.satisfactionAccesRepas >= 1 && resp.satisfactionAccesRepas <= 5) {
        satisfactionLevels[resp.satisfactionAccesRepas - 1]++;
      }
    });
    
    return {
      labels: ['1 - Pas satisfait', '2', '3 - Neutre', '4', '5 - Très satisfait'],
      datasets: [
        {
          label: 'Niveau de satisfaction',
          data: satisfactionLevels,
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const processAspectsImportantsData = () => {
    const aspects: Record<string, number> = {};
    
    responses.forEach(resp => {
      resp.aspectsImportants.forEach(aspect => {
        aspects[aspect] = (aspects[aspect] || 0) + 1;
      });
    });
    
    return {
      labels: Object.keys(aspects),
      datasets: [
        {
          label: 'Aspects importants',
          data: Object.values(aspects),
          backgroundColor: 'rgba(255, 159, 64, 0.6)',
          borderColor: 'rgba(255, 159, 64, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const processDefisData = () => {
    const defis: Record<string, number> = {};
    
    responses.forEach(resp => {
      resp.defisAlimentation.forEach(defi => {
        defis[defi] = (defis[defi] || 0) + 1;
      });
    });
    
    return {
      labels: Object.keys(defis),
      datasets: [
        {
          label: 'Défis alimentaires',
          data: Object.values(defis),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const processBudgetData = () => {
    const budgetCount: Record<string, number> = {};
    
    responses.forEach(resp => {
      budgetCount[resp.budgetJournalierRepas] = (budgetCount[resp.budgetJournalierRepas] || 0) + 1;
    });
    
    return {
      labels: Object.keys(budgetCount),
      datasets: [
        {
          label: 'Budget journalier pour repas',
          data: Object.values(budgetCount),
          backgroundColor: 'rgba(255, 206, 86, 0.6)',
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Statistiques des réponses au sondage',
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
    },
  };

  if (loading && !responses.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xl text-gray-600">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <p className="text-xl text-red-600 p-8 bg-red-100 rounded-lg shadow">{error}</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Statistiques - Admin Dashboard</title>
      </Head>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-gray-800 text-white shadow-lg">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Statistiques des Sondages</h1>
            <div className="flex items-center">
              {adminUser && <span className="mr-4">Connecté: {adminUser.username}</span>}
              <Button onClick={() => router.push('/admin/dashboard')} variant="primary" className="mr-3">
                Tableau de bord
              </Button>
              <Button onClick={handleLogout} variant="secondary">
                Déconnexion
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
          <h2 className="text-3xl font-semibold text-gray-700 mb-6">Analyse des {responses.length} réponses</h2>

          {responses.length === 0 ? (
            <p className="text-gray-600 text-lg text-center py-10">Aucune réponse pour le moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white shadow-xl rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Répartition par ville</h3>
                <div className="h-72">
                  <Pie data={processVillesData()} options={pieOptions} />
                </div>
              </div>

              <div className="bg-white shadow-xl rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Situation professionnelle</h3>
                <div className="h-72">
                  <Pie data={processSituationProData()} options={pieOptions} />
                </div>
              </div>

              <div className="bg-white shadow-xl rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Fréquence repas à l'extérieur</h3>
                <Bar data={processMangeExterieurData()} options={options} />
              </div>

              <div className="bg-white shadow-xl rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Intérêt pour une solution de repas</h3>
                <div className="h-72">
                  <Doughnut data={processInteresSolutionData()} options={pieOptions} />
                </div>
              </div>

              <div className="bg-white shadow-xl rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Niveau de satisfaction</h3>
                <Bar data={processSatisfactionData()} options={options} />
              </div>

              <div className="bg-white shadow-xl rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Aspects importants</h3>
                <Bar data={processAspectsImportantsData()} options={{...options, indexAxis: 'y' as const}} />
              </div>

              <div className="bg-white shadow-xl rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Défis alimentaires</h3>
                <Bar data={processDefisData()} options={{...options, indexAxis: 'y' as const}} />
              </div>

              <div className="bg-white shadow-xl rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Budget journalier</h3>
                <Bar data={processBudgetData()} options={options} />
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Les graphiques ci-dessus sont générés à partir des réponses au sondage. 
              Le nombre total de réponses analysées est de {responses.length}.
            </p>
          </div>
        </main>
      </div>
    </>
  );
};

export default StatisticsPage;
