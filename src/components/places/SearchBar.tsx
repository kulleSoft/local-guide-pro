import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Buscar local ou restaurante...' }: SearchBarProps) {
  return (
    <div className="relative px-4">
      <Search className="absolute left-7 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-12 h-12 rounded-2xl bg-card border shadow-sm text-sm"
      />
      <SlidersHorizontal className="absolute right-7 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    </div>
  );
}
