import { useParams, useNavigate } from 'react-router-dom';
import { usePlace } from '@/hooks/usePlaces';
import { useFavorites } from '@/hooks/useFavorites';
import { ArrowLeft, Heart, MapPin, Phone, Clock, Star, Share2, ExternalLink, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PRICE_LABELS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function PlaceDetails() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: place, isLoading } = usePlace(slug || '');
  const { isFavorite, toggleFavorite } = useFavorites();

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!place) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <p className="text-muted-foreground mb-4">Local não encontrado</p>
        <Button onClick={() => navigate('/')}>Voltar</Button>
      </div>
    );
  }

  const fav = isFavorite(place.id);
  const gallery = (place.gallery as string[] | null) || [];

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: place.name, url });
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Link copiado!');
    }
  };

  const openMap = () => {
    if (place.google_maps_url) {
      window.open(place.google_maps_url, '_blank');
    } else if (place.latitude && place.longitude) {
      window.open(`https://www.google.com/maps?q=${place.latitude},${place.longitude}`, '_blank');
    }
  };

  return (
    <div className="pb-4">
      {/* Cover */}
      <div className="relative aspect-[4/3] bg-muted">
        {place.cover_image ? (
          <img src={place.cover_image} alt={place.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-card/80 backdrop-blur flex items-center justify-center">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex gap-2">
            <button onClick={handleShare} className="w-10 h-10 rounded-full bg-card/80 backdrop-blur flex items-center justify-center">
              <Share2 className="h-5 w-5" />
            </button>
            <button onClick={() => toggleFavorite(place.id)} className="w-10 h-10 rounded-full bg-card/80 backdrop-blur flex items-center justify-center">
              <Heart className={cn('h-5 w-5', fav ? 'fill-primary text-primary' : '')} />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-6 relative">
        <div className="bg-card rounded-2xl p-4 shadow-lg border space-y-4">
          {/* Name & Category */}
          <div>
            {(place as any).categories?.name && (
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                {(place as any).categories.name}
              </span>
            )}
            <h1 className="text-2xl font-bold mt-1">{place.name}</h1>
          </div>

          {/* Rating & Price */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="font-semibold">{Number(place.rating || 0).toFixed(1)}</span>
            </div>
            {place.price_range && (
              <span className="text-muted-foreground font-medium">{PRICE_LABELS[place.price_range]}</span>
            )}
          </div>

          {/* Description */}
          {place.description && (
            <p className="text-muted-foreground text-sm leading-relaxed">{place.description}</p>
          )}

          {/* Info rows */}
          <div className="space-y-3">
            {place.address && (
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                <span className="text-sm">{place.address}{place.neighborhood ? `, ${place.neighborhood}` : ''}{place.city ? ` - ${place.city}` : ''}</span>
              </div>
            )}
            {place.opening_hours && (
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                <span className="text-sm">{place.opening_hours}</span>
              </div>
            )}
            {place.phone && (
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                <a href={`tel:${place.phone}`} className="text-sm text-primary">{place.phone}</a>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {(place.google_maps_url || (place.latitude && place.longitude)) && (
              <Button onClick={openMap} className="h-12 rounded-xl gap-2">
                <MapPin className="h-4 w-4" /> Abrir no mapa
              </Button>
            )}
            {place.whatsapp && (
              <Button
                variant="outline"
                onClick={() => window.open(`https://wa.me/${place.whatsapp.replace(/\D/g, '')}`, '_blank')}
                className="h-12 rounded-xl gap-2"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </Button>
            )}
            {place.instagram && (
              <Button
                variant="outline"
                onClick={() => window.open(place.instagram!.startsWith('http') ? place.instagram! : `https://instagram.com/${place.instagram}`, '_blank')}
                className="h-12 rounded-xl gap-2"
              >
                <ExternalLink className="h-4 w-4" /> Instagram
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="mt-6 px-4">
          <h2 className="font-bold text-lg mb-3">Fotos</h2>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {gallery.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`${place.name} foto ${i + 1}`}
                className="h-32 w-44 rounded-xl object-cover flex-shrink-0"
                loading="lazy"
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
