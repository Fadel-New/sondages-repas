-- CreateTable
CREATE TABLE "Admin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SurveyResponse" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");
