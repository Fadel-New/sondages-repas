// lib/csv.ts
import Papa from 'papaparse';
import { SurveyResponse } from '@prisma/client'; // Assurez-vous que ce type est correct

export function convertToCsv(data: SurveyResponse[]): string {
  // Définir les entêtes souhaitées et l'ordre
  const headers = [
    "ID", "Date de création",
    "Ville", "Ville (Autre)", "Situation Professionnelle", "Situation Pro. (Autre)",
    "Mange Extérieur Fréquence", "Temps Préparation Repas",
    "Types Repas", "Types Repas (Autre)",
    "Défis Alimentation", "Défis Alimentation (Autre)", "Satisfaction Accès Repas",
    "Intérêt Solution Repas", "Aspects Importants", "Aspects Importants (Autre)",
    "Budget Journalier Repas", "Prix Max Repas", "Budget Mensuel Abonnement",
    "Commentaires"
  ];

  const csvData = data.map(response => ({
    "ID": response.id,
    "Date de création": response.createdAt.toISOString(),
    "Ville": response.ville,
    "Ville (Autre)": response.villeAutre || '',
    "Situation Professionnelle": response.situationProfessionnelle,
    "Situation Pro. (Autre)": response.situationProfAutre || '',
    "Mange Extérieur Fréquence": response.mangeExterieurFreq,
    "Temps Préparation Repas": response.tempsPreparationRepas,
    "Types Repas": Array.isArray(response.typesRepas) ? response.typesRepas.join('; ') : '', // Gérer le tableau
    "Types Repas (Autre)": response.typesRepasAutre || '',
    "Défis Alimentation": Array.isArray(response.defisAlimentation) ? response.defisAlimentation.join('; ') : '', // Gérer le tableau
    "Défis Alimentation (Autre)": response.defisAlimentationAutre || '',
    "Satisfaction Accès Repas": response.satisfactionAccesRepas,
    "Intérêt Solution Repas": response.interetSolutionRepas,
    "Aspects Importants": Array.isArray(response.aspectsImportants) ? response.aspectsImportants.join('; ') : '', // Gérer le tableau
    "Aspects Importants (Autre)": response.aspectsImportantsAutre || '',
    "Budget Journalier Repas": response.budgetJournalierRepas,
    "Prix Max Repas": response.prixMaxRepas,
    "Budget Mensuel Abonnement": response.budgetMensuelAbo,
    "Commentaires": response.commentaires || ''
  }));

  return Papa.unparse({
    fields: headers, // Utiliser les entêtes définies
    data: csvData.map(row => headers.map(header => row[header as keyof typeof row])) // Mapper les données selon l'ordre des entêtes
  });
}