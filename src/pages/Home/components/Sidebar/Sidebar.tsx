import { SidebarContainer } from './Sidebar.styles';
import { type SidebarProps } from './types/Sidebar.types';
import { useSidebar } from './hooks/useSidebar';
import {
  SidebarHeader,
  SidebarNavigation,
  ProjectGroupsSection,
  UserProfile,
  SidebarMenus,
} from './components';

const Sidebar = ({ activeTab, changeStatusTab }: SidebarProps) => {
  const sidebar = useSidebar({ activeTab, changeStatusTab });

  return (
    <SidebarContainer>
      <SidebarHeader sidebar={sidebar} />
      <SidebarNavigation sidebar={sidebar} />
      <ProjectGroupsSection sidebar={sidebar} />
      <UserProfile sidebar={sidebar} />
      <SidebarMenus sidebar={sidebar} />
    </SidebarContainer>
  );
};

export default Sidebar;
