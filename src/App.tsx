import React from 'react';
import { ProjectProvider, useProject } from './context/ProjectContext';
import { Header } from './components/Header';
import { TopDashboard } from './components/TopDashboard';
import { SetupTab } from './components/tabs/SetupTab';
import { AllocationTab } from './components/tabs/AllocationTab';
import { FSTab } from './components/tabs/FSTab';
import { CompareTab } from './components/tabs/CompareTab';

function MainContent() {
  const { activeTab, setActiveTab } = useProject();

  const tabs = [
    { id: 'setup', label: '1. Site & Regulation' },
    { id: 'allocation', label: '2. Vertical Program Mix' },
    { id: 'fs', label: '3. Feasibility Snapshot' },
    { id: 'compare', label: 'Compare Scenarios' },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans transition-colors flex flex-col">
      <Header />
      <TopDashboard />
      
      <main className={`flex-grow ${activeTab === 'compare' ? 'w-full' : 'max-w-7xl mx-auto w-full'} p-6 flex flex-col`}>
        <div className="mb-8 sticky top-[232px] z-30 bg-gray-50/95 dark:bg-gray-950/95 backdrop-blur border-b border-gray-200 dark:border-gray-800">
          <div className="flex space-x-8 pt-2">
            {tabs.slice(0, 3).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 text-sm font-semibold transition-colors relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                  activeTab === tab.id
                    ? 'text-blue-600 dark:text-blue-500'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-500" />
                )}
              </button>
            ))}
            <button
              onClick={() => setActiveTab('compare')}
              className={`pb-3 text-sm font-semibold transition-colors relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                activeTab === 'compare'
                  ? 'text-blue-600 dark:text-blue-500'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Compare Scenarios
              {activeTab === 'compare' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-500" />
              )}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'setup' && <SetupTab />}
        {activeTab === 'allocation' && <AllocationTab />}
        {activeTab === 'fs' && <FSTab />}
        {activeTab === 'compare' && <CompareTab />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ProjectProvider>
      <MainContent />
    </ProjectProvider>
  );
}
