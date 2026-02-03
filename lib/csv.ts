// lib/csv.ts
import Papa from 'papaparse';
import { SurveyResponse } from '@prisma/client'; // Assurez-vous que ce type est correct

export function convertToCsv(data: SurveyResponse[]): string {
  // Définir les entêtes souhaitées et l'ordre
  const headers = [
    "ID", "Date de création",
    "WhatsApp",
    "Mange Extérieur Fréquence", "Temps Préparation Repas",
    "Types Repas", "Types Repas (Autre)",
    "Défis Alimentation", "Défis Alimentation (Autre)", "Satisfaction Accès Repas",
    "Intérêt Solution Repas", "Aspects Importants", "Aspects Importants (Autre)",
    "Budget Journalier Repas (GHS)", "Prix Max Repas (GHS)", "Budget Mensuel Abonnement (GHS)",
    "Commentaires"
  ];

  const csvData = data.map(response => ({
    "ID": response.id,
    "Date de création": response.createdAt.toISOString(),
    "WhatsApp": response.whatsappNumber,
    "Mange Extérieur Fréquence": response.mangeExterieurFreq,
    "Temps Préparation Repas": response.tempsPreparationRepas,
    "Types Repas": Array.isArray(response.typesRepas) ? response.typesRepas.join('; ') : (response.typesRepas || ''),
    "Types Repas (Autre)": response.typesRepasAutre || '',
    "Défis Alimentation": Array.isArray(response.defisAlimentation) ? response.defisAlimentation.join('; ') : (response.defisAlimentation || ''),
    "Défis Alimentation (Autre)": response.defisAlimentationAutre || '',
    "Satisfaction Accès Repas": response.satisfactionAccesRepas,
    "Intérêt Solution Repas": response.interetSolutionRepas,
    "Aspects Importants": Array.isArray(response.aspectsImportants) ? response.aspectsImportants.join('; ') : (response.aspectsImportants || ''),
    "Aspects Importants (Autre)": response.aspectsImportantsAutre || '',
    "Budget Journalier Repas (GHS)": response.budgetJournalierRepas,
    "Prix Max Repas (GHS)": response.prixMaxRepas,
    "Budget Mensuel Abonnement (GHS)": response.budgetMensuelAbo,
    "Commentaires": response.commentaires || ''
  }));

  return Papa.unparse({
    fields: headers, // Utiliser les entêtes définies
    data: csvData.map(row => headers.map(header => row[header as keyof typeof row])) // Mapper les données selon l'ordre des entêtes
  });
}
