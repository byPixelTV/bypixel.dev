import { Icon } from '@iconify/react';
import Image from 'next/image';

export type Project = {
  title: string;
  description: string;
  link: string;
  image: string;
  date: string;
  tech: Record<string, { icon: string; name: string }>;
};

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 group transition-all duration-300 flex flex-col h-full">
      {/* Image */}
      <div className="mb-4 flex justify-center items-center h-32 bg-white/5 rounded-xl">
        <Image
          src={project.image}
          alt={project.title}
          width={300}
          height={120}
          className="max-w-full max-h-[120px] object-contain"
          style={{ 
            width: 'auto',
            height: 'auto',
            maxWidth: '100%',
            maxHeight: '120px'
          }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-white">{project.title}</h3>
        <span className="text-sm text-gray-300 bg-white/10 px-3 py-1 rounded-full">{project.date}</span>
      </div>

      {/* Description */}
      <p className="text-gray-300 mb-6 flex-grow leading-relaxed">{project.description}</p>

      {/* Tech */}
      <div className="mb-6">
        <h4 className="text-white font-semibold mb-3">Tech Stack</h4>
        <div className="flex flex-wrap gap-2">
          {Object.values(project.tech).map((tech) => (
            <div
              key={tech.name}
              className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg hover:bg-white/20 transition-colors duration-200"
            >
              <Icon icon={tech.icon} width="20" height="20" className="text-white" />
              <span className="text-sm text-white">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Link */}
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-white hover:text-blue-400 transition-colors duration-200"
      >
        <Icon icon="mdi:external-link" width="20" height="20" />
        View Project
      </a>
    </div>
  );
}