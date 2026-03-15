import { useParams, useNavigate } from 'react-router-dom';
import { usePlace } from '@/hooks/usePlaces';
import { useFavorites } from '@/hooks/useFavorites';
import { ArrowLeft, Heart, MapPin, Phone, Clock, Star, Share2, ExternalLink, MessageCircle, Image, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PRICE_LABELS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useState } from 'react';

export default function PlaceDetails() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: place, isLoading } = usePlace(slug || '');
  const { isFavorite, toggleFavorite } = useFavorites();
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-72 w-full rounded-2xl" />
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
    <div className="pb-4 -mt-14">
      {/* Cover image */}
      <div className="relative aspect-[4/3] bg-muted">
        {place.cover_image ? (
          <img src={place.cover_image} alt={place.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        {/* Dots indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <div className="w-2 h-2 rounded-full bg-card/50" />
          <div className="w-2 h-2 rounded-full bg-card/50" />
        </div>
        {/* Top actions */}
        <div className="absolute top-14 left-0 right-0 px-4 flex justify-between">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-card/80 backdrop-blur flex items-center justify-center shadow">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button onClick={handleShare} className="w-10 h-10 rounded-full bg-card/80 backdrop-blur flex items-center justify-center shadow">
            <Share2 className="h-5 w-5" />
          </button>
        </div>
        {/* Fav button */}
        <button
          onClick={() => toggleFavorite(place.id)}
          className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-card shadow-lg flex items-center justify-center"
        >
          <Heart className={cn('h-5 w-5', fav ? 'fill-primary text-primary' : 'text-muted-foreground')} />
        </button>
      </div>

      {/* Content card */}
      <div className="px-4 -mt-5 relative z-10">
        <div className="bg-card rounded-t-3xl p-5 shadow-lg space-y-4">
          {/* Name & Price row */}
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-xl font-extrabold leading-tight flex-1">{place.name}</h1>
            {place.price_range && (
              <span className="text-lg font-bold text-primary">{PRICE_LABELS[place.price_range]}</span>
            )}
          </div>

          {/* Address & navigate */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-muted-foreground flex-1 min-w-0">
              <MapPin className="h-3.5 w-3.5 text-primary flex-shrink-0" />
              <span className="text-xs truncate">{place.address || place.neighborhood}{place.city ? `, ${place.city}` : ''}</span>
            </div>
            {(place.google_maps_url || (place.latitude && place.longitude)) && (
              <button
                onClick={openMap}
                className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md flex-shrink-0 ml-2"
              >
                <MapPin className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Category badge */}
          {(place as any).categories?.name && (
            <span className="inline-block text-[11px] font-semibold bg-accent text-accent-foreground px-3 py-1 rounded-full">
              {(place as any).categories.name}
            </span>
          )}

          {/* Stats row */}
          <div className="flex items-center justify-around py-4 bg-secondary rounded-2xl">
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <Star className="h-4.5 w-4.5 fill-accent text-accent" />
              </div>
              <span className="text-sm font-bold">{Number(place.rating || 0).toFixed(1)}</span>
              <span className="text-[10px] text-muted-foreground">Avaliação</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="h-4.5 w-4.5 text-primary" />
              </div>
              <span className="text-sm font-bold">{place.visit_count || 0}</span>
              <span className="text-[10px] text-muted-foreground">Visitas</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center">
                <Image className="h-4.5 w-4.5" />
              </div>
              <span className="text-sm font-bold">{gallery.length}</span>
              <span className="text-[10px] text-muted-foreground">Fotos</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('details')}
              className={cn(
                'flex-1 py-2.5 text-sm font-bold transition-colors border-b-2',
                activeTab === 'details' ? 'text-primary border-primary' : 'text-muted-foreground border-transparent'
              )}
            >
              DETALHES
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={cn(
                'flex-1 py-2.5 text-sm font-bold transition-colors border-b-2',
                activeTab === 'reviews' ? 'text-primary border-primary' : 'text-muted-foreground border-transparent'
              )}
            >
              AVALIAÇÕES
            </button>
          </div>

          {activeTab === 'details' ? (
            <div className="space-y-3">
              {place.description && (
                <p className="text-muted-foreground text-sm leading-relaxed">{place.description}</p>
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
          ) : (
            <div className="py-6 text-center text-muted-foreground text-sm">
              Nenhuma avaliação ainda
            </div>
          )}

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            {place.whatsapp && (
              <Button
                onClick={() => window.open(`https://wa.me/${place.whatsapp!.replace(/\D/g, '')}`, '_blank')}
                className="h-11 rounded-2xl gap-2 text-sm"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </Button>
            )}
            {place.instagram && (
              <Button
                variant="outline"
                onClick={() => window.open(place.instagram!.startsWith('http') ? place.instagram! : `https://instagram.com/${place.instagram}`, '_blank')}
                className="h-11 rounded-2xl gap-2 text-sm"
              >
                <ExternalLink className="h-4 w-4" /> Instagram
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="mt-4 px-4">
          <h2 className="font-bold text-base mb-3">Fotos</h2>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {gallery.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`${place.name} foto ${i + 1}`}
                className="h-28 w-40 rounded-2xl object-cover flex-shrink-0"
                loading="lazy"
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
