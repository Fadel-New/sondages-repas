// components/ui/EnhancedSurveyForm.tsx
import React, { useState, useEffect, FormEvent, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Question from './Question';
import Button from './Button';
import Input from './Input';

// Définir la structure de l'état du formulaire
interface FormData {
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
  satisfactionAccesRepas: number | null;
  interetSolutionRepas: string;
  aspectsImportants: string[];
  aspectsImportantsAutre?: string;
  budgetJournalierRepas: string;
  prixMaxRepas: string;
  budgetMensuelAbo: string;
  commentaires?: string;
}

const initialFormData: FormData = {
  ville: '',
  situationProfessionnelle: '',
  mangeExterieurFreq: '',
  tempsPreparationRepas: '',
  typesRepas: [],
  defisAlimentation: [],
  satisfactionAccesRepas: null,
  interetSolutionRepas: '',
  aspectsImportants: [],
  budgetJournalierRepas: '',
  prixMaxRepas: '',
  budgetMensuelAbo: '',
};

// Structure des sections du formulaire
const formSections = [
  {
    id: 1,
    title: "Informations Personnelles",
    icon: "https://img.icons8.com/fluency/48/user-male-circle.png",
    questions: ["ville", "situationProfessionnelle"]
  },
  {
    id: 2,
    title: "Vos habitudes alimentaires",
    icon: "https://img.icons8.com/fluency/48/restaurant.png",
    questions: ["mangeExterieurFreq", "tempsPreparationRepas", "typesRepas"]
  },
  {
    id: 3,
    title: "Vos besoins et défis",
    icon: "https://img.icons8.com/fluency/48/goal.png",
    questions: ["defisAlimentation", "satisfactionAccesRepas"]
  },
  {
    id: 4,
    title: "Vos intérêts pour de nouvelles solutions",
    icon: "https://img.icons8.com/fluency/48/idea.png",
    questions: ["interetSolutionRepas", "aspectsImportants"]
  },
  {
    id: 5,
    title: "Votre budget",
    icon: "https://img.icons8.com/fluency/48/money.png",
    questions: ["budgetJournalierRepas", "prixMaxRepas", "budgetMensuelAbo"]
  },
  {
    id: 6,
    title: "Commentaires",
    icon: "https://img.icons8.com/fluency/48/comments.png",
    questions: ["commentaires"]
  }
];

const EnhancedSurveyForm = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState<number>(1);
  const [progress, setProgress] = useState<number>(0);
  const [animateSection, setAnimateSection] = useState<boolean>(false);
  const formRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Calculer la progression du formulaire
  useEffect(() => {
    calculateProgress();
  }, [formData]);

  // Scroll en haut lorsqu'on change de section
  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Animer la nouvelle section
    setAnimateSection(true);
    const timer = setTimeout(() => {
      setAnimateSection(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [currentSection]);

  const calculateProgress = () => {
    const totalFields = Object.keys(initialFormData).length;
    let filledFields = 0;
    
    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) filledFields++;
      else if (typeof value === 'string' && value.trim() !== '') filledFields++;
      else if (typeof value === 'number') filledFields++;
    });
    
    setProgress(Math.round((filledFields / totalFields) * 100));
  };

  const handleChange = (id: keyof FormData, value: unknown, otherValue?: string) => {
    if (id.endsWith('Autre')) {
      setFormData(prev => ({ ...prev, [id]: value }));
    } else if (otherValue !== undefined) {
      // Pour les questions avec "Autre (préciser)"
      const mainField = id;
      const otherField = `${id}Autre` as keyof FormData;
      if (value === 'Autre') {
        setFormData(prev => ({ ...prev, [mainField]: value, [otherField]: otherValue }));
      } else {
        setFormData(prev => ({ ...prev, [mainField]: value, [otherField]: '' }));
      }
    }
    else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
  };

  // Fonction d'adaptation pour rendre compatible avec le composant Question
  const handleQuestionChange = (id: string, value: unknown, otherValue?: string) => {
    handleChange(id as keyof FormData, value, otherValue);
  };

  const goToSection = (sectionId: number) => {
    if (sectionId >= 1 && sectionId <= formSections.length) {
      setCurrentSection(sectionId);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    // Validation simple
    if (!formData.ville || !formData.situationProfessionnelle || !formData.mangeExterieurFreq || !formData.tempsPreparationRepas || formData.typesRepas.length === 0 || formData.defisAlimentation.length === 0 || formData.satisfactionAccesRepas === null || !formData.interetSolutionRepas || formData.aspectsImportants.length === 0 || !formData.budgetJournalierRepas || !formData.prixMaxRepas || !formData.budgetMensuelAbo) {
        setError("Veuillez répondre à toutes les questions obligatoires.");
        setSubmitting(false);
        // Scroll to the first error or a general error message display area
        window.scrollTo(0,0);
        return;
    }

    try {
      // Utilise l'API directe à la place de l'API Prisma
      const response = await fetch('/api/submit-survey-direct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Une erreur est survenue.');
      }

      setSuccessMessage('Merci pour votre participation ! Votre réponse a été enregistrée.');
      setFormData(initialFormData); // Reset form
      window.scrollTo(0,0);
      setCurrentSection(1); // Retour à la première section
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      window.scrollTo(0,0);
    } finally {
      setSubmitting(false);
    }
  };

  // Déterminer si une section est complète
  const isSectionComplete = (sectionId: number) => {
    const section = formSections.find(s => s.id === sectionId);
    if (!section) return false;
    
    return section.questions.every(q => {
      const field = q as keyof FormData;
      const value = formData[field];
      if (Array.isArray(value)) return value.length > 0;
      if (field === 'commentaires') return true; // Commentaires facultatifs
      if (typeof value === 'string') return value.trim() !== '';
      if (typeof value === 'number') return true;
      return false;
    });
  };

  const renderQuestions = () => {
    const section = formSections.find(s => s.id === currentSection);
    if (!section) return null;

    return (
      <div className={`form-section ${animateSection ? 'section-active' : ''}`}>
        <div className="section-header">
          <img src={section.icon} alt={section.title} className="section-icon" />
          <h2>{`Section ${section.id}: ${section.title}`}</h2>
        </div>

        {section.id === 1 && (
          <>
            <Question
              id="ville"
              title="Dans quelle ville du Bénin habitez-vous ?"
              type="multiple-choice"
              options={[
                { value: 'Cotonou', label: 'Cotonou' },
                { value: 'Porto-Novo', label: 'Porto-Novo' },
                { value: 'Abomey-Calavi', label: 'Abomey-Calavi' },
                { value: 'Parakou', label: 'Parakou' },
                { value: 'Djougou', label: 'Djougou' },
                { value: 'Bohicon', label: 'Bohicon' },
                { value: 'Natitingou', label: 'Natitingou' },
                { value: 'Ouidah', label: 'Ouidah' },
                { value: 'Autre', label: 'Autre' }
              ]}
              value={formData.ville}
              onChange={handleQuestionChange}
              required
            />
            {formData.ville === 'Autre' && (
              <Input
                id="villeAutre"
                placeholder="Précisez votre ville"
                value={formData.villeAutre || ''}
                onChange={(e) => handleChange('villeAutre' as keyof FormData, e.target.value)}
                className="mt-2 ml-8"
              />
            )}

            <Question
              id="situationProfessionnelle"
              title="Quelle est votre situation professionnelle actuelle ?"
              type="multiple-choice"
              options={[
                { value: 'Salarié(e)', label: 'Salarié(e)' },
                { value: 'Étudiant(e)', label: 'Étudiant(e)' },
                { value: 'Entrepreneur', label: 'Entrepreneur / Travailleur indépendant' },
                { value: 'Sans emploi', label: 'Sans emploi' },
                { value: 'Retraité(e)', label: 'Retraité(e)' },
                { value: 'Autre', label: 'Autre' }
              ]}
              value={formData.situationProfessionnelle}
              onChange={handleQuestionChange}
              required
            />
            {formData.situationProfessionnelle === 'Autre' && (
              <Input
                id="situationProfAutre"
                placeholder="Précisez votre situation"
                value={formData.situationProfAutre || ''}
                onChange={(e) => handleChange('situationProfAutre' as keyof FormData, e.target.value)}
                className="mt-2 ml-8"
              />
            )}
          </>
        )}

        {section.id === 2 && (
          <>
            <Question
              id="mangeExterieurFreq"
              title="À quelle fréquence mangez-vous à l'extérieur de chez vous ?"
              type="multiple-choice"
              options={[
                { value: 'Tous les jours', label: 'Tous les jours' },
                { value: '3-4 fois par semaine', label: '3-4 fois par semaine' },
                { value: '1-2 fois par semaine', label: '1-2 fois par semaine' },
                { value: 'Quelques fois par mois', label: 'Quelques fois par mois' },
                { value: 'Rarement ou jamais', label: 'Rarement ou jamais' }
              ]}
              value={formData.mangeExterieurFreq}
              onChange={handleQuestionChange}
              required
            />

            <Question
              id="tempsPreparationRepas"
              title="Combien de temps passez-vous en moyenne à préparer vos repas quotidiens ?"
              type="multiple-choice"
              options={[
                { value: 'Moins de 15 minutes', label: 'Moins de 15 minutes' },
                { value: '15-30 minutes', label: '15-30 minutes' },
                { value: '30-60 minutes', label: '30-60 minutes' },
                { value: 'Plus d\'une heure', label: 'Plus d\'une heure' },
                { value: 'Je ne prépare pas mes repas', label: 'Je ne prépare pas mes repas' }
              ]}
              value={formData.tempsPreparationRepas}
              onChange={handleQuestionChange}
              required
            />

            <Question
              id="typesRepas"
              title="Quels types de repas consommez-vous généralement à l'extérieur ?"
              type="checkbox"
              options={[
                { value: 'Petit déjeuner', label: 'Petit déjeuner' },
                { value: 'Déjeuner', label: 'Déjeuner' },
                { value: 'Dîner', label: 'Dîner' },
                { value: 'Collations', label: 'Collations / En-cas' },
                { value: 'Autre', label: 'Autre' }
              ]}
              value={formData.typesRepas}
              onChange={handleQuestionChange}
              required
            />
            {formData.typesRepas.includes('Autre') && (
              <Input
                id="typesRepasAutre"
                placeholder="Précisez le type de repas"
                value={formData.typesRepasAutre || ''}
                onChange={(e) => handleChange('typesRepasAutre' as keyof FormData, e.target.value)}
                className="mt-2 ml-8"
              />
            )}
          </>
        )}

        {section.id === 3 && (
          <>
            <Question
              id="defisAlimentation"
              title="Quels sont les principaux défis que vous rencontrez concernant votre alimentation quotidienne ?"
              type="checkbox"
              options={[
                { value: 'Manque de temps pour cuisiner', label: 'Manque de temps pour cuisiner' },
                { value: 'Coût élevé des repas extérieurs', label: 'Coût élevé des repas extérieurs' },
                { value: 'Difficulté à trouver des options saines', label: 'Difficulté à trouver des options saines' },
                { value: 'Manque de variété', label: 'Manque de variété dans les options disponibles' },
                { value: 'Contraintes diététiques', label: 'Contraintes diététiques ou allergies' },
                { value: 'Autre', label: 'Autre' }
              ]}
              value={formData.defisAlimentation}
              onChange={handleQuestionChange}
              required
            />
            {formData.defisAlimentation.includes('Autre') && (
              <Input
                id="defisAlimentationAutre"
                placeholder="Précisez le défi"
                value={formData.defisAlimentationAutre || ''}
                onChange={(e) => handleChange('defisAlimentationAutre' as keyof FormData, e.target.value)}
                className="mt-2 ml-8"
              />
            )}

            <div className="question-container">
              <h3 className="question-title">Sur une échelle de 1 à 5, quel est votre niveau de satisfaction concernant l'accès à des repas qui correspondent à vos besoins ?</h3>
              <div className="rating-scale">
                <div className="rating-labels">
                  <span>Pas du tout satisfait</span>
                  <span>Très satisfait</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  step="1"
                  value={formData.satisfactionAccesRepas || 3}
                  onChange={(e) => handleChange('satisfactionAccesRepas' as keyof FormData, parseInt(e.target.value))}
                  className="rating-input"
                />
                <div className="rating-numbers">
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                </div>
              </div>
            </div>
          </>
        )}

        {section.id === 4 && (
          <>
            <Question
              id="interetSolutionRepas"
              title="Seriez-vous intéressé(e) par un service qui propose des repas préparés, sains et abordables à emporter ou à livrer ?"
              type="multiple-choice"
              options={[
                { value: 'Très intéressé(e)', label: 'Très intéressé(e)' },
                { value: 'Plutôt intéressé(e)', label: 'Plutôt intéressé(e)' },
                { value: 'Neutre', label: 'Neutre' },
                { value: 'Peu intéressé(e)', label: 'Peu intéressé(e)' },
                { value: 'Pas du tout intéressé(e)', label: 'Pas du tout intéressé(e)' }
              ]}
              value={formData.interetSolutionRepas}
              onChange={handleQuestionChange}
              required
            />

            <Question
              id="aspectsImportants"
              title="Quels aspects seraient les plus importants pour vous dans ce type de service ?"
              type="checkbox"
              options={[
                { value: 'Qualité des ingrédients', label: 'Qualité des ingrédients' },
                { value: 'Prix abordable', label: 'Prix abordable' },
                { value: 'Variété des menus', label: 'Variété des menus' },
                { value: 'Rapidité du service', label: 'Rapidité du service' },
                { value: 'Options diététiques', label: 'Options diététiques spécifiques' },
                { value: 'Emballage écologique', label: 'Emballage écologique' },
                { value: 'Possibilité de commander à l\'avance', label: 'Possibilité de commander à l\'avance' },
                { value: 'Autre', label: 'Autre' }
              ]}
              value={formData.aspectsImportants}
              onChange={handleQuestionChange}
              required
            />
            {formData.aspectsImportants.includes('Autre') && (
              <Input
                id="aspectsImportantsAutre"
                placeholder="Précisez l'aspect important"
                value={formData.aspectsImportantsAutre || ''}
                onChange={(e) => handleChange('aspectsImportantsAutre' as keyof FormData, e.target.value)}
                className="mt-2 ml-8"
              />
            )}
          </>
        )}

        {section.id === 5 && (
          <>
            <Question
              id="budgetJournalierRepas"
              title="Quel est votre budget journalier pour vos repas extérieurs ?"
              type="multiple-choice"
              options={[
                { value: 'Moins de 1 000 FCFA', label: 'Moins de 1 000 FCFA' },
                { value: '1 000 - 2 000 FCFA', label: '1 000 - 2 000 FCFA' },
                { value: '2 000 - 3 000 FCFA', label: '2 000 - 3 000 FCFA' },
                { value: '3 000 - 5 000 FCFA', label: '3 000 - 5 000 FCFA' },
                { value: 'Plus de 5 000 FCFA', label: 'Plus de 5 000 FCFA' }
              ]}
              value={formData.budgetJournalierRepas}
              onChange={handleQuestionChange}
              required
            />

            <Question
              id="prixMaxRepas"
              title="Quel serait le prix maximum que vous seriez prêt(e) à payer pour un repas préparé sain et de qualité ?"
              type="multiple-choice"
              options={[
                { value: 'Moins de 1 500 FCFA', label: 'Moins de 1 500 FCFA' },
                { value: '1 500 - 2 500 FCFA', label: '1 500 - 2 500 FCFA' },
                { value: '2 500 - 3 500 FCFA', label: '2 500 - 3 500 FCFA' },
                { value: '3 500 - 5 000 FCFA', label: '3 500 - 5 000 FCFA' },
                { value: 'Plus de 5 000 FCFA', label: 'Plus de 5 000 FCFA' }
              ]}
              value={formData.prixMaxRepas}
              onChange={handleQuestionChange}
              required
            />

            <Question
              id="budgetMensuelAbo"
              title="Si un service d'abonnement pour des repas quotidiens était disponible, quel budget mensuel seriez-vous prêt(e) à y consacrer ?"
              type="multiple-choice"
              options={[
                { value: 'Moins de 15 000 FCFA', label: 'Moins de 15 000 FCFA' },
                { value: '15 000 - 25 000 FCFA', label: '15 000 - 25 000 FCFA' },
                { value: '25 000 - 35 000 FCFA', label: '25 000 - 35 000 FCFA' },
                { value: '35 000 - 45 000 FCFA', label: '35 000 - 45 000 FCFA' },
                { value: 'Plus de 45 000 FCFA', label: 'Plus de 45 000 FCFA' }
              ]}
              value={formData.budgetMensuelAbo}
              onChange={handleQuestionChange}
              required
            />
          </>
        )}

        {section.id === 6 && (
          <>
            <Question
              id="commentaires"
              title="Avez-vous d'autres suggestions ou commentaires ?"
              type="paragraph"
              value={formData.commentaires || ''}
              onChange={handleQuestionChange}
            />
          </>
        )}

        <div className="flex justify-between mt-8">
          {currentSection > 1 && (
            <Button 
              type="button" 
              onClick={() => goToSection(currentSection - 1)}
              variant="secondary"
            >
              Section précédente
            </Button>
          )}
          
          {currentSection < formSections.length ? (
            <Button 
              type="button" 
              onClick={() => goToSection(currentSection + 1)}
              variant="primary"
              disabled={!isSectionComplete(currentSection)}
              className={!isSectionComplete(currentSection) ? 'opacity-50 cursor-not-allowed' : ''}
            >
              Section suivante
            </Button>
          ) : (
            <Button 
              type="submit" 
              disabled={submitting} 
              variant="primary" 
              className="text-lg px-8 py-3 submit-button"
            >
              {submitting ? 'Envoi en cours...' : 'Soumettre mes réponses'}
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="survey-form-container" ref={formRef}>
      <div className="survey-header">
        <h1 className="text-4xl font-bold text-green-700 mb-3">Sondage sur les solutions de repas</h1>
        <p className="text-gray-600">
          Nous cherchons à comprendre vos habitudes alimentaires et vos besoins pour développer des solutions adaptées.
        </p>
        
        {/* Hero image for the form */}
        <div className="mt-6 mb-8">
          <img 
            src="https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
            alt="Repas sains et délicieux" 
            className="form-hero-image"
          />
        </div>
        
        {error && (
          <div className="form-error-message">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="form-success-message">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            {successMessage}
          </div>
        )}
      </div>

      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="progress-text">Progression : {progress}% complété</p>
      </div>

      <div className="flex justify-center mb-6 space-x-2">
        {formSections.map((section) => (
          <button
            key={section.id}
            onClick={() => goToSection(section.id)}
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentSection === section.id 
                ? 'bg-green-600 text-white' 
                : isSectionComplete(section.id)
                ? 'bg-green-200 text-green-800'
                : 'bg-gray-200 text-gray-600'
            } transition-all`}
            title={section.title}
          >
            {section.id}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {renderQuestions()}
      </form>
    </div>
  );
};

export default EnhancedSurveyForm;
