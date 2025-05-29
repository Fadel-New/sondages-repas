-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurveyResponse" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
    "commentaires" TEXT,

    CONSTRAINT "SurveyResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");
