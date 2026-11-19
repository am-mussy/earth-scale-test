import React from 'react';
import {
  Compass,
  Cpu,
  GraduationCap,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
} from 'lucide-react';
import { CategoryId } from '../types';

interface CategoryIconProps {
  categoryId: CategoryId;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  categoryId,
  className = 'h-5 w-5',
}) => {
  switch (categoryId) {
    case 'education':
      return <GraduationCap className={className} />;
    case 'finance':
      return <Wallet className={className} />;
    case 'health':
      return <HeartPulse className={className} />;
    case 'digital':
      return <Cpu className={className} />;
    case 'safety':
      return <ShieldCheck className={className} />;
    case 'freedom':
      return <Compass className={className} />;
    case 'community':
      return <Users className={className} />;
    case 'growth':
      return <Sparkles className={className} />;
  }
};
