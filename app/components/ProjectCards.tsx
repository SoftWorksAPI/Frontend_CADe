import Image from 'next/image';
import { Project } from '../types/Project';

interface ProjectCardsProps {
  projects: Project[];
  onSelect: (project: Project) => void;
}

export default function ProjectCards({ projects, onSelect }: ProjectCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto p-6">
      {projects.map((project) => (
        <div
          key={project.id}
          className="group cursor-pointer bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
          onClick={() => onSelect(project)}
        >
          <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600 group-hover:from-blue-600 group-hover:to-purple-700 transition-colors">
            <Image
              src="/file.svg"
              alt={project.name}
              fill
              className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            />
            <div className="absolute top-4 right-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                project.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' :
                project.status === 'processing' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' :
                'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100'
              }`}>
                {project.status === 'pending' ? 'Pendente' : project.status === 'processing' ? 'Processando' : 'Concluído'}
              </span>
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold mb-2 text-black dark:text-zinc-50 truncate">{project.name}</h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-2">{project.description}</p>
            <div className="text-xs text-zinc-500 dark:text-zinc-500 mb-4">
              {new Date(project.uploadDate).toLocaleDateString('pt-BR')}
            </div>
            <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all group-hover:scale-105">
              Ver Detalhes
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
