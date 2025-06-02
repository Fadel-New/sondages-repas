// components/ui/Question.tsx
import React from 'react';
import Input from './Input';
import Textarea from './Textarea';

interface Option {
  value: string;
  label: string;
}

interface QuestionProps {
  id: string;
  title: string;
  type: 'multiple-choice' | 'checkbox' | 'linear-scale' | 'paragraph' | 'text-with-other' | 'email';
  options?: Option[];
  scaleMin?: number;
  scaleMax?: number;
  scaleMinLabel?: string;
  scaleMaxLabel?: string;
  value: any;
  onChange: (id: string, value: any, otherValue?: string) => void;
  otherValue?: string;
  showOtherInput?: boolean;
  required?: boolean;
}

const Question: React.FC<QuestionProps> = ({
  id, title, type, options = [], scaleMin = 1, scaleMax = 5, scaleMinLabel, scaleMaxLabel, value, onChange, otherValue, showOtherInput, required
}) => {
  const handleOtherInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(id, value, e.target.value); // Pass the main value along with the other value
  };

  const handleCheckboxChange = (optionValue: string) => {
    const newValue = Array.isArray(value) ? [...value] : [];
    const currentIndex = newValue.indexOf(optionValue);
    if (currentIndex === -1) {
      newValue.push(optionValue);
    } else {
      newValue.splice(currentIndex, 1);
    }
    onChange(id, newValue);
  };

  return (
    <div className="mb-8 p-6 bg-gray-50 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {title} {required && <span className="text-red-500">*</span>}
      </h3>
      {type === 'multiple-choice' && options.map(option => (
        <label key={option.value} className="flex items-center mb-2 p-3 hover:bg-green-100 rounded-md transition-colors cursor-pointer">
          <input
            type="radio"
            name={id}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(id, e.target.value)}
            className="form-radio h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300"
            required={required}
          />
          <span className="ml-3 text-gray-700">{option.label}</span>
        </label>
      ))}

      {type === 'text-with-other' && options.map(option => (
        <label key={option.value} className="flex items-center mb-2 p-3 hover:bg-green-100 rounded-md transition-colors cursor-pointer">
          <input
            type="radio"
            name={id}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(id, e.target.value, '')} // Reset other value if a main option is chosen
            className="form-radio h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300"
            required={required && !showOtherInput} // Required if "Autre" not selected
          />
          <span className="ml-3 text-gray-700">{option.label}</span>
        </label>
      ))}
      {type === 'text-with-other' && showOtherInput && (
        <div className="mt-2 ml-8">
          <Input
            type="text"
            placeholder="Préciser"
            value={otherValue || ''}
            onChange={handleOtherInputChange}
            className="text-sm"
            required={required && value === 'Autre'}
          />
        </div>
      )}


      {type === 'checkbox' && options.map(option => (
        <label key={option.value} className="flex items-center mb-2 p-3 hover:bg-green-100 rounded-md transition-colors cursor-pointer">
          <input
            type="checkbox"
            name={id}
            value={option.value}
            checked={Array.isArray(value) && value.includes(option.value)}
            onChange={() => handleCheckboxChange(option.value)}
            className="form-checkbox h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <span className="ml-3 text-gray-700">{option.label}</span>
        </label>
      ))}
      {type === 'checkbox' && showOtherInput && (
         <div className="mt-2 ml-8">
          <Input
            type="text"
            placeholder="Préciser Autre"
            value={otherValue || ''}
            onChange={handleOtherInputChange}
            className="text-sm"
          />
        </div>
      )}


      {type === 'linear-scale' && (
        <div className="flex items-center justify-between mt-2 space-x-2">
          {scaleMinLabel && <span className="text-sm text-gray-600">{scaleMinLabel}</span>}
          {Array.from({ length: (scaleMax - scaleMin + 1) }, (_, i) => scaleMin + i).map(num => (
            <label key={num} className="flex flex-col items-center cursor-pointer">
              <span className="text-sm mb-1">{num}</span>
              <input
                type="radio"
                name={id}
                value={num}
                checked={value === num}
                onChange={(e) => onChange(id, parseInt(e.target.value))}
                className="form-radio h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300"
                required={required}
              />
            </label>
          ))}
          {scaleMaxLabel && <span className="text-sm text-gray-600">{scaleMaxLabel}</span>}
        </div>
      )}

      {type === 'paragraph' && (
        <Textarea
          name={id}
          value={value || ''}
          onChange={(e) => onChange(id, e.target.value)}
          placeholder="Votre réponse..."
          required={required}
        />
      )}
      
      {type === 'email' && (
        <Input
          type="email"
          name={id}
          value={value || ''}
          onChange={(e) => onChange(id, e.target.value)}
          placeholder="exemple@domaine.com"
          required={required}
          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
        />
      )}
    </div>
  );
};

export default Question;