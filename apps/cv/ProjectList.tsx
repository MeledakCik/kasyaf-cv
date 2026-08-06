import React, { useState, useEffect } from 'react';
import { Project } from '../models/Project';

interface ProjectListProps {
  projects: Project[] | null;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  const [projectList, setProjectList] = useState<Project[] | null>(null);

  useEffect(() => {
    if (projects) {
      setProjectList(projects);
    }
  }, [projects]);

  return (
    <div>
      {projectList && projectList.map((project, index) => (
        <div key={index}>
          <h2>{project.name}</h2>
          <p>{project.description}</p>
        </div>
      ))}
    </div>
  );
};

export default ProjectList;