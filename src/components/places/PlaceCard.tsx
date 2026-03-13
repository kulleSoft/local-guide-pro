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
        <div className="relative rounded-2xl overflow-hidden bg-card shadow-sm border">
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
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-card/80 backdrop-blur flex items-center justify-center"
            >
              <Heart className={cn('h-4 w-4', fav ? 'fill-primary text-primary' : 'text-foreground')} />
            </button>
            {place.categories && (
              <span className="absolute bottom-3 left-3 text-xs font-semibold bg-primary text-primary-foreground px-2.5 py-1 rounded-full">
                {place.categories.name}
              </span>
            )}
          </div>
          <div className="p-3.5">
            <h3 className="font-bold text-base truncate">{place.name}</h3>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              {place.neighborhood && (
                <span className="truncate">{place.neighborhood}{place.city ? `, ${place.city}` : ''}</span>
              )}
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                <span className="text-sm font-semibold">{Number(place.rating || 0).toFixed(1)}</span>
              </div>
              {place.price_range && (
                <span className="text-sm font-medium text-muted-foreground">
                  {PRICE_LABELS[place.price_range]}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
