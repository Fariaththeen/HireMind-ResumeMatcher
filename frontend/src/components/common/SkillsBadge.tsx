import { X } from 'lucide-react';

interface SkillsBadgeProps {
  skill: string;
  variant?: 'default' | 'matched' | 'missing' | 'required';
  onRemove?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export function SkillsBadge({ 
  skill, 
  variant = 'default', 
  onRemove,
  size = 'md' 
}: SkillsBadgeProps) {
  const variantClasses = {
    default: 'bg-primary-100 text-primary-800 border-primary-200',
    matched: 'bg-green-100 text-green-800 border-green-200',
    missing: 'bg-red-100 text-red-800 border-red-200',
    required: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full border font-medium
        ${variantClasses[variant]} ${sizeClasses[size]}
        transition-all duration-200 hover:shadow-sm
      `}
    >
      {skill}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 rounded-full p-0.5 hover:bg-gray-200 transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}
