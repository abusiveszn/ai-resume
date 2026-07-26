import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Resume, PersonalInfo, Experience, Education, Skill, Project, Certification } from '@/types/resume';
import { defaultResume } from '@/types/resume';

interface ResumeContextType {
  resume: Resume;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  addExperience: (experience: Experience) => void;
  updateExperience: (id: string, experience: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  addEducation: (education: Education) => void;
  updateEducation: (id: string, education: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  addSkill: (skill: Skill) => void;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  removeSkill: (id: string) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  removeProject: (id: string) => void;
  addCertification: (cert: Certification) => void;
  updateCertification: (id: string, cert: Partial<Certification>) => void;
  removeCertification: (id: string) => void;
  loadResume: (resume: Resume) => void;
  resetResume: () => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export function ResumeProvider({ children }: { children: React.ReactNode }) {
  const [resume, setResume] = useState<Resume>(defaultResume);

  const updatePersonalInfo = useCallback((info: Partial<PersonalInfo>) => {
    setResume(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...info },
    }));
  }, []);

  const addExperience = useCallback((experience: Experience) => {
    setResume(prev => ({
      ...prev,
      experience: [...prev.experience, experience],
    }));
  }, []);

  const updateExperience = useCallback((id: string, experience: Partial<Experience>) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, ...experience } : exp
      ),
    }));
  }, []);

  const removeExperience = useCallback((id: string) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id),
    }));
  }, []);

  const addEducation = useCallback((education: Education) => {
    setResume(prev => ({
      ...prev,
      education: [...prev.education, education],
    }));
  }, []);

  const updateEducation = useCallback((id: string, education: Partial<Education>) => {
    setResume(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, ...education } : edu
      ),
    }));
  }, []);

  const removeEducation = useCallback((id: string) => {
    setResume(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id),
    }));
  }, []);

  const addSkill = useCallback((skill: Skill) => {
    setResume(prev => ({
      ...prev,
      skills: [...prev.skills, skill],
    }));
  }, []);

  const updateSkill = useCallback((id: string, skill: Partial<Skill>) => {
    setResume(prev => ({
      ...prev,
      skills: prev.skills.map(s =>
        s.id === id ? { ...s, ...skill } : s
      ),
    }));
  }, []);

  const removeSkill = useCallback((id: string) => {
    setResume(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.id !== id),
    }));
  }, []);

  const addProject = useCallback((project: Project) => {
    setResume(prev => ({
      ...prev,
      projects: [...prev.projects, project],
    }));
  }, []);

  const updateProject = useCallback((id: string, project: Partial<Project>) => {
    setResume(prev => ({
      ...prev,
      projects: prev.projects.map(p =>
        p.id === id ? { ...p, ...project } : p
      ),
    }));
  }, []);

  const removeProject = useCallback((id: string) => {
    setResume(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id),
    }));
  }, []);

  const addCertification = useCallback((cert: Certification) => {
    setResume(prev => ({
      ...prev,
      certifications: [...prev.certifications, cert],
    }));
  }, []);

  const updateCertification = useCallback((id: string, cert: Partial<Certification>) => {
    setResume(prev => ({
      ...prev,
      certifications: prev.certifications.map(c =>
        c.id === id ? { ...c, ...cert } : c
      ),
    }));
  }, []);

  const removeCertification = useCallback((id: string) => {
    setResume(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c.id !== id),
    }));
  }, []);

  const loadResume = useCallback((newResume: Resume) => {
    setResume(newResume);
  }, []);

  const resetResume = useCallback(() => {
    setResume(defaultResume);
  }, []);

  return (
    <ResumeContext.Provider
      value={{
        resume,
        updatePersonalInfo,
        addExperience,
        updateExperience,
        removeExperience,
        addEducation,
        updateEducation,
        removeEducation,
        addSkill,
        updateSkill,
        removeSkill,
        addProject,
        updateProject,
        removeProject,
        addCertification,
        updateCertification,
        removeCertification,
        loadResume,
        resetResume,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
}
