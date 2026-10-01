import type { SxProps, Theme } from '@mui/material';
import type { SvgIconComponent } from '@mui/icons-material';
import {
  Add,
  AddTaskOutlined,
  AdminPanelSettingsOutlined,
  AppsOutlined,
  ArrowForward,
  ArrowUpward,
  AttachFile,
  AutoAwesomeOutlined,
  Block,
  BookmarkAddedOutlined,
  CalendarMonthOutlined,
  Check,
  CheckCircle,
  CheckCircleOutline,
  Checklist,
  ChevronRight,
  Close,
  Code,
  Contrast,
  DarkModeOutlined,
  DashboardCustomizeOutlined,
  DateRangeOutlined,
  DeleteOutline,
  DescriptionOutlined,
  EventAvailableOutlined,
  EventBusyOutlined,
  EventOutlined,
  ExpandMore,
  FolderOpenOutlined,
  HelpOutline,
  InsightsOutlined,
  LightModeOutlined,
  LockOutlined,
  Login,
  ManageAccountsOutlined,
  MarkEmailReadOutlined,
  Menu,
  NewReleasesOutlined,
  PlayCircleOutline,
  RadioButtonUnchecked,
  RocketLaunchOutlined,
  SchoolOutlined,
  Search,
  SellOutlined,
  Sync,
  TimerOutlined,
  Translate,
  VideocamOutlined,
  ViewTimelineOutlined,
  WorkOutline,
} from '@mui/icons-material';

// Icons of the public site, by the names the site design uses.
export const ICONS = {
  add: Add,
  add_task: AddTaskOutlined,
  apps: AppsOutlined,
  arrow_forward: ArrowForward,
  arrow_upward: ArrowUpward,
  attach_file: AttachFile,
  auto_awesome: AutoAwesomeOutlined,
  block: Block,
  bookmark_heart: BookmarkAddedOutlined,
  calendar_month: CalendarMonthOutlined,
  check: Check,
  check_circle: CheckCircleOutline,
  check_circle_filled: CheckCircle,
  checklist: Checklist,
  chevron_right: ChevronRight,
  close: Close,
  code: Code,
  contrast: Contrast,
  dark_mode: DarkModeOutlined,
  dashboard_customize: DashboardCustomizeOutlined,
  date_range: DateRangeOutlined,
  delete: DeleteOutline,
  description: DescriptionOutlined,
  event: EventOutlined,
  event_available: EventAvailableOutlined,
  event_busy: EventBusyOutlined,
  expand_more: ExpandMore,
  folder_open: FolderOpenOutlined,
  help: HelpOutline,
  insights: InsightsOutlined,
  light_mode: LightModeOutlined,
  lock: LockOutlined,
  login: Login,
  manage_accounts: ManageAccountsOutlined,
  mark_email_read: MarkEmailReadOutlined,
  menu: Menu,
  new_releases: NewReleasesOutlined,
  play_circle: PlayCircleOutline,
  radio_button_unchecked: RadioButtonUnchecked,
  rocket_launch: RocketLaunchOutlined,
  school: SchoolOutlined,
  search: Search,
  sell: SellOutlined,
  shield_person: AdminPanelSettingsOutlined,
  sync: Sync,
  timer: TimerOutlined,
  translate: Translate,
  videocam: VideocamOutlined,
  view_timeline: ViewTimelineOutlined,
  work: WorkOutline,
} satisfies Record<string, SvgIconComponent>;

export type IconName = keyof typeof ICONS;

interface SiteIconProps {
  name: IconName;
  size?: number;
  sx?: SxProps<Theme>;
}

export const SiteIcon = ({ name, size = 20, sx }: SiteIconProps) => {
  const Icon = ICONS[name];
  return (
    <Icon
      aria-hidden
      sx={[
        { fontSize: size, display: 'block' },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    />
  );
};
