import { Heart, MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { PRICE_LABELS } from '@/lib/constants';
import { useFavorites } from '@/hooks/useFavorites';

interface PlaceCardProps {
  place: {
    id: string;
    name: string;
    slug: string;
    cover_image: string | null;
    rating: number | null;
    price_range: number | null;
    neighborhood: string | null;
    city: string | null;
    categories: { name: string } | null;
  };
}

export function PlaceCard({ place }: PlaceCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(place.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <Link to={`/local/${place.slug}`} className="block">
        <div className="relative rounded-2xl overflow-hidden bg-card shadow-md">
          <div className="aspect-[16/10] bg-muted relative overflow-hidden">
            {place.cover_image ? (
              <img
                src={place.cover_image}
                alt={place.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <MapPin className="h-8 w-8" />
              </div>
            )}
            <button
              onClick={(e) => { e.preventDefault(); toggleFavorite(place.id); }}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-card/90 backdrop-blur flex items-center justify-center shadow-sm"
            >
              <Heart className={cn('h-4 w-4', fav ? 'fill-primary text-primary' : 'text-muted-foreground')} />
            </button>
          </div>
          <div className="p-3.5">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-sm truncate flex-1">{place.name}</h3>
              {place.price_range && (
                <span className="text-xs font-semibold text-primary">
                  {PRICE_LABELS[place.price_range]}
                </span>
              )}
            </div>
            {place.neighborhood && (
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{place.neighborhood}{place.city ? `, ${place.city}` : ''}</span>
              </div>
            )}
            <div className="flex items-center gap-3 mt-2">
              {place.categories && (
                <span className="text-[10px] font-semibold bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
                  {place.categories.name}
                </span>
              )}
              <div className="flex items-center gap-1 ml-auto">
                <Star className="h-3 w-3 fill-accent text-accent" />
                <span className="text-xs font-bold">{Number(place.rating || 0).toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
