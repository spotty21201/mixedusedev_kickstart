import React from 'react';
import { Info } from 'lucide-react';

export function InfoTip({ text }: { text: string }) {
  return (
    <span className="group relative inline-flex items-center">
      <Info size={14} className="text-gray-400" />
      <span className="pointer-events-none absolute left-5 top-1/2 z-20 hidden w-56 -translate-y-1/2 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 shadow-md group-hover:block dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
        {text}
      </span>
    </span>
  );
}
