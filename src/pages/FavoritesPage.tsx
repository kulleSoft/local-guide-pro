import { useFavorites } from '@/hooks/useFavorites';
import { usePlaces } from '@/hooks/usePlaces';
import { PlaceCard } from '@/components/places/PlaceCard';
import { EmptyState } from '@/components/places/EmptyState';

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const { data: allPlaces } = usePlaces();

  const favPlaces = allPlaces?.filter(p => favorites.includes(p.id)) || [];

  return (
    <div className="py-4 px-4 space-y-4">
      <h1 className="text-xl font-bold">Favoritos</h1>
      {favPlaces.length ? (
        <div className="grid gap-4">
          {favPlaces.map(p => <PlaceCard key={p.id} place={p as any} />)}
        </div>
      ) : (
        <EmptyState message="Você ainda não salvou nenhum local" />
      )}
    </div>
  );
}
