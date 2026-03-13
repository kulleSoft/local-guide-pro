import { cn } from '@/lib/utils';
import { useCategories } from '@/hooks/usePlaces';
import { Skeleton } from '@/components/ui/skeleton';

interface CategoryChipsProps {
  selected: string | null;
  onSelect: (id: string | null) => void;
}

export function CategoryChips({ selected, onSelect }: CategoryChipsProps) {
  const { data: categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 py-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-20 rounded-full flex-shrink-0" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 py-3">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors border',
          !selected ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-foreground border-border'
        )}
      >
        Todos
      </button>
      {categories?.map(cat => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={cn(
            'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors border whitespace-nowrap',
            selected === cat.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-foreground border-border'
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
