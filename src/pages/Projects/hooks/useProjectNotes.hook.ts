import { useState, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { GET_WORKSPACES } from '../../Workspace/Workspace.graphql';
import type { WorkspaceTypes } from '../../Workspace/types/workspace.types';

const NOTE_LIMIT = 8;

export type NoteSortOption = 'recent' | 'title-asc' | 'title-desc';

export type NoteFilterType = 'all' | 'linked-task' | 'has-cover';

export const useProjectNotes = (selectedGroupId: string | null = null) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [noteSortBy, setNoteSortBy] = useState<NoteSortOption>('recent');
  const [noteFilterType, setNoteFilterType] = useState<NoteFilterType>('all');
  const [prevSearch, setPrevSearch] = useState(searchTerm);
  const [prevGroupId, setPrevGroupId] = useState(selectedGroupId);

  // Invalidate page when search or active folder changes
  if (searchTerm !== prevSearch || selectedGroupId !== prevGroupId) {
    setPrevSearch(searchTerm);
    setPrevGroupId(selectedGroupId);
    setPage(1);
  }

  const { data, loading, error, refetch } = useQuery(GET_WORKSPACES, {
    variables: {
      search: searchTerm,
      projectId: selectedGroupId || undefined,
      limit: NOTE_LIMIT,
      offset: (page - 1) * NOTE_LIMIT,
    },
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  });

  const rawWorkspaces: WorkspaceTypes[] = useMemo(
    () => data?.result?.workspaces || [],
    [data],
  );
  const totalWorkspaces = data?.result?.totalCount ?? rawWorkspaces.length;
  const totalPages = Math.max(1, Math.ceil(totalWorkspaces / NOTE_LIMIT));

  // Client-side sort and filter by type (tasks/notes)
  const processedWorkspaces = useMemo(() => {
    let list = [...rawWorkspaces];

    if (noteFilterType === 'linked-task') {
      list = list.filter((w) => Boolean(w.taskId || w.task));
    } else if (noteFilterType === 'has-cover') {
      list = list.filter((w) => Boolean(w.coverImage));
    }

    list.sort((a, b) => {
      switch (noteSortBy) {
        case 'title-asc':
          return (a.title || '').localeCompare(b.title || '');
        case 'title-desc':
          return (b.title || '').localeCompare(a.title || '');
        case 'recent':
        default: {
          const aDate = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
          const bDate = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
          return bDate - aDate;
        }
      }
    });

    return list;
  }, [rawWorkspaces, noteFilterType, noteSortBy]);

  return {
    state: {
      page,
      totalPages,
      searchTerm,
      noteSortBy,
      noteFilterType,
      loading,
      error,
    },
    data: {
      notes: processedWorkspaces,
      totalNotes: totalWorkspaces,
    },
    actions: {
      setPage,
      setSearchTerm,
      setNoteSortBy,
      setNoteFilterType,
      refetchNotes: refetch,
    },
  };
};
