import { gql } from '@apollo/client';

export const GET_CANVAS = gql`
  query GetCanvas($id: ID!) {
    canvas(id: $id) {
      id
      name
      icon
      workspaceId
      data
      createdAt
      updatedAt
    }
  }
`;

export const GET_CANVASES_BY_WORKSPACE = gql`
  query GetCanvasesByWorkspace($workspaceId: ID!) {
    canvasesByWorkspace(workspaceId: $workspaceId) {
      id
      name
      icon
      workspaceId
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_CANVAS = gql`
  mutation CreateCanvas($input: CreateCanvasInput!) {
    createCanvas(input: $input) {
      id
      name
      icon
      workspaceId
      createdAt
      updatedAt
    }
  }
`;

// The autosave. It asks for no `data` back: the client already has the scene.
export const UPDATE_CANVAS = gql`
  mutation UpdateCanvas($input: UpdateCanvasInput!) {
    updateCanvas(input: $input) {
      id
      name
      icon
      updatedAt
    }
  }
`;

export const REMOVE_CANVAS = gql`
  mutation RemoveCanvas($id: ID!) {
    removeCanvas(id: $id)
  }
`;

// Where the browser uploads an image pasted into a canvas
export const CREATE_CANVAS_FILE_UPLOAD = gql`
  mutation CreateCanvasFileUpload($input: CreateCanvasFileUploadInput!) {
    createCanvasFileUpload(input: $input) {
      uploadUrl
    }
  }
`;

// Links to read the images a canvas uses, when it opens
export const GET_CANVAS_FILES = gql`
  query GetCanvasFiles($canvasId: ID!) {
    canvasFiles(canvasId: $canvasId) {
      id
      mimeType
      url
    }
  }
`;
