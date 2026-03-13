import { cn } from '@/lib/utils';
import { useCategories } from '@/hooks/usePlaces';
import { Skeleton } from '@/components/ui/skeleton';
import { UtensilsCrossed, Wine, Coffee, Hotel, Waves, Camera, MapPin, ShoppingBag, TreePine } from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  UtensilsCrossed, Wine, Coffee, Hotel, Waves, Camera, ShoppingBag, TreePine, MapPin,
};

interface CategoryChipsProps {
  selected: string | null;
  onSelect: (id: string | null) => void;
}

export function CategoryChips({ selected, onSelect }: CategoryChipsProps) {
  const { data: categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <div className="flex gap-5 overflow-x-auto scrollbar-hide px-4 py-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <Skeleton className="h-14 w-14 rounded-full" />
            <Skeleton className="h-3 w-10" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-5 overflow-x-auto scrollbar-hide px-4 py-2">
      <button
        onClick={() => onSelect(null)}
        className="flex flex-col items-center gap-1.5 min-w-[56px]"
      >
        <div className={cn(
          'w-14 h-14 rounded-full flex items-center justify-center transition-all border',
          !selected
            ? 'bg-primary border-primary text-primary-foreground shadow-md shadow-primary/30'
            : 'bg-[hsl(var(--primary-light))] border-transparent text-primary'
        )}>
          <MapPin className="h-5 w-5" />
        </div>
        <span className={cn('text-[11px] font-semibold', !selected ? 'text-primary' : 'text-muted-foreground')}>
          Todos
        </span>
      </button>
      {categories?.map(cat => {
        const IconComp = ICON_MAP[cat.icon || ''] || MapPin;
        const isActive = selected === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className="flex flex-col items-center gap-1.5 min-w-[56px]"
          >
            <div className={cn(
              'w-14 h-14 rounded-full flex items-center justify-center transition-all border',
              isActive
                ? 'bg-primary border-primary text-primary-foreground shadow-md shadow-primary/30'
                : 'bg-[hsl(var(--primary-light))] border-transparent text-primary'
            )}>
              <IconComp className="h-5 w-5" />
            </div>
            <span className={cn('text-[11px] font-semibold whitespace-nowrap', isActive ? 'text-primary' : 'text-muted-foreground')}>
              {cat.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
