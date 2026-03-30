import React, { useState } from 'react';
import { Project } from '../types/Project';

interface ProjectUploadProps {
  onUpload: (project: Omit<Project, 'id' | 'uploadDate' | 'status'>) => void;
}

export default function ProjectUpload({ onUpload }: ProjectUploadProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && description && file) {
      onUpload({
        name,
        description,
        fileUrl: file.name, // Mock: nome arquivo
      });
      setName('');
      setDescription('');
      setFile(null);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-black rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-black dark:text-zinc-50">Enviar Projeto</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Nome do Projeto</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Descrição</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full p-3 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Arquivo CAD/Planta</label>
          <input
            type="file"
            accept=".dwg,.pdf,.step"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full p-3 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-zinc-700 file:text-blue-700 dark:file:text-zinc-300 hover:file:bg-blue-100 dark:hover:file:bg-zinc-600"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          Enviar Projeto
        </button>
      </form>
    </div>
  );
}
