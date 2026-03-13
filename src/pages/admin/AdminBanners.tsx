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

export default function AdminBanners() {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', subtitle: '', image_url: '', link: '', display_order: 0, active: true });
  const qc = useQueryClient();

  const { data: banners, isLoading } = useQuery({
    queryKey: ['admin-banners'],
    queryFn: async () => {
      const { data, error } = await supabase.from('banners').select('*').order('display_order');
      if (error) throw error;
      return data;
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      if (editId) {
        const { error } = await supabase.from('banners').update(form).eq('id', editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('banners').insert(form);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-banners'] });
      qc.invalidateQueries({ queryKey: ['banners'] });
      setOpen(false); setEditId(null);
      setForm({ title: '', subtitle: '', image_url: '', link: '', display_order: 0, active: true });
      toast.success('Salvo!');
    },
    onError: () => toast.error('Erro ao salvar'),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('banners').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-banners'] }); toast.success('Excluído!'); },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Banners</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditId(null); setForm({ title: '', subtitle: '', image_url: '', link: '', display_order: 0, active: true }); }} className="rounded-xl gap-2"><Plus className="h-4 w-4" /> Novo</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editId ? 'Editar' : 'Novo'} Banner</DialogTitle></DialogHeader>
            <form onSubmit={e => { e.preventDefault(); if (!form.image_url) { toast.error('URL da imagem é obrigatória'); return; } save.mutate(); }} className="space-y-4">
              <div className="space-y-2"><Label>Título</Label><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="h-11 rounded-xl" /></div>
              <div className="space-y-2"><Label>Subtítulo</Label><Input value={form.subtitle} onChange={e => setForm(p => ({ ...p, subtitle: e.target.value }))} className="h-11 rounded-xl" /></div>
              <div className="space-y-2"><Label>URL da imagem *</Label><Input value={form.image_url} onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))} className="h-11 rounded-xl" /></div>
              <div className="space-y-2"><Label>Link</Label><Input value={form.link} onChange={e => setForm(p => ({ ...p, link: e.target.value }))} className="h-11 rounded-xl" /></div>
              <div className="space-y-2"><Label>Ordem</Label><Input type="number" value={form.display_order} onChange={e => setForm(p => ({ ...p, display_order: parseInt(e.target.value) }))} className="h-11 rounded-xl" /></div>
              <div className="flex items-center justify-between"><Label>Ativo</Label><Switch checked={form.active} onCheckedChange={v => setForm(p => ({ ...p, active: v }))} /></div>
              <Button type="submit" className="w-full h-12 rounded-xl" disabled={save.isPending}>{save.isPending ? 'Salvando...' : 'Salvar'}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? <p className="text-muted-foreground">Carregando...</p> : !banners?.length ? (
        <p className="text-muted-foreground text-center py-8">Nenhum banner</p>
      ) : (
        <div className="space-y-2">
          {banners.map((b: any) => (
            <div key={b.id} className="bg-card rounded-xl border p-3 flex items-center gap-3">
              <div className="w-20 h-12 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                <img src={b.image_url} className="w-full h-full object-cover" alt="" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{b.title || 'Sem título'}</p>
                <p className="text-xs text-muted-foreground">{b.active ? 'Ativo' : 'Inativo'}</p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => { setEditId(b.id); setForm({ title: b.title || '', subtitle: b.subtitle || '', image_url: b.image_url, link: b.link || '', display_order: b.display_order || 0, active: b.active }); setOpen(true); }}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="h-9 w-9 text-destructive"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>Excluir banner?</AlertDialogTitle><AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => del.mutate(b.id)}>Excluir</AlertDialogAction></AlertDialogFooter>
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
