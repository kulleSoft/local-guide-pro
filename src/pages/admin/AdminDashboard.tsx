import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, Layers, Star, Image } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [places, categories, reviews, banners] = await Promise.all([
        supabase.from('places').select('id', { count: 'exact', head: true }),
        supabase.from('categories').select('id', { count: 'exact', head: true }),
        supabase.from('reviews').select('id', { count: 'exact', head: true }),
        supabase.from('banners').select('id', { count: 'exact', head: true }),
      ]);
      return {
        places: places.count || 0,
        categories: categories.count || 0,
        reviews: reviews.count || 0,
        banners: banners.count || 0,
      };
    },
  });

  const items = [
    { icon: MapPin, label: 'Locais', value: stats?.places ?? '-', color: 'text-primary' },
    { icon: Layers, label: 'Categorias', value: stats?.categories ?? '-', color: 'text-accent' },
    { icon: Star, label: 'Avaliações', value: stats?.reviews ?? '-', color: 'text-chart-3' },
    { icon: Image, label: 'Banners', value: stats?.banners ?? '-', color: 'text-chart-4' },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-2 gap-3">
        {items.map(({ icon: Icon, label, value, color }) => (
          <Card key={label} className="rounded-2xl">
            <CardContent className="p-4 flex flex-col items-center gap-2">
              <Icon className={`h-6 w-6 ${color}`} />
              <span className="text-2xl font-bold">{value}</span>
              <span className="text-xs text-muted-foreground">{label}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
