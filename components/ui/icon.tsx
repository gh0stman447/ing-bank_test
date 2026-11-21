import {
  LayoutGrid,
  ClipboardList,
  UsersRound,
  Search,
  Plus,
  ChevronDown,
  Columns3,
  X,
  Pencil,
  Trash2,
  CalendarDays,
  Check,
  ChevronLeft,
  LogOut,
  type LucideIcon,
} from 'lucide-react';

const icons = {
  grid: LayoutGrid,
  deals: ClipboardList,
  clients: UsersRound,
  search: Search,
  plus: Plus,
  chevron: ChevronDown,
  columns: Columns3,
  close: X,
  edit: Pencil,
  trash: Trash2,
  calendar: CalendarDays,
  check: Check,
  arrow: ChevronLeft,
  logout: LogOut,
} satisfies Record<string, LucideIcon>;

export function Icon({
  name,
  size = 20,
  className,
}: {
  name: keyof typeof icons;
  size?: number;
  className?: string;
}) {
  const Component = icons[name];

  return <Component size={size} className={className} strokeWidth={1.7} aria-hidden='true' />;
}
