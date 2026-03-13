
-- Insert categories
INSERT INTO public.categories (name, slug, icon, display_order) VALUES
  ('Restaurantes', 'restaurantes', 'UtensilsCrossed', 1),
  ('Bares', 'bares', 'Wine', 2),
  ('Cafeterias', 'cafeterias', 'Coffee', 3),
  ('Hotéis', 'hoteis', 'Hotel', 4),
  ('Praias', 'praias', 'Waves', 5),
  ('Pontos Turísticos', 'pontos-turisticos', 'Camera', 6);

-- Insert places
INSERT INTO public.places (name, slug, description, category_id, address, city, neighborhood, latitude, longitude, google_maps_url, cover_image, phone, whatsapp, instagram, opening_hours, price_range, featured, active, rating, display_order) VALUES
  ('Cantina do Porto', 'cantina-do-porto', 'Restaurante italiano à beira-mar com massas artesanais e frutos do mar frescos. Ambiente acolhedor com vista para o pôr do sol.', (SELECT id FROM categories WHERE slug='restaurantes'), 'Av. Beira Mar, 1200', 'Florianópolis', 'Centro', -27.5954, -48.5480, 'https://maps.google.com/?q=-27.5954,-48.5480', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600', '(48) 3333-1234', '5548933331234', '@cantinadoporto', 'Seg-Dom 11h-23h', 3, true, true, 4.7, 1),
  ('Bar do Zeca', 'bar-do-zeca', 'O melhor chopp artesanal da cidade com petiscos incríveis. Música ao vivo toda sexta e sábado.', (SELECT id FROM categories WHERE slug='bares'), 'Rua das Flores, 456', 'Florianópolis', 'Lagoa da Conceição', -27.5969, -48.4827, 'https://maps.google.com/?q=-27.5969,-48.4827', 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600', '(48) 3333-5678', '5548933335678', '@bardozeca', 'Ter-Dom 17h-01h', 2, true, true, 4.5, 2),
  ('Café Colonial Oma', 'cafe-colonial-oma', 'Café colonial tradicional com pães caseiros, bolos, geleias artesanais e o melhor café da região.', (SELECT id FROM categories WHERE slug='cafeterias'), 'Rua XV de Novembro, 789', 'Blumenau', 'Centro', -26.9194, -49.0661, 'https://maps.google.com/?q=-26.9194,-49.0661', 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=600', '(47) 3322-9876', '5547933229876', '@cafeoma', 'Seg-Sáb 7h-19h', 2, false, true, 4.8, 3),
  ('Hotel Vista Mar', 'hotel-vista-mar', 'Hotel boutique com vista panorâmica para o oceano. Piscina infinita, spa e restaurante gourmet.', (SELECT id FROM categories WHERE slug='hoteis'), 'Rod. Jornalista Manoel de Menezes, 2001', 'Florianópolis', 'Praia Mole', -27.6037, -48.4393, 'https://maps.google.com/?q=-27.6037,-48.4393', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600', '(48) 3232-0000', '5548932320000', '@hotelvistamar', '24h', 5, true, true, 4.9, 4),
  ('Praia da Joaquina', 'praia-da-joaquina', 'Uma das praias mais famosas do sul do Brasil, conhecida pelo surf e as dunas. Areia branca e mar agitado.', (SELECT id FROM categories WHERE slug='praias'), 'Praia da Joaquina', 'Florianópolis', 'Joaquina', -27.6310, -48.4467, 'https://maps.google.com/?q=-27.6310,-48.4467', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600', NULL, NULL, '@praiadajoaquina', 'Aberto 24h', 1, false, true, 4.6, 5),
  ('Mirante do Morro da Cruz', 'mirante-morro-da-cruz', 'Vista panorâmica 360° de Florianópolis. Ponto imperdível para fotos e apreciar o pôr do sol.', (SELECT id FROM categories WHERE slug='pontos-turisticos'), 'Morro da Cruz', 'Florianópolis', 'Centro', -27.5880, -48.5520, 'https://maps.google.com/?q=-27.5880,-48.5520', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600', NULL, NULL, '@mirante_floripa', 'Aberto 24h', 1, true, true, 4.4, 6),
  ('Osteria Italiana', 'osteria-italiana', 'Culinária italiana autêntica com ingredientes importados. Carta de vinhos premiada.', (SELECT id FROM categories WHERE slug='restaurantes'), 'Rua Bocaiúva, 234', 'Florianópolis', 'Centro', -27.5940, -48.5500, 'https://maps.google.com/?q=-27.5940,-48.5500', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600', '(48) 3025-1111', '5548930251111', '@osteriaitaliana', 'Seg-Sáb 19h-00h', 4, false, true, 4.3, 7),
  ('Lounge 42', 'lounge-42', 'Bar rooftop com drinks autorais, vista da cidade e DJ sets nos finais de semana.', (SELECT id FROM categories WHERE slug='bares'), 'Av. Hercílio Luz, 42, Cobertura', 'Florianópolis', 'Centro', -27.5935, -48.5485, 'https://maps.google.com/?q=-27.5935,-48.5485', 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600', '(48) 3333-4242', '5548933334242', '@lounge42floripa', 'Qui-Sáb 19h-03h', 3, false, true, 4.1, 8);

-- Insert banners
INSERT INTO public.banners (title, subtitle, image_url, display_order, active) VALUES
  ('Descubra Florianópolis', 'Os melhores lugares da ilha da magia', 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800', 1, true),
  ('Gastronomia Local', 'Sabores únicos te esperam', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', 2, true),
  ('Vida Noturna', 'Bares e lounges imperdíveis', 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800', 3, true);
