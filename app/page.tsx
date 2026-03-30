'use client';

import React, { useState, useEffect } from 'react';
import ProjectCards from './components/ProjectCards';
import ProjectDetails from './components/ProjectDetails';
import ProjectUpload from './components/ProjectUpload';
import { Project } from './types/Project';

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Mock data
  useEffect(() => {
    setProjects([
      {
        id: '1',
        name: 'Projeto Casa Moderna',
        description: 'Planta baixa de uma casa moderna com 3 quartos.',
        fileUrl: 'casa_moderna.dwg',
        uploadDate: new Date('2023-10-01'),
        status: 'completed',
      },
      {
        id: '2',
        name: 'Edifício Comercial',
        description: 'Projeto arquitetônico de um edifício comercial de 5 andares.',
        fileUrl: 'edificio_comercial.pdf',
        uploadDate: new Date('2023-10-05'),
        status: 'processing',
      },
      {
        id: '3',
        name: 'Apartamento Duplex',
        description: 'Planta de um apartamento duplex com vista para o mar.',
        fileUrl: 'apartamento_duplex.step',
        uploadDate: new Date('2023-10-10'),
        status: 'pending',
      },
    ]);
  }, []);

  const handleUpload = (newProject: Omit<Project, 'id' | 'uploadDate' | 'status'>) => {
    const project: Project = {
      ...newProject,
      id: Date.now().toString(),
      uploadDate: new Date(),
      status: 'pending',
    };
    setProjects([...projects, project]);
  };

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-black dark:text-zinc-50">
          Sistema de Gestão de Projetos CAD
        </h1>

        <div className="mb-8">
          <ProjectUpload onUpload={handleUpload} />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-black dark:text-zinc-50">Projetos em Cards</h2>
          <ProjectCards projects={projects} onSelect={handleSelectProject} />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-black dark:text-zinc-50">Detalhes dos Projetos</h2>
          <ProjectDetails projects={projects} />
        </div>

        {selectedProject && (
          <div className="mt-8 p-6 bg-white dark:bg-black rounded-xl shadow-md">
            <h3 className="text-xl font-bold mb-4 text-black dark:text-zinc-50">Projeto Selecionado</h3>
            <p><strong>Nome:</strong> {selectedProject.name}</p>
            <p><strong>Descrição:</strong> {selectedProject.description}</p>
            <p><strong>Status:</strong> {selectedProject.status}</p>
            <p><strong>Data:</strong> {selectedProject.uploadDate.toLocaleDateString('pt-BR')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
