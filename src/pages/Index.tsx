import { useState } from 'react';
import { usePlaces } from '@/hooks/usePlaces';
import { BannerCarousel } from '@/components/places/BannerCarousel';
import { CategoryChips } from '@/components/places/CategoryChips';
import { PlaceCard } from '@/components/places/PlaceCard';
import { SearchBar } from '@/components/places/SearchBar';
import { EmptyState } from '@/components/places/EmptyState';
import { PlaceCardSkeleton } from '@/components/places/PlaceCardSkeleton';

const Index = () => {
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);

  const { data: featured, isLoading: loadingFeatured } = usePlaces({ featured: true });
  const { data: places, isLoading: loadingPlaces } = usePlaces({
    categoryId: categoryId || undefined,
    search: search || undefined,
  });

  return (
    <div className="space-y-5 py-4">
      <BannerCarousel />

      <SearchBar value={search} onChange={setSearch} />

      <CategoryChips selected={categoryId} onSelect={setCategoryId} />

      {/* Featured */}
      {!search && !categoryId && (featured?.length ?? 0) > 0 && (
        <section className="px-4">
          <h2 className="font-bold text-lg mb-3">🔥 Destaques</h2>
          <div className="grid gap-4">
            {featured?.slice(0, 3).map(place => (
              <PlaceCard key={place.id} place={place as any} />
            ))}
          </div>
        </section>
      )}

      {/* All places */}
      <section className="px-4">
        <h2 className="font-bold text-lg mb-3">
          {categoryId ? 'Resultados' : search ? 'Busca' : 'Todos os locais'}
        </h2>
        {loadingPlaces ? (
          <div className="grid gap-4">
            {Array.from({ length: 4 }).map((_, i) => <PlaceCardSkeleton key={i} />)}
          </div>
        ) : places?.length ? (
          <div className="grid gap-4">
            {places.map(place => (
              <PlaceCard key={place.id} place={place as any} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </section>
    </div>
  );
};

export default Index;
