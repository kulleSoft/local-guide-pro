import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function usePlaces(filters?: {
  categoryId?: string;
  search?: string;
  city?: string;
  neighborhood?: string;
  featured?: boolean;
}) {
  return useQuery({
    queryKey: ['places', filters],
    queryFn: async () => {
      let query = supabase
        .from('places')
        .select('*, categories(name, slug, icon)')
        .eq('active', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (filters?.categoryId) {
        query = query.eq('category_id', filters.categoryId);
      }
      if (filters?.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }
      if (filters?.city) {
        query = query.eq('city', filters.city);
      }
      if (filters?.neighborhood) {
        query = query.eq('neighborhood', filters.neighborhood);
      }
      if (filters?.featured) {
        query = query.eq('featured', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function usePlace(slug: string) {
  return useQuery({
    queryKey: ['place', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('places')
        .select('*, categories(name, slug, icon)')
        .eq('slug', slug)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('active', true)
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}

export function useBanners() {
  return useQuery({
    queryKey: ['banners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('active', true)
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}

export function useCities() {
  return useQuery({
    queryKey: ['cities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('places')
        .select('city')
        .eq('active', true)
        .not('city', 'is', null);
      if (error) throw error;
      const unique = [...new Set(data.map(d => d.city).filter(Boolean))];
      return unique as string[];
    },
  });
}
