// components/ui/Textarea.tsx
import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea: React.FC<TextareaProps> = ({ label, name, error, className, ...props }) => {
  // Fonction pour gérer les touches dans le textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Si Enter est pressé sans Shift, on empêche la soumission automatique du formulaire
    // mais on permet quand même d'ajouter une nouvelle ligne (comportement par défaut)
    if (e.key === 'Enter') {
      // Ne pas empêcher le comportement par défaut, car nous ne sommes plus dans un form
      // Laisser l'entrée se produire normalement
    }
    
    // Passage de l'événement à onKeyDown si défini
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
      <p className="mt-1 text-xs text-gray-500">Appuyez sur Shift+Entrée pour ajouter une nouvelle ligne.</p>
    </div>
  );
};
export default Textarea;