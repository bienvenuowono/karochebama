/**
 * Déclarations de types pour les modules sans fichiers .d.ts dans cette version.
 * Permet à TypeScript de compiler sans erreur TS7016.
 */

// lucide-react@0.368.0 n'embarque pas de types — on les déclare manuellement.
declare module 'lucide-react' {
  import { ComponentType, SVGProps } from 'react';

  export type LucideProps = SVGProps<SVGSVGElement> & {
    size?: number | string;
    absoluteStrokeWidth?: boolean;
    strokeWidth?: number | string;
    color?: string;
  };

  export type LucideIcon = ComponentType<LucideProps>;

  // Icônes utilisées dans le projet — étendre si besoin
  export const Zap: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const ArrowLeft: LucideIcon;
  export const ArrowUpRight: LucideIcon;
  export const ArrowDownRight: LucideIcon;
  export const Eye: LucideIcon;
  export const EyeOff: LucideIcon;
  export const Mail: LucideIcon;
  export const Lock: LucideIcon;
  export const User: LucideIcon;
  export const Users: LucideIcon;
  export const Building2: LucideIcon;
  export const Home: LucideIcon;
  export const Compass: LucideIcon;
  export const ShieldOff: LucideIcon;
  export const TrendingUp: LucideIcon;
  export const ShoppingBag: LucideIcon;
  export const CreditCard: LucideIcon;
  export const Package: LucideIcon;
  export const Clock: LucideIcon;
  export const CheckCircle2: LucideIcon;
  export const AlertCircle: LucideIcon;
  export const LayoutDashboard: LucideIcon;
  export const Settings: LucideIcon;
  export const LogOut: LucideIcon;
  export const ChevronLeft: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const Bell: LucideIcon;
  export const Search: LucideIcon;
  export const Menu: LucideIcon;
  export const X: LucideIcon;
  export const Sun: LucideIcon;
  export const Moon: LucideIcon;
  export const Monitor: LucideIcon;
  export const BarChart3: LucideIcon;
  export const Receipt: LucideIcon;
  export const ShoppingCart: LucideIcon;
  export const FileText: LucideIcon;
  export const Tag: LucideIcon;
  export const Wallet: LucideIcon;
  export const UserCircle: LucideIcon;
  export const Shield: LucideIcon;
  export const Activity: LucideIcon;
  export const Plus: LucideIcon;
  export const Pencil: LucideIcon;
  export const Trash2: LucideIcon;
  export const MoreHorizontal: LucideIcon;
  export const MoreVertical: LucideIcon;
  export const Upload: LucideIcon;
  export const Download: LucideIcon;
  export const ExternalLink: LucideIcon;
  export const Copy: LucideIcon;
  export const Check: LucideIcon;
  export const Info: LucideIcon;
  export const AlertTriangle: LucideIcon;
  export const RefreshCw: LucideIcon;
  export const Filter: LucideIcon;
  export const SortAsc: LucideIcon;
  export const SortDesc: LucideIcon;
}
