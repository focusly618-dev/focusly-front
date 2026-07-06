import { Box } from '@mui/material';
import { SidebarContainer } from './Sidebar.styles';
import { type SidebarProps } from './types/Sidebar.types';
import { useSidebar } from './hooks/useSidebar';
import {
  SidebarHeader,
  SidebarNavigation,
  UserProfile,
  SidebarMenus,
} from './components';

const Sidebar = ({ activeTab, changeStatusTab }: SidebarProps) => {
  const sidebar = useSidebar({ activeTab, changeStatusTab });

  return (
    <SidebarContainer>
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <SidebarHeader sidebar={sidebar} />
      </Box>
      <SidebarNavigation sidebar={sidebar} />
      <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'block' } }} />
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <UserProfile sidebar={sidebar} />
      </Box>
      <SidebarMenus sidebar={sidebar} />
    </SidebarContainer>
  );
};

export default Sidebar;
