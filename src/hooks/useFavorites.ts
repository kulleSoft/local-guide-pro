import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = 'guia-local-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      try { setFavorites(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, []);

  const toggleFavorite = useCallback((placeId: string) => {
    setFavorites(prev => {
      const next = prev.includes(placeId)
        ? prev.filter(id => id !== placeId)
        : [...prev, placeId];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isFavorite = useCallback((placeId: string) => favorites.includes(placeId), [favorites]);

  return { favorites, toggleFavorite, isFavorite };
}
