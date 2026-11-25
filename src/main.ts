import Alpine from 'alpinejs';
import { registerSiteShell } from './components/site-shell';
import './scss/main.scss';

registerSiteShell(Alpine);
Alpine.data('reveal', () => ({ visible: true }));
Alpine.start();
