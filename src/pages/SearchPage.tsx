import { useState } from 'react';
import { usePlaces, useCities } from '@/hooks/usePlaces';
import { SearchBar } from '@/components/places/SearchBar';
import { CategoryChips } from '@/components/places/CategoryChips';
import { PlaceCard } from '@/components/places/PlaceCard';
import { EmptyState } from '@/components/places/EmptyState';
import { PlaceCardSkeleton } from '@/components/places/PlaceCardSkeleton';

export default function SearchPage() {
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);

  const { data: cities } = useCities();
  const { data: places, isLoading } = usePlaces({
    search: search || undefined,
    categoryId: categoryId || undefined,
    city: city || undefined,
  });

  return (
    <div className="space-y-4 py-4">
      <SearchBar value={search} onChange={setSearch} />
      <CategoryChips selected={categoryId} onSelect={setCategoryId} />

      {/* City filter */}
      {cities && cities.length > 0 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4">
          <button
            onClick={() => setCity(null)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium border ${!city ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border'}`}
          >
            Todas cidades
          </button>
          {cities.map(c => (
            <button
              key={c}
              onClick={() => setCity(c)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium border whitespace-nowrap ${city === c ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border'}`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <section className="px-4">
        {isLoading ? (
          <div className="grid gap-4">
            {Array.from({ length: 3 }).map((_, i) => <PlaceCardSkeleton key={i} />)}
          </div>
        ) : places?.length ? (
          <div className="grid gap-4">
            {places.map(p => <PlaceCard key={p.id} place={p as any} />)}
          </div>
        ) : (
          <EmptyState message="Nenhum resultado para sua busca" />
        )}
      </section>
    </div>
  );
}
