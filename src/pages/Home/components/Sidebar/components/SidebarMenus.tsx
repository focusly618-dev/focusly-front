import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  EditOutlined as EditIcon,
  DeleteOutline as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { CreateProjectModal } from '@/pages/Workspace/components/Library/modals/CreateProjectModal';
import { UpdateProjectModal } from '@/pages/Workspace/components/Library/modals/UpdateProjectModal';
import type { UseSidebarReturn } from '../hooks/useSidebar';

interface SidebarMenusProps {
  sidebar: UseSidebarReturn;
}

export const SidebarMenus = ({ sidebar }: SidebarMenusProps) => {
  const {
    menuAnchor,
    activeMenuType,
    activeProjectItem,
    activeWorkspaceItem,
    activeGroupItem,
    isCreateProjectModalOpen,
    isUpdateProjectModalOpen,
    selectedProjectToManage,
    handleCloseMenu,
    handleDeleteProject,
    handleDeleteWorkspace,
    handleDeleteGroup,
    handleRenameGroupPrompt,
    setIsCreateProjectModalOpen,
    setIsUpdateProjectModalOpen,
    setSelectedProjectToManage,
    handleCreateProject,
    handleUpdateProject,
    setCreatingWorkspaceInFolderId,
    setCreatingWorkspaceInGroupId,
    setExpandedGroups,
  } = sidebar;

  return (
    <>
      {/* Context Menu for Project, Workspace or Group options */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleCloseMenu}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            borderRadius: '8px',
            mt: 0.5,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            minWidth: 140,
            bgcolor: 'background.paper',
            backgroundImage: 'none',
          },
        }}
      >
        {activeMenuType === 'project' && activeProjectItem && (
          <>
            <MenuItem
              onClick={() => {
                setSelectedProjectToManage(activeProjectItem);
                setIsUpdateProjectModalOpen(true);
                handleCloseMenu();
              }}
              sx={{ fontSize: '13px', py: 0.8 }}
            >
              <ListItemIcon sx={{ minWidth: 28 }}>
                <EditIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              </ListItemIcon>
              <ListItemText>Edit Folder</ListItemText>
            </MenuItem>
            <Divider sx={{ my: 0.5, opacity: 0.1 }} />
            <MenuItem
              onClick={() => {
                handleDeleteProject(activeProjectItem.id);
                handleCloseMenu();
              }}
              sx={{ fontSize: '13px', py: 0.8, color: 'error.main' }}
            >
              <ListItemIcon sx={{ minWidth: 28 }}>
                <DeleteIcon fontSize="small" sx={{ color: 'error.main' }} />
              </ListItemIcon>
              <ListItemText>Delete Folder</ListItemText>
            </MenuItem>
          </>
        )}

        {activeMenuType === 'workspace' && activeWorkspaceItem && (
          <>
            <MenuItem
              onClick={() => {
                handleDeleteWorkspace(activeWorkspaceItem.id);
                handleCloseMenu();
              }}
              sx={{ fontSize: '13px', py: 0.8, color: 'error.main' }}
            >
              <ListItemIcon sx={{ minWidth: 28 }}>
                <DeleteIcon fontSize="small" sx={{ color: 'error.main' }} />
              </ListItemIcon>
              <ListItemText>Delete note</ListItemText>
            </MenuItem>
          </>
        )}

        {activeMenuType === 'group' && activeGroupItem && (
          <>
            <MenuItem
              onClick={() => {
                setCreatingWorkspaceInFolderId(`general-${activeGroupItem.id}`);
                setCreatingWorkspaceInGroupId(activeGroupItem.id);
                setExpandedGroups((prev) => ({
                  ...prev,
                  [activeGroupItem.id]: true,
                }));
                handleCloseMenu();
              }}
              sx={{ fontSize: '13px', py: 0.8 }}
            >
              <ListItemIcon sx={{ minWidth: 28 }}>
                <AddIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              </ListItemIcon>
              <ListItemText>New Note</ListItemText>
            </MenuItem>
            <Divider sx={{ my: 0.5, opacity: 0.1 }} />
            <MenuItem
              onClick={() => {
                handleRenameGroupPrompt(activeGroupItem);
                handleCloseMenu();
              }}
              sx={{ fontSize: '13px', py: 0.8 }}
            >
              <ListItemIcon sx={{ minWidth: 28 }}>
                <EditIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              </ListItemIcon>
              <ListItemText>Rename Project</ListItemText>
            </MenuItem>
            <Divider sx={{ my: 0.5, opacity: 0.1 }} />
            <MenuItem
              onClick={() => {
                handleDeleteGroup(activeGroupItem.id);
                handleCloseMenu();
              }}
              sx={{ fontSize: '13px', py: 0.8, color: 'error.main' }}
            >
              <ListItemIcon sx={{ minWidth: 28 }}>
                <DeleteIcon fontSize="small" sx={{ color: 'error.main' }} />
              </ListItemIcon>
              <ListItemText>Delete Project</ListItemText>
            </MenuItem>
          </>
        )}
      </Menu>

      {/* Project Modals */}
      <CreateProjectModal
        open={isCreateProjectModalOpen}
        onClose={() => setIsCreateProjectModalOpen(false)}
        onCreate={handleCreateProject}
      />

      <UpdateProjectModal
        key={selectedProjectToManage?.id || 'new'}
        open={isUpdateProjectModalOpen}
        onClose={() => {
          setIsUpdateProjectModalOpen(false);
          setSelectedProjectToManage(null);
        }}
        onUpdate={handleUpdateProject}
        project={selectedProjectToManage}
      />
    </>
  );
};
