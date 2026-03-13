import { useBanners } from '@/hooks/usePlaces';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function BannerCarousel() {
  const { data: banners, isLoading } = useBanners();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!banners?.length) return;
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners?.length]);

  if (isLoading) {
    return <Skeleton className="mx-4 h-40 rounded-2xl" />;
  }

  if (!banners?.length) return null;

  return (
    <div className="px-4 relative">
      <div className="rounded-2xl overflow-hidden relative aspect-[2/1]">
        {banners.map((banner, i) => (
          <div
            key={banner.id}
            className={cn(
              'absolute inset-0 transition-opacity duration-700',
              i === current ? 'opacity-100' : 'opacity-0'
            )}
          >
            <img
              src={banner.image_url}
              alt={banner.title || 'Banner'}
              className="w-full h-full object-cover"
            />
            {banner.title && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <div>
                  <h3 className="text-white font-bold text-lg">{banner.title}</h3>
                  {banner.subtitle && <p className="text-white/80 text-sm">{banner.subtitle}</p>}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {banners.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                'w-2 h-2 rounded-full transition-colors',
                i === current ? 'bg-primary' : 'bg-muted-foreground/30'
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
