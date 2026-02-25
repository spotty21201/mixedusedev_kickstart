import React from 'react';
import { Building2, RotateCcw, Download, Moon, Sun } from 'lucide-react';
import { useProject } from '../context/ProjectContext';

export function Header() {
  const { resetState } = useProject();
  const [isDark, setIsDark] = React.useState(false);

  const toggleDark = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50 transition-colors">
      <div className="flex items-center space-x-3">
        <div className="bg-blue-600 p-2 rounded-lg text-white">
          <Building2 size={20} />
        </div>
        <div>
          <h1 className="text-lg font-bold leading-tight text-gray-900 dark:text-white">
            Mixed Use Destination Kickstart v.1.2
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">
            Feasibility & Acquisition Tool
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button 
          onClick={resetState}
          className="flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 font-medium text-sm transition-colors"
        >
          <RotateCcw size={16} className="mr-1.5" />
          Reset
        </button>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors shadow-sm">
          <Download size={16} className="mr-1.5" />
          Export
        </button>
        <button 
          onClick={toggleDark}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </nav>
  );
}
