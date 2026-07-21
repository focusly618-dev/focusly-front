import { gql } from '@apollo/client';

export const GET_WORKSPACES = gql`
  query GetWorkspaces(
    $search: String
    $groupId: String
    $limit: Int
    $offset: Int
  ) {
    workspaces(
      search: $search
      groupId: $groupId
      limit: $limit
      offset: $offset
    ) {
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
      }
      groupId
    }
  }
`;

export const CREATE_WORKSPACE = gql`
  mutation CreateWorkspace($createWorkspaceInput: CreateWorkspaceInput!) {
    createWorkspace(createWorkspaceInput: $createWorkspaceInput) {
      id
    }
  }
`;

export const UPDATE_WORKSPACE = gql`
  mutation UpdateWorkspace($updateWorkspaceInput: UpdateWorkspaceInput!) {
    updateWorkspace(updateWorkspaceInput: $updateWorkspaceInput) {
      id
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

// Project Group operations
export const GET_PROJECT_GROUPS = gql`
  query GetProjectGroups {
    projectGroups {
      id
      name
      color
      emoji
      workspaces {
        id
      }
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
    }
  }
`;

export const DELETE_PROJECT_GROUP = gql`
  mutation DeleteProjectGroup($id: ID!) {
    removeProjectGroup(id: $id)
  }
`;
