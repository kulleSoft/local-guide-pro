import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useCategories } from '@/hooks/usePlaces';

function slugify(text: string) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

interface PlaceForm {
  name: string; slug: string; description: string; category_id: string;
  address: string; city: string; neighborhood: string;
  latitude: string; longitude: string; google_maps_url: string;
  cover_image: string; phone: string; whatsapp: string; instagram: string;
  website: string; opening_hours: string; price_range: number;
  featured: boolean; active: boolean; display_order: number;
  specialties: string;
}

const emptyForm: PlaceForm = {
  name: '', slug: '', description: '', category_id: '',
  address: '', city: '', neighborhood: '',
  latitude: '', longitude: '', google_maps_url: '',
  cover_image: '', phone: '', whatsapp: '', instagram: '',
  website: '', opening_hours: '', price_range: 1,
  featured: false, active: true, display_order: 0,
  specialties: '',
};

export default function AdminPlaces() {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<PlaceForm>(emptyForm);
  const queryClient = useQueryClient();
  const { data: categories } = useCategories();

  const { data: places, isLoading } = useQuery({
    queryKey: ['admin-places'],
    queryFn: async () => {
      const { data, error } = await supabase.from('places').select('*, categories(name)').order('display_order').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (form: PlaceForm) => {
      const payload = {
        ...form,
        slug: form.slug || slugify(form.name),
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
        category_id: form.category_id || null,
      };
      if (editId) {
        const { error } = await supabase.from('places').update(payload).eq('id', editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('places').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-places'] });
      queryClient.invalidateQueries({ queryKey: ['places'] });
      setOpen(false);
      setEditId(null);
      setForm(emptyForm);
      toast.success(editId ? 'Local atualizado!' : 'Local criado!');
    },
    onError: () => toast.error('Erro ao salvar local'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('places').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-places'] });
      queryClient.invalidateQueries({ queryKey: ['places'] });
      toast.success('Local excluído!');
    },
    onError: () => toast.error('Erro ao excluir'),
  });

  const openEdit = (place: any) => {
    setEditId(place.id);
    setForm({
      name: place.name || '', slug: place.slug || '', description: place.description || '',
      category_id: place.category_id || '', address: place.address || '',
      city: place.city || '', neighborhood: place.neighborhood || '',
      latitude: place.latitude?.toString() || '', longitude: place.longitude?.toString() || '',
      google_maps_url: place.google_maps_url || '', cover_image: place.cover_image || '',
      phone: place.phone || '', whatsapp: place.whatsapp || '',
      instagram: place.instagram || '', website: place.website || '',
      opening_hours: place.opening_hours || '', price_range: place.price_range || 1,
      featured: place.featured || false, active: place.active ?? true,
      display_order: place.display_order || 0,
      specialties: place.specialties || '',
    });
    setOpen(true);
  };

  const openNew = () => { setEditId(null); setForm(emptyForm); setOpen(true); };

  const update = (key: keyof PlaceForm, value: any) => {
    setForm(prev => ({
      ...prev,
      [key]: value,
      ...(key === 'name' && !editId ? { slug: slugify(value) } : {}),
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Locais</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="rounded-xl gap-2"><Plus className="h-4 w-4" /> Novo</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto max-w-md">
            <DialogHeader>
              <DialogTitle>{editId ? 'Editar Local' : 'Novo Local'}</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={e => { e.preventDefault(); if (!form.name) { toast.error('Nome é obrigatório'); return; } saveMutation.mutate(form); }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label>Nome *</Label>
                <Input value={form.name} onChange={e => update('name', e.target.value)} className="h-11 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input value={form.slug} onChange={e => update('slug', e.target.value)} className="h-11 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select value={form.category_id} onValueChange={v => update('category_id', v)}>
                  <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {categories?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea value={form.description} onChange={e => update('description', e.target.value)} className="rounded-xl" rows={3} />
              </div>
              <div className="space-y-2">
                <Label>URL da imagem de capa</Label>
                <Input value={form.cover_image} onChange={e => update('cover_image', e.target.value)} className="h-11 rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Cidade</Label>
                  <Input value={form.city} onChange={e => update('city', e.target.value)} className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Bairro</Label>
                  <Input value={form.neighborhood} onChange={e => update('neighborhood', e.target.value)} className="h-11 rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Endereço</Label>
                <Input value={form.address} onChange={e => update('address', e.target.value)} className="h-11 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Google Maps URL</Label>
                <Input value={form.google_maps_url} onChange={e => update('google_maps_url', e.target.value)} className="h-11 rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Latitude</Label>
                  <Input value={form.latitude} onChange={e => update('latitude', e.target.value)} className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Longitude</Label>
                  <Input value={form.longitude} onChange={e => update('longitude', e.target.value)} className="h-11 rounded-xl" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input value={form.phone} onChange={e => update('phone', e.target.value)} className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>WhatsApp</Label>
                  <Input value={form.whatsapp} onChange={e => update('whatsapp', e.target.value)} className="h-11 rounded-xl" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Instagram</Label>
                  <Input value={form.instagram} onChange={e => update('instagram', e.target.value)} className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Website</Label>
                  <Input value={form.website} onChange={e => update('website', e.target.value)} className="h-11 rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Horário de funcionamento</Label>
                <Input value={form.opening_hours} onChange={e => update('opening_hours', e.target.value)} className="h-11 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Especialidades da casa</Label>
                <Input value={form.specialties} onChange={e => update('specialties', e.target.value)} placeholder="Ex: Pizza, Pasta, Risoto" className="h-11 rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Faixa de preço (1-5)</Label>
                  <Input type="number" min={1} max={5} value={form.price_range} onChange={e => update('price_range', parseInt(e.target.value))} className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Ordem</Label>
                  <Input type="number" value={form.display_order} onChange={e => update('display_order', parseInt(e.target.value))} className="h-11 rounded-xl" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label>Destaque</Label>
                <Switch checked={form.featured} onCheckedChange={v => update('featured', v)} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Ativo</Label>
                <Switch checked={form.active} onCheckedChange={v => update('active', v)} />
              </div>
              <Button type="submit" className="w-full h-12 rounded-xl" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : !places?.length ? (
        <p className="text-muted-foreground text-center py-8">Nenhum local cadastrado</p>
      ) : (
        <div className="space-y-3">
          {places.map((place: any) => (
            <div key={place.id} className="bg-card rounded-xl border p-3 flex items-center gap-3">
              <div className="w-14 h-14 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                {place.cover_image && <img src={place.cover_image} className="w-full h-full object-cover" alt="" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{place.name}</p>
                <p className="text-xs text-muted-foreground truncate">{(place as any).categories?.name} • {place.active ? 'Ativo' : 'Inativo'}</p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => openEdit(place)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir local?</AlertDialogTitle>
                      <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteMutation.mutate(place.id)}>Excluir</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
