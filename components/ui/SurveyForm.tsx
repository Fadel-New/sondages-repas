// components/ui/SurveyForm.tsx
import React, { useState, useEffect, FormEvent, useRef } from 'react';
import { useRouter } from 'next/router';
import Question from './Question';
import Button from './Button';
import Input from './Input';
import Image from 'next/image';

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

const SurveyForm = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState<number>(1);
  const [progress, setProgress] = useState<number>(0);
  const [animateSection, setAnimateSection] = useState<boolean>(false);
  const formRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleChange = (id: keyof FormData, value: any, otherValue?: string) => {
    if (id.endsWith('Autre')) {
      setFormData(prev => ({ ...prev, [id]: value }));
    } else if (otherValue !== undefined) {
      // Pour les questions avec "Autre (préciser)"
      const mainField = id as keyof FormData;
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


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    // Validation simple (à améliorer si besoin)
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
      // Optionnel: rediriger ou afficher un message de succès permanent
      // router.push('/merci');
    } catch (err: any) {
      setError(err.message);
      window.scrollTo(0,0);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-green-700 mb-3">Sondage sur les solutions de repas</h1>
        <p className="text-gray-600">
          Bonjour ! Nous réalisons une étude pour mieux comprendre les habitudes alimentaires et les besoins des habitants de Cotonou et Abomey-Calavi. Vos réponses nous aideront à développer des solutions de repas pratiques et adaptées à vos attentes. Vos informations resteront confidentielles. Merci de votre participation !
        </p>
      </div>

      {error && <div className="mb-6 p-4 bg-red-100 text-red-700 border border-red-300 rounded-md">{error}</div>}
      {successMessage && <div className="mb-6 p-4 bg-green-100 text-green-700 border border-green-300 rounded-md">{successMessage}</div>}

      {/* Section 1: À propos de vous */}
      <section>
        <h2 className="text-2xl font-semibold text-green-600 border-b-2 border-green-200 pb-2 mb-6">Section 1: À propos de vous</h2>
        <Question
          id="ville"
          title="Dans quelle ville du Bénin résidez-vous ?"
          type="text-with-other"
          options={[
            { value: 'Cotonou', label: 'Cotonou' },
            { value: 'Porto-Novo', label: 'Porto-Novo' },
            { value: 'Abomey-Calavi', label: 'Abomey-Calavi' },
            { value: 'Parakou', label: 'Parakou' },
            { value: 'Djougou', label: 'Djougou' },
            { value: 'Bohicon', label: 'Bohicon' },
            { value: 'Natitingou', label: 'Natitingou' },
            { value: 'Ouidah', label: 'Ouidah' },
            { value: 'Autre', label: 'Autre (préciser)' },
          ]}
          value={formData.ville}
          otherValue={formData.villeAutre}
          showOtherInput={formData.ville === 'Autre'}
          onChange={(id, val, otherVal) => handleChange(id as keyof FormData, val, otherVal)}
          required
        />
        <Question
          id="situationProfessionnelle"
          title="Quelle est votre situation professionnelle ?"
          type="text-with-other"
          options={[
            { value: 'Étudiant', label: 'Étudiant(e)' },
            { value: 'Salarié(e)', label: 'Salarié(e)' },
            { value: 'Indépendant(e)', label: 'Indépendant(e)' },
            { value: 'Sans emploi', label: 'Sans emploi' },
            { value: 'Autre', label: 'Autre (préciser)' },
          ]}
          value={formData.situationProfessionnelle}
          otherValue={formData.situationProfAutre}
          showOtherInput={formData.situationProfessionnelle === 'Autre'}
          onChange={(id, val, otherVal) => handleChange(id as keyof FormData, val, otherVal)}
          required
        />
      </section>

      {/* Section 2: Vos habitudes alimentaires */}
      <section>
        <h2 className="text-2xl font-semibold text-green-600 border-b-2 border-green-200 pb-2 mb-6">Section 2: Vos habitudes alimentaires</h2>
        <Question
          id="mangeExterieurFreq"
          title="Combien de fois par semaine mangez-vous généralement à l'extérieur (restaurants, maquis, rue) ?"
          type="multiple-choice"
          options={[
            { value: 'Tous les jours', label: 'Tous les jours' },
            { value: '4-6 fois par semaine', label: '4-6 fois par semaine' },
            { value: '1-3 fois par semaine', label: '1-3 fois par semaine' },
            { value: 'Rarement', label: 'Rarement' },
            { value: 'Jamais', label: 'Jamais' },
          ]}
          value={formData.mangeExterieurFreq}
          onChange={handleChange}
          required
        />
        <Question
          id="tempsPreparationRepas"
          title="Combien de temps en moyenne consacrez-vous chaque jour à la préparation de vos repas (courses, cuisine, vaisselle) ?"
          type="multiple-choice"
          options={[
            { value: 'Moins de 30 minutes', label: 'Moins de 30 minutes' },
            { value: '30 minutes - 1 heure', label: '30 minutes - 1 heure' },
            { value: '1 heure - 2 heures', label: '1 heure - 2 heures' },
            { value: 'Plus de 2 heures', label: 'Plus de 2 heures' },
            { value: 'Je ne cuisine pas', label: 'Je ne cuisine pas' },
          ]}
          value={formData.tempsPreparationRepas}
          onChange={handleChange}
          required
        />
        <Question
          id="typesRepas"
          title="Quels types de repas consommez-vous habituellement ?"
          type="checkbox"
          options={[
            { value: 'Plats locaux (pâte, riz, etc.)', label: 'Plats locaux (pâte, riz, etc.)' },
            { value: 'Plats internationaux (pâtes, sandwichs, etc.)', label: 'Plats internationaux (pâtes, sandwichs, etc.)' },
            { value: 'Repas rapides (fast-food)', label: 'Repas rapides (fast-food)' },
            { value: 'Repas de rue', label: 'Repas de rue' },
            { value: 'Repas cuisinés à la maison', label: 'Repas cuisinés à la maison' },
            // { value: 'Autre', label: 'Autre (préciser)' }, // Géré avec showOtherInput et un champ texte séparé si nécessaire
          ]}
          value={formData.typesRepas}
          onChange={handleChange}
          showOtherInput={true} // Toujours montrer l'input pour "Autre" pour les checkboxes
          otherValue={formData.typesRepasAutre}
          // required // Pour les checkboxes, la validation de "au moins un coché" est plus complexe, gérée dans handleSubmit
        />
         <Input
            label="Autre type de repas (préciser si coché 'Autre' ou pour ajouter)"
            name="typesRepasAutre"
            value={formData.typesRepasAutre || ''}
            onChange={(e) => handleChange('typesRepasAutre' as keyof FormData, e.target.value)}
            className="mt-2 ml-8"
        />
      </section>

      {/* Section 3: Vos besoins et défis */}
      <section>
        <h2 className="text-2xl font-semibold text-green-600 border-b-2 border-green-200 pb-2 mb-6">Section 3: Vos besoins et défis</h2>
        <Question
          id="defisAlimentation"
          title="Quels sont les principaux défis que vous rencontrez concernant votre alimentation quotidienne ?"
          type="checkbox"
          options={[
            { value: 'Manque de temps pour cuisiner', label: 'Manque de temps pour cuisiner' },
            { value: 'Coût élevé des repas extérieurs', label: 'Coût élevé des repas extérieurs' },
            { value: 'Préoccupation concernant l\'hygiène des repas extérieurs', label: 'Préoccupation concernant l\'hygiène des repas extérieurs' },
            { value: 'Manque de variété dans les options disponibles', label: 'Manque de variété dans les options disponibles' },
            { value: 'Difficulté à trouver des repas sains et équilibrés', label: 'Difficulté à trouver des repas sains et équilibrés' },
          ]}
          value={formData.defisAlimentation}
          onChange={handleChange}
          showOtherInput={true}
          otherValue={formData.defisAlimentationAutre}
        />
        <Input
            label="Autre défi (préciser)"
            name="defisAlimentationAutre"
            value={formData.defisAlimentationAutre || ''}
            onChange={(e) => handleChange('defisAlimentationAutre' as keyof FormData, e.target.value)}
            className="mt-2 ml-8"
        />
        <Question
          id="satisfactionAccesRepas"
          title="Dans quelle mesure êtes-vous satisfait(e) de la facilité d'accès à des repas abordables et de bonne qualité au quotidien ?"
          type="linear-scale"
          scaleMin={1}
          scaleMax={5}
          scaleMinLabel="Pas du tout satisfait"
          scaleMaxLabel="Très satisfait"
          value={formData.satisfactionAccesRepas}
          onChange={handleChange}
          required
        />
      </section>

      {/* Section 4: Intérêt pour une solution de repas */}
      <section>
        <h2 className="text-2xl font-semibold text-green-600 border-b-2 border-green-200 pb-2 mb-6">Section 4: Intérêt pour une solution de repas</h2>
        <Question
          id="interetSolutionRepas"
          title="Seriez-vous intéressé(e) par une solution qui vous permettrait de recevoir chaque jour des repas sains, variés et à un prix abordable, livrés directement chez vous ou sur votre lieu de travail ?"
          type="multiple-choice"
          options={[
            { value: 'Oui', label: 'Oui' },
            { value: 'Peut-être', label: 'Peut-être' },
            { value: 'Non', label: 'Non' },
          ]}
          value={formData.interetSolutionRepas}
          onChange={handleChange}
          required
        />
        <Question
          id="aspectsImportants"
          title="Quels aspects seraient les plus importants pour vous dans une telle solution ?"
          type="checkbox"
          options={[
            { value: 'Variété des menus', label: 'Variété des menus' },
            { value: 'Qualité des ingrédients', label: 'Qualité des ingrédients' },
            { value: 'Garantie d\'hygiène', label: 'Garantie d\'hygiène' },
            { value: 'Prix abordable', label: 'Prix abordable' },
            { value: 'Flexibilité des horaires de livraison', label: 'Flexibilité des horaires de livraison' },
            { value: 'Facilité de commande (application mobile)', label: 'Facilité de commande (application mobile)' },
            { value: 'Support à l\'économie locale (produits locaux)', label: 'Support à l\'économie locale (produits locaux)' },
          ]}
          value={formData.aspectsImportants}
          onChange={handleChange}
          showOtherInput={true}
          otherValue={formData.aspectsImportantsAutre}
        />
        <Input
            label="Autre aspect important (préciser)"
            name="aspectsImportantsAutre"
            value={formData.aspectsImportantsAutre || ''}
            onChange={(e) => handleChange('aspectsImportantsAutre' as keyof FormData, e.target.value)}
            className="mt-2 ml-8"
        />
      </section>

      {/* Section 5: Budget et prix */}
      <section>
        <h2 className="text-2xl font-semibold text-green-600 border-b-2 border-green-200 pb-2 mb-6">Section 5: Budget et prix</h2>
        <Question
          id="budgetJournalierRepas"
          title="Quel est votre budget moyen par jour pour vos repas (petit-déjeuner, déjeuner et dîner) ?"
          type="multiple-choice"
          options={[
            { value: 'Moins de 1000 FCFA', label: 'Moins de 1000 FCFA' },
            { value: '1000 - 1500 FCFA', label: '1000 - 1500 FCFA' },
            { value: '1500 - 2000 FCFA', label: '1500 - 2000 FCFA' },
            { value: '2000 - 2500 FCFA', label: '2000 - 2500 FCFA' },
            { value: 'Plus de 2500 FCFA', label: 'Plus de 2500 FCFA' },
          ]}
          value={formData.budgetJournalierRepas}
          onChange={handleChange}
          required
        />
        <Question
          id="prixMaxRepas"
          title="Quel prix maximum seriez-vous prêt(e) à payer pour un repas (déjeuner ou dîner) de bonne qualité, livré à votre convenance ?"
          type="multiple-choice"
          options={[
            { value: 'Moins de 500 FCFA', label: 'Moins de 500 FCFA' },
            { value: '500 - 750 FCFA', label: '500 - 750 FCFA' },
            { value: '750 - 1000 FCFA', label: '750 - 1000 FCFA' },
            { value: '1000 - 1250 FCFA', label: '1000 - 1250 FCFA' },
            { value: 'Plus de 1250 FCFA', label: 'Plus de 1250 FCFA' },
          ]}
          value={formData.prixMaxRepas}
          onChange={handleChange}
          required
        />
        <Question
          id="budgetMensuelAbo"
          title="Quel serait votre budget mensuel maximum pour un abonnement à un service proposant la livraison de repas quotidiens (petit-déjeuner, déjeuner et dîner) ?"
          type="multiple-choice"
          options={[
            { value: 'Moins de 15 000 FCFA', label: 'Moins de 15 000 FCFA' },
            { value: '15 000 - 25 000 FCFA', label: '15 000 - 25 000 FCFA' },
            { value: '25 000 - 35 000 FCFA', label: '25 000 - 35 000 FCFA' },
            { value: '35 000 - 45 000 FCFA', label: '35 000 - 45 000 FCFA' },
            { value: 'Plus de 45 000 FCFA', label: 'Plus de 45 000 FCFA' },
          ]}
          value={formData.budgetMensuelAbo}
          onChange={handleChange}
          required
        />
      </section>

      {/* Section 6: Commentaires */}
      <section>
        <h2 className="text-2xl font-semibold text-green-600 border-b-2 border-green-200 pb-2 mb-6">Section 6: Commentaires</h2>
        <Question
          id="commentaires"
          title="Avez-vous d'autres suggestions ou commentaires ?"
          type="paragraph"
          value={formData.commentaires}
          onChange={handleChange}
        />
      </section>

      <div className="text-center pt-6">
        <Button type="submit" disabled={submitting} variant="primary" className="text-lg px-8 py-3">
          {submitting ? 'Envoi en cours...' : 'Soumettre mes réponses'}
        </Button>
      </div>
    </form>
  );
};

export default SurveyForm;