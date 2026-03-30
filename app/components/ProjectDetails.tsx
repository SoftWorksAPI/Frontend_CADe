import { Project } from '../types/Project';

interface ProjectDetailsProps {
  projects: Project[];
}

export default function ProjectDetails({ projects }: ProjectDetailsProps) {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-black rounded-xl shadow-md">
      <h2 className="text-3xl font-bold mb-8 text-black dark:text-zinc-50">Informações dos Projetos</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
          <thead>
            <tr className="bg-zinc-50 dark:bg-zinc-900">
              <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">ID</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Descrição</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Data Upload</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Arquivo</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-black divide-y divide-zinc-200 dark:divide-zinc-800">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-900 dark:text-zinc-100">{project.id}</td>
                <td className="px-6 py-4 text-sm font-medium text-zinc-900 dark:text-zinc-50 max-w-xs truncate">{project.name}</td>
                <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400 max-w-md truncate">{project.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">
                  {new Date(project.uploadDate).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    project.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' :
                    project.status === 'processing' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' :
                    'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100'
                  }`}>
                    {project.status === 'pending' ? 'Pendente' : project.status === 'processing' ? 'Processando' : 'Concluído'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                  <a href={project.fileUrl || '#'} className="truncate max-w-xs block">
                    {project.fileUrl || 'N/A'}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {projects.length === 0 && (
        <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">
          <p className="text-lg">Nenhum projeto encontrado.</p>
          <p>Envie um projeto para começar!</p>
        </div>
      )}
    </div>
  );
}
