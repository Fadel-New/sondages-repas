// components/ui/Textarea.tsx
import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea: React.FC<TextareaProps> = ({ label, name, error, className, ...props }) => {
  // Fonction pour gérer les touches dans le textarea
  // Avec la nouvelle structure (div au lieu de form), nous n'avons plus besoin
  // d'empêcher le comportement par défaut de la touche Entrée
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Permettre d'ajouter des nouvelles lignes normalement avec la touche Entrée
    // sans se soucier de la soumission du formulaire (qui n'existe plus)
    
    // Passage de l'événement à onKeyDown si défini par le parent
    if (props.onKeyDown) {
      props.onKeyDown(e as any);
    }
  };
  
  return (
    <div className="mb-4 w-full">
      {label && <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <textarea
        id={name}
        name={name}
        rows={4}
        className={`mt-1 block w-full px-3 py-2 bg-white border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm ${className}`}
        onKeyDown={handleKeyDown}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      <p className="mt-1 text-xs text-gray-500">N'hésitez pas à écrire vos commentaires sur plusieurs lignes. Le formulaire ne sera envoyé que lorsque vous cliquerez sur le bouton "Soumettre mes réponses".</p>
    </div>
  );
};
export default Textarea;