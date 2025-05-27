// types/index.ts

// Define the SurveyResponse type to match Prisma model with frontend type conversions
export interface SurveyResponse {
  id: number;
  createdAt: string; // ISO date string
  ville: string;
  villeAutre: string | null;
  situationProfessionnelle: string;
  situationProfAutre: string | null;
  mangeExterieurFreq: string;
  tempsPreparationRepas: string;
  typesRepas: string[]; // Array for frontend
  typesRepasAutre: string | null;
  defisAlimentation: string[]; // Array for frontend
  defisAlimentationAutre: string | null;
  satisfactionAccesRepas: number;
  interetSolutionRepas: string;
  aspectsImportants: string[]; // Array for frontend
  aspectsImportantsAutre: string | null;
  budgetJournalierRepas: string;
  prixMaxRepas: string;
  budgetMensuelAbo: string;
  commentaires: string | null;
}
