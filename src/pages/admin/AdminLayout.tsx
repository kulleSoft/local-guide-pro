import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LayoutDashboard, MapPin, Layers, Image, LogOut, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

const links = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: MapPin, label: 'Locais', path: '/admin/places' },
  { icon: Layers, label: 'Categorias', path: '/admin/categories' },
  { icon: Image, label: 'Banners', path: '/admin/banners' },
];

export default function AdminLayout() {
  const { isAdmin, loading, signOut, user } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate('/admin/login');
    if (!loading && user && !isAdmin) navigate('/admin/login');
  }, [loading, user, isAdmin, navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><p>Carregando...</p></div>;
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2">
            <Link to="/">
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            </Link>
            <span className="font-bold text-lg">Painel Admin</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => { signOut(); navigate('/admin/login'); }}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Nav */}
      <nav className="flex gap-1 overflow-x-auto scrollbar-hide px-4 py-3 border-b">
        {links.map(({ icon: Icon, label, path }) => (
          <Link
            key={path}
            to={path}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
              pathname.startsWith(path) ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
