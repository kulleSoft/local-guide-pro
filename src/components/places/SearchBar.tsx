import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  variant?: 'default' | 'hero';
}

export function SearchBar({ value, onChange, placeholder = 'Buscar local ou restaurante...', variant = 'default' }: SearchBarProps) {
  return (
    <div className={cn('relative', variant === 'default' && 'px-4')}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" style={variant === 'default' ? { left: '1.75rem' } : {}} />
      <Input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'pr-12 h-12 rounded-2xl bg-card border-0 shadow-sm text-sm',
          variant === 'hero' ? 'pl-10' : 'pl-10 ml-0'
        )}
        style={variant === 'default' ? { paddingLeft: '2.5rem' } : {}}
      />
      <SlidersHorizontal className={cn(
        'absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground',
        variant === 'default' ? 'right-7' : 'right-3'
      )} />
    </div>
  );
}
