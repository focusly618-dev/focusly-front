import React from 'react';
import { Workspace } from '../Workspace/Workspace';
import type { WorkspaceProps } from '../Workspace/workspace.types';

export type ProjectsProps = WorkspaceProps;

/**
 * Canonical Projects page component.
 * Manages project workspaces, briefs, specifications, and associated tasks.
 */
export const Projects: React.FC<ProjectsProps> = (props) => {
  return <Workspace {...props} />;
};

export default Projects;
