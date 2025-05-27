// components/ui/Button.tsx
import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
}

const Button: React.FC<ButtonProps> = ({ children, className = '', variant = 'primary', size = 'medium', ...props }) => {
  const baseStyle = "font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 transition-all duration-150 ease-in-out";
  const variantStyles = {
    primary: "bg-green-500 hover:bg-green-600 text-white focus:ring-green-400",
    secondary: "bg-gray-500 hover:bg-gray-600 text-white focus:ring-gray-400",
    danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-400",
  };
  
  const sizeStyles = {
    small: "py-1 px-3 text-sm",
    medium: "py-2 px-4",
    large: "py-3 px-6 text-lg",
  };
  
  return (
    <button className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${className || ''}`} {...props}>
      {children}
    </button>
  );
};

export default Button;

