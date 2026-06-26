import { gql } from '@apollo/client';

export const GET_TASKS = gql`
  query GetTasks(
    $userId: String!
    $filters: TaskFilterInput
    $sort: TaskSortInput
  ) {
    tasks: getTasksByUser(userId: $userId, filters: $filters, sort: $sort) {
      id
      title
      notes_encrypted
      status
      estimate_timer
      real_timer
      duration
      priority_level
      user_id
      is_owner
      category
      color
      use_ai
      tags {
        name
      }
      filters {
        status
        priorityLevel
        category
      }
      deadline
      created_at
      updated_at
      links {
        title
        url
      }
      google_event_id
      task_type
      source
      estimated_start_date
      estimated_end_date
      collaborators {
        name
        email
        avatar
        responseStatus
      }
      workspace {
        id
        title
        content
        updatedAt
      }
    }
  }
`;

export const GET_TASKS_TITLES = gql`
  query GetTasksTitles($userId: String!) {
    tasks: getTasksByUser(userId: $userId) {
      id
      title
      status
      estimate_timer
      real_timer
      duration
      priority_level
      user_id
      is_owner
      category
      color
      notes_encrypted
      use_ai
      tags {
        name
      }
      deadline
      created_at
      updated_at
      links {
        title
        url
      }
      google_event_id
      task_type
      source
      estimated_start_date
      estimated_end_date

      collaborators {
        name
        email
        avatar
        responseStatus
      }
      workspace {
        id
        title
      }
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask($updateTaskInput: UpdateTaskInput!) {
    updateTask(updateTaskInput: $updateTaskInput) {
      id
      user_id
      is_owner
      title
      notes_encrypted
      status
      category
      color
      use_ai
      estimate_timer
      real_timer
      duration
      tags {
        name
      }
      deadline
      created_at
      updated_at
      links {
        title
        url
      }
      google_event_id
      task_type
      source
      estimated_start_date
      estimated_end_date

      collaborators {
        name
        email
        avatar
        responseStatus
      }
      priority_level
    }
  }
`;

export const CREATE_TASK = gql`
  mutation CreateTask($createTaskInput: CreateTaskInput!) {
    createTask(createTaskInput: $createTaskInput) {
      id
      user_id
      is_owner
      title
      notes_encrypted
      status
      category
      color
      use_ai
      estimate_timer
      real_timer
      duration
      tags {
        name
      }
      deadline
      created_at
      updated_at
      links {
        title
        url
      }
      google_event_id
      task_type
      source
      estimated_start_date
      estimated_end_date

      collaborators {
        name
        email
        avatar
        responseStatus
      }
      priority_level
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: String!) {
    deleteTask(id: $id)
  }
`;

export const DELETE_TASKS = gql`
  mutation DeleteTasks($ids: [String!]!) {
    deleteTasks(ids: $ids)
  }
`;

export const DELETE_TAG = gql`
  mutation DeleteTag($id: ID!) {
    deleteTag(id: $id)
  }
`;

export const GET_TAGS = gql`
  query GetTagsByUser($userId: String!) {
    getTagsByUser(userId: $userId) {
      name
    }
  }
`;

export const GET_TASKS_PAGINATED = gql`
  query GetTasksByUserPaginated(
    $userId: String!
    $filters: TaskFilterInput
    $sort: TaskSortInput
    $offset: Int
    $limit: Int
  ) {
    result: getTasksByUserPaginated(
      userId: $userId
      filters: $filters
      sort: $sort
      offset: $offset
      limit: $limit
    ) {
      tasks {
        id
        title
        notes_encrypted
        status
        estimate_timer
        real_timer
        duration
        priority_level
        user_id
        is_owner
        category
        color
        use_ai
        tags {
          name
        }
        filters {
          status
          priorityLevel
          category
        }
        deadline
        created_at
        updated_at
        links {
          title
          url
        }
        google_event_id
        task_type
        source
        estimated_start_date
        estimated_end_date
        collaborators {
          name
          email
          avatar
          responseStatus
        }
        workspace {
          id
          title
          content
          updatedAt
        }
      }
      totalCount
    }
  }
`;
