import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ProjectState, defaultProjectState, TabType } from '../types';

interface ProjectContextType {
  state: ProjectState;
  updateState: (updates: Partial<ProjectState>) => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  resetState: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProjectState>(defaultProjectState);
  const [activeTab, setActiveTab] = useState<TabType>('setup');

  const updateState = (updates: Partial<ProjectState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const resetState = () => {
    setState(defaultProjectState);
  };

  return (
    <ProjectContext.Provider value={{ state, updateState, activeTab, setActiveTab, resetState }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}
