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
    <div className="space-y-4 py-4">
      {/* Hero text */}
      <div className="px-4">
        <h1 className="text-2xl font-extrabold leading-tight">
          Descubra Novos<br />
          <span className="text-primary">Lugares</span>
        </h1>
      </div>

      <SearchBar value={search} onChange={setSearch} />

      <BannerCarousel />

      <CategoryChips selected={categoryId} onSelect={setCategoryId} />

      {/* Featured */}
      {!search && !categoryId && (featured?.length ?? 0) > 0 && (
        <section className="px-4">
          <h2 className="font-bold text-lg mb-3">🔥 Destaques</h2>
          <div className="grid grid-cols-2 gap-3">
            {featured?.slice(0, 4).map(place => (
              <PlaceCard key={place.id} place={place as any} />
            ))}
          </div>
        </section>
      )}

      {/* All places */}
      <section className="px-4">
        <h2 className="font-bold text-lg mb-3">
          {categoryId ? 'Resultados' : search ? 'Busca' : 'Populares'}
        </h2>
        {loadingPlaces ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => <PlaceCardSkeleton key={i} />)}
          </div>
        ) : places?.length ? (
          <div className="grid grid-cols-2 gap-3">
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
