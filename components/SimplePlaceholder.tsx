
import React from 'react';
import { ICONS } from '../constants';

interface SimplePlaceholderProps {
  title: string;
  subtitle: string;
  description: string;
}

const SimplePlaceholder: React.FC<SimplePlaceholderProps> = ({ title, subtitle, description }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
         <h2 className="text-4xl font-black text-indigo-600">{title}</h2>
         <button className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold flex items-center space-x-2 shadow-lg hover:bg-indigo-700">
            {ICONS.Add}
            <span>Novo {title.split(' ').pop()}</span>
         </button>
      </div>

      <div className="bg-white p-24 rounded-3xl shadow-sm border border-gray-50 flex flex-col items-center justify-center text-center space-y-4">
         <div className="text-gray-500">
            <p className="text-xl font-bold">{subtitle}</p>
            <p className="font-medium mt-2">{description}</p>
         </div>
      </div>
    </div>
  );
};

export default SimplePlaceholder;
