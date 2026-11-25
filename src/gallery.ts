import Alpine from 'alpinejs';
import { registerSiteShell } from './components/site-shell';
import { portfolioFallback, type PortfolioItem } from './data/portfolio';
import './scss/main.scss';

registerSiteShell(Alpine);
type GalleryState = {
  items: PortfolioItem[];
  activeCategory: string;
  selectedItem: PortfolioItem | null;
  usingPlaceholders: boolean;
  categories: string[];
  visibleItems: PortfolioItem[];
  init(this: GalleryState): Promise<void>;
  openItem(this: GalleryState, item: PortfolioItem): void;
};

Alpine.data(
  'portfolioGallery',
  (): GalleryState => ({
    items: portfolioFallback as PortfolioItem[],
    activeCategory: 'Tudo',
    selectedItem: null as PortfolioItem | null,
    usingPlaceholders: true,
    get categories() {
      return ['Tudo', ...new Set(this.items.map((item) => item.category))];
    },
    get visibleItems() {
      return this.activeCategory === 'Tudo'
        ? this.items
        : this.items.filter((item) => item.category === this.activeCategory);
    },
    async init(this: GalleryState) {
      try {
        const response = await fetch('/api/portfolio');
        if (!response.ok) return;
        const items = (await response.json()) as PortfolioItem[];
        if (Array.isArray(items) && items.length) {
          this.items = items;
          this.usingPlaceholders = false;
        }
      } catch {
        this.usingPlaceholders = true;
      }
    },
    openItem(this: GalleryState, item: PortfolioItem) {
      this.selectedItem = item;
    },
  }),
);
Alpine.start();
