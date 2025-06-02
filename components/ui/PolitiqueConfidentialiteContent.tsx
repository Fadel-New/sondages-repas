// components/ui/PolitiqueConfidentialiteContent.tsx
import React from 'react';

const PolitiqueConfidentialiteContent: React.FC = () => {
  return (
    <div className="prose max-w-none">
      <p className="text-lg mb-4">
        Dernière mise à jour : 2 juin 2025
      </p>

      <h2 className="text-2xl font-semibold text-green-600 mt-6 mb-3">Introduction</h2>
      <p>
        Nous nous engageons à protéger votre vie privée. Cette politique de confidentialité explique comment nous collectons, 
        utilisons et protégeons vos données personnelles lorsque vous participez à notre sondage sur les habitudes alimentaires.
      </p>

      <h2 className="text-2xl font-semibold text-green-600 mt-6 mb-3">Informations que nous collectons</h2>
      <p>
        Lorsque vous participez à notre sondage, nous collectons les informations suivantes:
      </p>
      <ul className="list-disc pl-6 my-4">
        <li>Adresse e-mail (facultative)</li>
        <li>Sexe</li>
        <li>Ville de résidence</li>
        <li>Situation professionnelle</li>
        <li>Habitudes alimentaires</li>
        <li>Préférences concernant les solutions de repas</li>
        <li>Budget consacré aux repas</li>
        <li>Commentaires (facultatifs)</li>
      </ul>

      <h2 className="text-2xl font-semibold text-green-600 mt-6 mb-3">Comment nous utilisons vos informations</h2>
      <p>
        Les informations collectées sont utilisées uniquement pour:
      </p>
      <ul className="list-disc pl-6 my-4">
        <li>Analyser les besoins en matière de solutions de repas</li>
        <li>Développer des offres adaptées aux attentes des consommateurs</li>
        <li>Établir des statistiques anonymes sur les habitudes alimentaires</li>
        <li>Vous contacter si vous avez indiqué votre adresse e-mail et accepté d'être contacté</li>
      </ul>

      <h2 className="text-2xl font-semibold text-green-600 mt-6 mb-3">Protection de vos données</h2>
      <p>
        Nous mettons en place des mesures de sécurité appropriées pour protéger vos données personnelles. 
        Vos réponses individuelles ne seront jamais partagées avec des tiers à des fins commerciales. 
        Les résultats du sondage ne seront présentés que sous forme agrégée.
      </p>

      <h2 className="text-2xl font-semibold text-green-600 mt-6 mb-3">Conservation des données</h2>
      <p>
        Nous conserverons vos données pendant une période maximale de 24 mois après la fin du sondage, 
        après quoi elles seront soit anonymisées, soit supprimées.
      </p>

      <h2 className="text-2xl font-semibold text-green-600 mt-6 mb-3">Vos droits</h2>
      <p>
        Conformément à la législation en vigueur, vous disposez des droits suivants:
      </p>
      <ul className="list-disc pl-6 my-4">
        <li>Droit d'accès à vos données</li>
        <li>Droit de rectification des informations inexactes</li>
        <li>Droit à l'effacement de vos données</li>
        <li>Droit d'opposition au traitement de vos données</li>
        <li>Droit à la limitation du traitement</li>
      </ul>

      <h2 className="text-2xl font-semibold text-green-600 mt-6 mb-3">Nous contacter</h2>
      <p>
        Pour toute question concernant notre politique de confidentialité ou pour exercer vos droits, 
        veuillez nous contacter à l'adresse suivante: privacy@sondages-repas.com
      </p>
    </div>
  );
};

export default PolitiqueConfidentialiteContent;
