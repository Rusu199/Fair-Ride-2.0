
import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface HeaderProps {
  title: string;
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onBack }) => {
  return (
    <div className="bg-white dark:bg-slate-900 h-14 flex items-center justify-center relative shadow-sm border-b dark:border-slate-800 flex-shrink-0">
      {onBack && (
        <button onClick={onBack} className="absolute left-4 p-2 text-primary-blue">
          <ArrowLeft size={24} />
        </button>
      )}
      <h1 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">{title}</h1>
    </div>
  );
};

export default Header;
