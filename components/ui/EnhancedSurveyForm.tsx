// components/ui/EnhancedSurveyForm.tsx
import React, { useState, useEffect, FormEvent, useRef } from 'react';
import Image from 'next/image';
import Question from './Question';
import Button from './Button';
import Input from './Input';
import Modal from './Modal';
import PolitiqueConfidentialiteContent from './PolitiqueConfidentialiteContent';

// Définir la structure de l'état du formulaire
interface FormData {
  whatsappNumber: string;
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
  acceptePolitique: boolean;
}

const initialFormData: FormData = {
  whatsappNumber: '',
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
  acceptePolitique: false,
};

// Structure des sections du formulaire
const formSections = [
  {
    id: 1,
    title: "Contact & contexte",
    icon: "https://img.icons8.com/fluency/48/user-male-circle.png",
    questions: ["whatsappNumber"]
  },
  {
    id: 2,
    title: "Vos habitudes alimentaires",
    icon: "https://img.icons8.com/fluency/48/restaurant.png",
    questions: ["mangeExterieurFreq", "tempsPreparationRepas", "typesRepas"]
  },
  {
    id: 3,
    title: "Vos besoins et défis à Achimota",
    icon: "https://img.icons8.com/fluency/48/goal.png",
    questions: ["defisAlimentation", "satisfactionAccesRepas"]
  },
  {
    id: 4,
    title: "Votre intérêt pour Easy Meal",
    icon: "https://img.icons8.com/fluency/48/idea.png",
    questions: ["interetSolutionRepas", "aspectsImportants"]
  },
  {
    id: 5,
    title: "Votre budget (GHS)",
    icon: "https://img.icons8.com/fluency/48/money.png",
    questions: ["budgetJournalierRepas", "prixMaxRepas", "budgetMensuelAbo"]
  },
  {
    id: 6,
    title: "Commentaires",
    icon: "https://img.icons8.com/fluency/48/comments.png",
    questions: ["commentaires"]
  },
  // {
  //   id: 7,
  //   title: "Confirmation",
  //   icon: "https://img.icons8.com/fluency/48/checkmark.png",
  //   questions: ["acceptePolitique"]
  // }
];

const EnhancedSurveyForm = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState<number>(1);
  const [progress, setProgress] = useState<number>(0);
  const [animateSection, setAnimateSection] = useState<boolean>(false);
  const [isPolitiqueModalOpen, setIsPolitiqueModalOpen] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

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
      else if (typeof value === 'boolean' && value) filledFields++;
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
    if (!formData.whatsappNumber || !formData.mangeExterieurFreq || 
        !formData.tempsPreparationRepas || formData.typesRepas.length === 0 || 
        formData.defisAlimentation.length === 0 || formData.satisfactionAccesRepas === null || 
        !formData.interetSolutionRepas || formData.aspectsImportants.length === 0 || 
        !formData.budgetJournalierRepas || !formData.prixMaxRepas || !formData.budgetMensuelAbo || 
        !formData.acceptePolitique) {
        setError("Veuillez répondre à toutes les questions obligatoires et accepter la politique de confidentialité.");
        setSubmitting(false);
        // Scroll to the first error or a general error message display area
        window.scrollTo(0,0);
        return;
    }

    // Préparer les données à envoyer - assurez-vous que les champs facultatifs sont explicitement définis
    const dataToSend = {
      ...formData,
      // Assurez-vous que les champs optionnels ont des valeurs correctes
      commentaires: formData.commentaires || null,
      typesRepasAutre: formData.typesRepasAutre || null,
      defisAlimentationAutre: formData.defisAlimentationAutre || null,
      aspectsImportantsAutre: formData.aspectsImportantsAutre || null
    };

    try {
      console.log('Envoi des données du formulaire...');
      
      // Utilise l'API directe à la place de l'API Prisma
      const response = await fetch('/api/submit-survey-direct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.message || 'Une erreur est survenue.');
      }

      setSuccessMessage('Merci pour votre participation ! Votre réponse a été enregistrée.');
      setFormData(initialFormData); // Reset form
      window.scrollTo(0,0);
      setCurrentSection(1); // Retour à la première section
    } catch (err: unknown) {
      console.error('Erreur de soumission:', err);
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(`Erreur lors de l'enregistrement de votre réponse: ${errorMessage}`);
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
      // Champs facultatifs
      if (field === 'commentaires') return true;
      if (Array.isArray(value)) return value.length > 0;
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
              id="whatsappNumber"
              title="Quel est votre numéro WhatsApp ?"
              type="text"
              inputType="tel"
              placeholder="+233 50 123 4567"
              helperText="Format recommandé : +233 XX XXX XXXX"
              value={formData.whatsappNumber}
              onChange={handleQuestionChange}
              required
            />
          </>
        )}

        {section.id === 2 && (
          <>
            <Question
              id="mangeExterieurFreq"
              title="À quelle fréquence mangez-vous à l'extérieur (chop bar, fast-food, cantine) ?"
              type="multiple-choice"
              options={[
                { value: 'Tous les jours', label: 'Tous les jours' },
                { value: '4-5 fois par semaine', label: '4-5 fois par semaine' },
                { value: '2-3 fois par semaine', label: '2-3 fois par semaine' },
                { value: '1 fois par semaine', label: '1 fois par semaine' },
                { value: 'Rarement', label: 'Rarement' }
              ]}
              value={formData.mangeExterieurFreq}
              onChange={handleQuestionChange}
              required
            />

            <Question
              id="tempsPreparationRepas"
              title="Combien de temps passez-vous en moyenne à préparer vos repas (courses + cuisine) ?"
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
              title="Quels sont les principaux défis que vous rencontrez concernant votre alimentation à Achimota (Accra) ?"
              type="checkbox"
              options={[
                { value: 'Prix élevés des repas à Achimota', label: 'Prix élevés des repas à Achimota' },
                { value: 'Manque de temps pour cuisiner', label: 'Manque de temps pour cuisiner' },
                { value: 'Pas de cuisine/équipement au hostel', label: 'Pas de cuisine/équipement au hostel' },
                { value: 'Hygiène incertaine des street-food/chop bars', label: 'Hygiène incertaine des street-food/chop bars' },
                { value: 'Difficulté à trouver des plats familiers (francophones)', label: 'Difficulté à trouver des plats familiers (francophones)' },
                { value: 'Manque de variété ou d\'options saines', label: 'Manque de variété ou d\'options saines' },
                { value: 'Contraintes diététiques/allergies', label: 'Contraintes diététiques/allergies' },
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
              <h3 className="question-title">Sur une échelle de 1 à 5, quel est votre niveau de satisfaction concernant l'accès à des repas sains et familiers à Achimota (Accra) ?</h3>
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
                  value={formData.satisfactionAccesRepas || 1}
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
              title="Seriez-vous intéressé(e) par un abonnement Easy Meal (repas chauds livrés du lundi au vendredi à Achimota ou à votre hostel) ?"
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
                { value: 'Prix abordable', label: 'Prix abordable' },
                { value: 'Prix stable via abonnement', label: 'Prix stable via abonnement' },
                { value: 'Qualité / hygiène', label: 'Qualité / hygiène' },
                { value: 'Plats familiers (francophones)', label: 'Plats familiers (francophones)' },
                { value: 'Livraison sur campus/hostel', label: 'Livraison sur campus/hostel' },
                { value: 'Portions copieuses', label: 'Portions copieuses' },
                { value: 'Variété des menus', label: 'Variété des menus' },
                { value: 'Options diététiques', label: 'Options diététiques spécifiques' },
                { value: 'Ponctualité du service', label: 'Ponctualité du service' },
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
              title="Quel est votre budget journalier pour vos repas extérieurs (GHS) ?"
              type="multiple-choice"
              options={[
                { value: 'Moins de 20 GHS', label: 'Moins de 20 GHS' },
                { value: '20 - 40 GHS', label: '20 - 40 GHS' },
                { value: '40 - 60 GHS', label: '40 - 60 GHS' },
                { value: '60 - 80 GHS', label: '60 - 80 GHS' },
                { value: 'Plus de 80 GHS', label: 'Plus de 80 GHS' }
              ]}
              value={formData.budgetJournalierRepas}
              onChange={handleQuestionChange}
              required
            />

            <Question
              id="prixMaxRepas"
              title="Quel serait le prix maximum que vous seriez prêt(e) à payer pour un repas sain et de qualité (GHS) ?"
              type="multiple-choice"
              options={[
                { value: 'Moins de 35 GHS', label: 'Moins de 35 GHS' },
                { value: '35 - 45 GHS', label: '35 - 45 GHS' },
                { value: '45 - 55 GHS', label: '45 - 55 GHS' },
                { value: '55 - 70 GHS', label: '55 - 70 GHS' },
                { value: 'Plus de 70 GHS', label: 'Plus de 70 GHS' }
              ]}
              value={formData.prixMaxRepas}
              onChange={handleQuestionChange}
              required
            />

            <Question
              id="budgetMensuelAbo"
              title="Si un abonnement mensuel (20 jours) était disponible, quel budget mensuel seriez-vous prêt(e) à y consacrer (GHS) ?"
              type="multiple-choice"
              options={[
                { value: '500 - 550 GHS', label: '500 - 550 GHS' },
                { value: '550 - 600 GHS', label: '550 - 600 GHS' },
                { value: '600 - 650 GHS', label: '600 - 650 GHS' },
                { value: '650 - 700 GHS', label: '650 - 700 GHS' }
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

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-green-700 mb-4">Politique de confidentialité</h3>
              <div className="flex items-start mt-2">
                <input
                  type="checkbox"
                  id="acceptePolitique"
                  name="acceptePolitique"
                  checked={formData.acceptePolitique}
                  onChange={(e) => handleChange('acceptePolitique', e.target.checked)}
                  className="mt-1 mr-2 h-5 w-5 text-green-600 transition duration-150 ease-in-out"
                />
                <label htmlFor="acceptePolitique" className="ml-2 block text-sm leading-5 text-gray-700">
                  J'ai lu et j'accepte la <button 
                    type="button" 
                    onClick={(e) => {
                      e.preventDefault();
                      setIsPolitiqueModalOpen(true);
                    }} 
                    className="text-green-600 hover:text-green-800 underline">politique de confidentialité</button> concernant le traitement de mes données personnelles.
                </label>
              </div>
              {!formData.acceptePolitique && error && (
                <p className="mt-2 text-sm text-red-600">
                  Vous devez accepter la politique de confidentialité pour soumettre le formulaire.
                </p>
              )}
            </div>
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
              type="button" 
              onClick={(e) => handleSubmit(e as any)}
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
        <h1 className="text-4xl font-bold text-green-700 mb-3">Sondage Easy Meal - Ghana (Achimota)</h1>
        <p className="text-gray-600">
          Bonjour ! Nous réalisons une étude auprès des étudiants à Achimota (Accra) afin d'améliorer l'accès à des repas quotidiens sains, pratiques et abordables. Vos réponses nous aideront à concevoir un service adapté à la réalité du Ghana (prix, temps, qualité, goûts). Merci pour votre contribution.
        </p>
        
        {/* Hero image for the form */}
        <div className="mt-6 mb-8">
          <Image 
            src="/images/repas.jpeg"
            alt="Repas sains et délicieux"
            className="form-hero-image"
            width={800}
            height={350}
            priority
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

      {/* Utilisation d'une div au lieu d'un form pour éviter la soumission automatique */}
      <div className="space-y-10">
        {renderQuestions()}
      </div>

      {/* Modal de Politique de confidentialité */}
      <Modal 
        isOpen={isPolitiqueModalOpen} 
        onClose={() => setIsPolitiqueModalOpen(false)} 
        title="Politique de confidentialité"
      >
        <PolitiqueConfidentialiteContent />
      </Modal>
    </div>
  );
};

export default EnhancedSurveyForm;
