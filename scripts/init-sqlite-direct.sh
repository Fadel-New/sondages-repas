#!/bin/bash
# Ce script initialise la base de données SQLite directement
# sans passer par Prisma qui peut avoir des problèmes de permission

# Définir l'emplacement de la base de données
DB_PATH="/tmp/sondages_repas.db"
echo "Utilisation de la base de données à $DB_PATH"

# Supprimer la base de données existante si elle existe
if [ -f "$DB_PATH" ]; then
  echo "Suppression de la base de données existante..."
  rm -f "$DB_PATH"
fi

# Créer le fichier de base de données et s'assurer qu'il a les bonnes permissions
echo "Création d'un nouveau fichier de base de données..."
touch "$DB_PATH"
chmod 666 "$DB_PATH"

# Créer les tables avec SQLite directement
echo "Création des tables de base de données..."
sqlite3 "$DB_PATH" << EOF
CREATE TABLE "Admin" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "username" TEXT NOT NULL UNIQUE,
  "password" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "SurveyResponse" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "ville" TEXT NOT NULL,
  "villeAutre" TEXT,
  "situationProfessionnelle" TEXT NOT NULL,
  "situationProfAutre" TEXT,
  "mangeExterieurFreq" TEXT NOT NULL,
  "tempsPreparationRepas" TEXT NOT NULL,
  "typesRepas" TEXT NOT NULL,
  "typesRepasAutre" TEXT,
  "defisAlimentation" TEXT NOT NULL,
  "defisAlimentationAutre" TEXT,
  "satisfactionAccesRepas" INTEGER NOT NULL,
  "interetSolutionRepas" TEXT NOT NULL,
  "aspectsImportants" TEXT NOT NULL,
  "aspectsImportantsAutre" TEXT,
  "budgetJournalierRepas" TEXT NOT NULL,
  "prixMaxRepas" TEXT NOT NULL,
  "budgetMensuelAbo" TEXT NOT NULL,
  "commentaires" TEXT
);
EOF

# Insérer un utilisateur admin
echo "Insertion de l'utilisateur admin par défaut..."
# Note: Cette méthode utilise un mot de passe en clair, ce qui n'est pas sécurisé
# En production, vous devriez utiliser une méthode de hachage comme bcrypt
CURRENT_DATE=$(date -Iseconds)
sqlite3 "$DB_PATH" << EOF
INSERT INTO "Admin" (username, password, updatedAt)
VALUES ('admin', 'password123', '$CURRENT_DATE');
EOF

echo "Vérification des permissions du fichier..."
ls -la "$DB_PATH"

echo "Initialisation de la base de données terminée."
