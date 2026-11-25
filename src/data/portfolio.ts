export type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  alt: string;
};

export const portfolioFallback: PortfolioItem[] = [
  {
    id: 'portrait-01',
    title: 'Luz de fim de tarde',
    category: 'Retratos',
    imageUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85',
    alt: 'Retrato feminino em luz natural',
  },
  {
    id: 'portrait-02',
    title: 'Entre respiros',
    category: 'Retratos',
    imageUrl:
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1000&q=85',
    alt: 'Retrato espontâneo ao ar livre',
  },
  {
    id: 'wedding-01',
    title: 'Um sim tranquilo',
    category: 'Encontros',
    imageUrl:
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85',
    alt: 'Casal celebrando ao ar livre',
  },
  {
    id: 'wedding-02',
    title: 'Até a última dança',
    category: 'Encontros',
    imageUrl:
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=85',
    alt: 'Celebração íntima entre amigos',
  },
  {
    id: 'everyday-01',
    title: 'Domingo sem pressa',
    category: 'Cotidiano',
    imageUrl:
      'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1000&q=85',
    alt: 'Luz suave atravessando uma paisagem',
  },
  {
    id: 'editorial-01',
    title: 'Matéria e movimento',
    category: 'Editorial',
    imageUrl:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=85',
    alt: 'Retrato editorial em tons naturais',
  },
];
