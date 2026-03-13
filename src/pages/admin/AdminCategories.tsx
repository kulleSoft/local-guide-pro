import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

function slugify(t: string) {
  return t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function AdminCategories() {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', slug: '', icon: 'MapPin', display_order: 0, active: true });
  const qc = useQueryClient();

  const { data: categories, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('*').order('display_order');
      if (error) throw error;
      return data;
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      const payload = { ...form, slug: form.slug || slugify(form.name) };
      if (editId) {
        const { error } = await supabase.from('categories').update(payload).eq('id', editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('categories').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-categories'] });
      qc.invalidateQueries({ queryKey: ['categories'] });
      setOpen(false); setEditId(null);
      setForm({ name: '', slug: '', icon: 'MapPin', display_order: 0, active: true });
      toast.success('Salvo!');
    },
    onError: () => toast.error('Erro ao salvar'),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-categories'] }); toast.success('Excluído!'); },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Categorias</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditId(null); setForm({ name: '', slug: '', icon: 'MapPin', display_order: 0, active: true }); }} className="rounded-xl gap-2"><Plus className="h-4 w-4" /> Nova</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editId ? 'Editar' : 'Nova'} Categoria</DialogTitle></DialogHeader>
            <form onSubmit={e => { e.preventDefault(); if (!form.name) { toast.error('Nome é obrigatório'); return; } save.mutate(); }} className="space-y-4">
              <div className="space-y-2"><Label>Nome *</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value, ...(!editId ? { slug: slugify(e.target.value) } : {}) }))} className="h-11 rounded-xl" /></div>
              <div className="space-y-2"><Label>Slug</Label><Input value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} className="h-11 rounded-xl" /></div>
              <div className="space-y-2"><Label>Ícone (nome Lucide)</Label><Input value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} className="h-11 rounded-xl" /></div>
              <div className="space-y-2"><Label>Ordem</Label><Input type="number" value={form.display_order} onChange={e => setForm(p => ({ ...p, display_order: parseInt(e.target.value) }))} className="h-11 rounded-xl" /></div>
              <div className="flex items-center justify-between"><Label>Ativa</Label><Switch checked={form.active} onCheckedChange={v => setForm(p => ({ ...p, active: v }))} /></div>
              <Button type="submit" className="w-full h-12 rounded-xl" disabled={save.isPending}>{save.isPending ? 'Salvando...' : 'Salvar'}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? <p className="text-muted-foreground">Carregando...</p> : !categories?.length ? (
        <p className="text-muted-foreground text-center py-8">Nenhuma categoria</p>
      ) : (
        <div className="space-y-2">
          {categories.map((cat: any) => (
            <div key={cat.id} className="bg-card rounded-xl border p-3 flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm">{cat.name}</p>
                <p className="text-xs text-muted-foreground">{cat.slug} • {cat.active ? 'Ativa' : 'Inativa'}</p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => { setEditId(cat.id); setForm({ name: cat.name, slug: cat.slug, icon: cat.icon || 'MapPin', display_order: cat.display_order || 0, active: cat.active }); setOpen(true); }}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="h-9 w-9 text-destructive"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>Excluir categoria?</AlertDialogTitle><AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => del.mutate(cat.id)}>Excluir</AlertDialogAction></AlertDialogFooter>
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
