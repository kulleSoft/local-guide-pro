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
    <div className="space-y-5 pb-4">
      {/* Hero section with red bg */}
      <div className="bg-primary -mt-1 pt-4 pb-6 px-5 rounded-b-[28px]">
        <h1 className="text-2xl font-extrabold text-primary-foreground leading-tight">
          Descubra Novos<br />Lugares
        </h1>
        <div className="mt-4">
          <SearchBar value={search} onChange={setSearch} variant="hero" />
        </div>
      </div>

      <BannerCarousel />

      <CategoryChips selected={categoryId} onSelect={setCategoryId} />

      {/* Featured */}
      {!search && !categoryId && (featured?.length ?? 0) > 0 && (
        <section className="px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-base">🔥 Destaques</h2>
            <span className="text-xs text-primary font-semibold">Ver todos</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {featured?.slice(0, 4).map(place => (
              <PlaceCard key={place.id} place={place as any} />
            ))}
          </div>
        </section>
      )}

      {/* All places */}
      <section className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-base">
            {categoryId ? 'Resultados' : search ? 'Busca' : 'Populares'}
          </h2>
          <span className="text-xs text-primary font-semibold">Ver todos</span>
        </div>
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
