import React from 'react';
import { Project } from '../types/Project';

interface ProjectListProps {
  projects: Project[] | null;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  if (!projects) return <div>Loading...</div>;

  return (
    <div>
      {projects?.map((project, index) => (
        <div key={index}>
          <h2>{project.name}</h2>
          <p>{project.description}</p>
        </div>
      ))}
    </div>
  );
};

export default ProjectList;