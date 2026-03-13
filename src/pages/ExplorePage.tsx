import { useCategories, usePlaces } from '@/hooks/usePlaces';
import { PlaceCard } from '@/components/places/PlaceCard';
import { PlaceCardSkeleton } from '@/components/places/PlaceCardSkeleton';
import { Skeleton } from '@/components/ui/skeleton';

export default function ExplorePage() {
  const { data: categories, isLoading: loadingCats } = useCategories();
  const { data: places, isLoading: loadingPlaces } = usePlaces();

  if (loadingCats || loadingPlaces) {
    return (
      <div className="py-4 px-4 space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-6 w-32" />
            <div className="flex gap-4 overflow-hidden">
              <PlaceCardSkeleton />
              <PlaceCardSkeleton />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="py-4 space-y-6">
      <div className="px-4">
        <h1 className="text-xl font-bold">Explorar</h1>
        <p className="text-sm text-muted-foreground">Descubra locais por categoria</p>
      </div>
      {categories?.map(cat => {
        const catPlaces = places?.filter(p => p.category_id === cat.id) || [];
        if (!catPlaces.length) return null;
        return (
          <section key={cat.id}>
            <h2 className="font-bold text-lg px-4 mb-3">{cat.name}</h2>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide px-4">
              {catPlaces.map(p => (
                <div key={p.id} className="min-w-[280px] max-w-[280px]">
                  <PlaceCard place={p as any} />
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
