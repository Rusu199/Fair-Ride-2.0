
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, className, ...props }) => {
  const baseStyles = "w-full h-12 rounded-lg font-medium text-base transition-transform active:scale-[0.98] flex items-center justify-center";

  const variantStyles = {
    primary: 'bg-primary-blue text-white shadow hover:bg-[#1D4ED8] disabled:bg-[#9CA3AF]',
    secondary: 'bg-transparent border border-primary-blue text-primary-blue hover:bg-blue-50',
    destructive: 'bg-status-error text-white hover:bg-red-700',
  };

  return (
    <button className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;