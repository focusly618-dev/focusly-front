import { gql } from '@apollo/client';

export const GET_WORKSPACES = gql`
  query GetWorkspaces($search: String, $groupId: String) {
    workspaces(search: $search, groupId: $groupId) {
      id
      title
      content
      emoji
      background_color
      card_show_background
      updatedAt
      createdAt
      task {
        id
        title
        status
        estimate_timer
        real_timer
        duration
        priority_level
        links {
          title
          url
        }
        google_event_id
        source
        created_at
      }
      projectId
      groupId
      project {
        id
        name
        color
        groupId
      }
    }
  }
`;

export const CREATE_WORKSPACE = gql`
  mutation CreateWorkspace($createWorkspaceInput: CreateWorkspaceInput!) {
    createWorkspace(createWorkspaceInput: $createWorkspaceInput) {
      id
      title
      content
      emoji
      background_color
      card_show_background
      updatedAt
      taskId
      projectId
      groupId
      saveStatus
      task {
        id
        title
        status
        estimate_timer
        real_timer
        duration
        priority_level
        source
        created_at
      }
    }
  }
`;

export const UPDATE_WORKSPACE = gql`
  mutation UpdateWorkspace($updateWorkspaceInput: UpdateWorkspaceInput!) {
    updateWorkspace(updateWorkspaceInput: $updateWorkspaceInput) {
      id
      title
      content
      emoji
      background_color
      card_show_background
      updatedAt
      taskId
      projectId
      groupId
      project {
        id
        name
        color
      }
      task {
        id
        title
        status
        estimate_timer
        real_timer
        duration
        priority_level
        source
        created_at
      }
    }
  }
`;

export const REMOVE_WORKSPACE = gql`
  mutation RemoveWorkspace($id: ID!) {
    removeWorkspace(id: $id)
  }
`;

export const GET_TOTAL_WORKSPACES = gql`
  query GetTotalWorkspaces {
    totalWorkspaces
  }
`;

export const GET_WORKSPACE_BY_ID = gql`
  query GetWorkspaceById($id: ID!) {
    workspace(id: $id) {
      id
      title
      content
      emoji
      background_color
      card_show_background
      taskId
      task {
        id
        title
        status
        estimate_timer
        real_timer
        duration
        priority_level
        notes_encrypted
        links {
          title
          url
        }
        google_event_id
        source
        created_at
      }
    }
  }
`;

export const GET_FOLDERS = gql`
  query GetProjects($groupId: String) {
    projects(groupId: $groupId) {
      id
      name
      color
      groupId
      workspaceCount
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_FOLDER = gql`
  mutation CreateProject($createProjectInput: CreateProjectInput!) {
    createProject(createProjectInput: $createProjectInput) {
      id
      name
      color
    }
  }
`;

export const UPDATE_FOLDER = gql`
  mutation UpdateProject($updateProjectInput: UpdateProjectInput!) {
    updateProject(updateProjectInput: $updateProjectInput) {
      id
      name
      color
    }
  }
`;

export const DELETE_FOLDER = gql`
  mutation DeleteProject($id: ID!) {
    removeProject(id: $id)
  }
`;

// Project Group operations
export const GET_PROJECT_GROUPS = gql`
  query GetProjectGroups {
    projectGroups {
      id
      name
      color
      emoji
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_PROJECT_GROUP = gql`
  mutation CreateProjectGroup($input: CreateProjectGroupInput!) {
    createProjectGroup(input: $input) {
      id
      name
      color
      emoji
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_PROJECT_GROUP = gql`
  mutation UpdateProjectGroup($input: UpdateProjectGroupInput!) {
    updateProjectGroup(input: $input) {
      id
      name
      color
      emoji
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_PROJECT_GROUP = gql`
  mutation DeleteProjectGroup($id: ID!) {
    removeProjectGroup(id: $id)
  }
`;
