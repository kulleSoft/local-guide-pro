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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <Link to={`/local/${place.slug}`} className="block">
        <div className="relative rounded-2xl overflow-hidden bg-card shadow-md">
          {/* Image */}
          <div className="aspect-[4/3] bg-muted relative overflow-hidden">
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
            {/* Favorite button */}
            <button
              onClick={(e) => { e.preventDefault(); toggleFavorite(place.id); }}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-card/90 backdrop-blur flex items-center justify-center shadow-sm"
            >
              <Heart className={cn('h-3.5 w-3.5', fav ? 'fill-primary text-primary' : 'text-muted-foreground')} />
            </button>
          </div>

          {/* Content */}
          <div className="p-3">
            <h3 className="font-bold text-[13px] leading-tight line-clamp-1">{place.name}</h3>
            {place.neighborhood && (
              <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                {place.neighborhood}{place.city ? `, ${place.city}` : ''}
              </p>
            )}
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-accent text-accent" />
                <span className="text-[11px] font-bold">{Number(place.rating || 0).toFixed(1)}</span>
                {place.categories && (
                  <span className="text-[10px] text-muted-foreground ml-1">({place.categories.name})</span>
                )}
              </div>
              {place.price_range && (
                <span className="text-[10px] font-semibold bg-accent text-accent-foreground px-1.5 py-0.5 rounded">
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
