import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { ProjectState, defaultProjectState, TabType } from '../types';
import { calculateProjectMetrics, ProjectMetrics } from '../lib/calculations';

interface ProjectContextType {
  state: ProjectState;
  updateState: (updates: Partial<ProjectState>) => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  resetState: () => void;
  metrics: ProjectMetrics;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);
const STORAGE_KEY = 'mixed_use_destination_kickstart_state_v1';

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProjectState>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProjectState;
    try {
      return { ...defaultProjectState, ...JSON.parse(raw) } as ProjectState;
    } catch {
      return defaultProjectState;
    }
  });
  const [activeTab, setActiveTab] = useState<TabType>('setup');
  const metrics = useMemo(() => calculateProjectMetrics(state), [state]);

  const updateState = (updates: Partial<ProjectState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const resetState = () => {
    setState(defaultProjectState);
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return (
    <ProjectContext.Provider value={{ state, updateState, activeTab, setActiveTab, resetState, metrics }}>
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
