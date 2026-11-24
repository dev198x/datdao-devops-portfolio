import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  TrendingUp, 
  Users, 
  Clock, 
  Eye, 
  Heart, 
  MessageCircle, 
  Zap, 
  Target, 
  Award,
  ChevronRight,
  Filter,
  Grid3X3,
  List,
  Star
} from 'lucide-react';

// Color schemes for different categories
const categoryColors = {
  DevOps: 'bg-blue-50 text-blue-700 border-blue-200',
  'Cloud Infrastructure': 'bg-violet-50 text-violet-700 border-violet-200',
  'Full-Stack': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'DevOps Tools': 'bg-amber-50 text-amber-700 border-amber-200',
  Security: 'bg-rose-50 text-rose-700 border-rose-200',
  Database: 'bg-slate-100 text-slate-700 border-slate-200',
  'AI-Agent': 'bg-cyan-50 text-cyan-700 border-cyan-200',
};

const statusColors = {
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-500',
  inProgress: 'bg-blue-50 text-blue-700 border-blue-500',
  planning: 'bg-slate-100 text-slate-600 border-slate-400',
};

const difficultyColors = {
  Beginner: 'bg-emerald-50 text-emerald-700',
  Intermediate: 'bg-amber-50 text-amber-700',
  Advanced: 'bg-rose-50 text-rose-700',
};

// Animated Background Component
export const AnimatedBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="relative min-h-screen bg-white text-neutral-200">{children}</div>;
};

// Tech Badge Component
interface TechBadgeProps {
  name: string;
  category?: keyof typeof categoryColors;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export const TechBadge: React.FC<TechBadgeProps> = ({ 
  name, 
  category = 'DevOps', 
  size = 'md', 
  animated = true 
}) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const Component = animated ? motion.span : 'span';
  const props = animated ? {
    className: `${sizeClasses[size]} rounded-md font-medium border ${categoryColors[category]} inline-flex items-center gap-1.5`
  } : {
    className: `${sizeClasses[size]} rounded-md font-medium border ${categoryColors[category]} inline-flex items-center gap-1.5`
  };

  return (
    <Component {...props}>
      {name}
    </Component>
  );
};

// Loading Skeleton Component
interface LoadingSkeletonProps {
  lines?: number;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ lines = 3, className = '' }) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: i * 0.1 }}
        className="h-4 bg-neutral-100 rounded animate-pulse"
      />
    ))}
  </div>
);

// Stats Card Component
interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon?: React.ReactNode;
  color?: keyof typeof statusColors;
  trend?: 'up' | 'down' | 'neutral';
  loading?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon,
  color = 'completed',
  trend = 'neutral',
  loading = false
}) => {
  if (loading) {
    return (
      <div className="bg-white border border-neutral-700 rounded-lg p-6">
        <LoadingSkeleton lines={3} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-neutral-700 rounded-lg p-6 transition-colors hover:border-neutral-600"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-neutral-400 text-sm font-medium">{title}</h3>
        {icon && <div className="text-green-400">{icon}</div>}
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-neutral-200">{value}</p>
          {change && (
            <p className={`text-sm flex items-center gap-1 mt-1 ${
              trend === 'up' ? 'text-emerald-600' : 
              trend === 'down' ? 'text-rose-600' : 'text-neutral-500'
            }`}>
              <TrendingUp className="w-3 h-3" />
              {change}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Progress Bar Component
interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  color?: string;
  animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  color = 'bg-primary-500',
  animated = true
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between text-sm">
          <span className="text-neutral-300">{label}</span>
          <span className="text-green-400 font-medium">{value}/{max}</span>
        </div>
      )}
      
      <div className="w-full bg-neutral-100 rounded-full h-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: animated ? 1 : 0, ease: "easeOut" }}
          className={`h-2 rounded-full ${color}`}
        />
      </div>
    </div>
  );
};

// Timeline Component
interface TimelineItemProps {
  date: string;
  title: string;
  description: string;
  status: keyof typeof statusColors;
  icon?: React.ReactNode;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({
  date,
  title,
  description,
  status,
  icon
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative flex gap-4 pb-8"
    >
      {/* Timeline line */}
      <div className="flex flex-col items-center">
        <div className={`w-4 h-4 rounded-full border-2 bg-white ${statusColors[status]} relative z-10`} />
        <div className="w-px h-full bg-neutral-700 absolute top-4 left-1/2 transform -translate-x-px" />
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-neutral-200 font-medium">{title}</h4>
          {icon && <div className="text-green-400">{icon}</div>}
        </div>
        <p className="text-gray-400 text-sm mb-1">{description}</p>
        <p className="text-green-400 text-xs">{date}</p>
      </div>
    </motion.div>
  );
};

// Interactive Button Component
interface InteractiveButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const InteractiveButton: React.FC<InteractiveButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left'
}) => {
  const baseClasses = 'inline-flex items-center gap-2 font-medium rounded-lg transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary-500 text-white hover:bg-primary-700',
    secondary: 'bg-white text-neutral-200 border border-neutral-700 hover:bg-neutral-50',
    outline: 'border border-primary-500 text-primary-500 hover:bg-primary-50'
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]}`}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          {children}
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </motion.button>
  );
};

// Category Filter Component
interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      <motion.button
        onClick={() => onCategoryChange('All')}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
          selectedCategory === 'All'
            ? 'bg-primary-500 text-white'
            : 'bg-white text-neutral-300 border border-neutral-700 hover:bg-neutral-50'
        }`}
      >
        All
      </motion.button>
      
      {categories.map((category) => (
        <motion.button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            selectedCategory === category
              ? 'bg-primary-500 text-white'
              : 'bg-white text-neutral-300 border border-neutral-700 hover:bg-neutral-50'
          }`}
        >
          {category}
        </motion.button>
      ))}
    </div>
  );
};

// View Toggle Component
interface ViewToggleProps {
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ view, onViewChange }) => {
  return (
    <div className="flex bg-neutral-100 rounded-lg p-1">
      <motion.button
        onClick={() => onViewChange('grid')}
        className={`p-2 rounded-md transition-all duration-300 ${
          view === 'grid'
            ? 'bg-primary-500 text-white'
            : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        <Grid3X3 className="w-4 h-4" />
      </motion.button>
      <motion.button
        onClick={() => onViewChange('list')}
        className={`p-2 rounded-md transition-all duration-300 ${
          view === 'list'
            ? 'bg-primary-500 text-white'
            : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        <List className="w-4 h-4" />
      </motion.button>
    </div>
  );
};

// Engagement Metrics Component
interface EngagementMetricsProps {
  views?: string;
  likes?: string;
  comments?: string;
  featured?: boolean;
}

export const EngagementMetrics: React.FC<EngagementMetricsProps> = ({
  views,
  likes,
  comments,
  featured = false
}) => {
  return (
    <div className="flex items-center gap-4 text-xs text-neutral-400">
      {views && (
        <div className="flex items-center gap-1">
          <Eye className="w-3 h-3" />
          <span>{views}</span>
        </div>
      )}
      {likes && (
        <div className="flex items-center gap-1">
          <Heart className="w-3 h-3" />
          <span>{likes}</span>
        </div>
      )}
      {comments && (
        <div className="flex items-center gap-1">
          <MessageCircle className="w-3 h-3" />
          <span>{comments}</span>
        </div>
      )}
      {featured && (
        <div className="flex items-center gap-1 text-amber-600">
          <Star className="w-3 h-3 fill-current" />
          <span>Featured</span>
        </div>
      )}
    </div>
  );
};

// Export all components and utilities
export {
  categoryColors,
  statusColors,
  difficultyColors
};