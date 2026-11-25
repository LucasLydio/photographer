import type Alpine from 'alpinejs';

export function registerSiteShell(alpine: typeof Alpine) {
  alpine.data('siteNav', () => ({ open: false }));

  customElements.define(
    'site-header',
    class extends HTMLElement {
      connectedCallback() {
        const active = this.getAttribute('active');
        const links = [
          ['inicio', 'Início', '/'],
          ['galeria', 'Galeria', '/gallery.html'],
          ['experiencias', 'Experiências', '/services.html'],
        ] as const;
        this.innerHTML = `
        <header class="site-header page-wrap" x-data="siteNav">
          <a class="brand" href="/" aria-label="Barbara Jorge, início"><span class="brand__name">Bárbara Jorge</span><span class="brand__role">Fotografia</span></a>
          <button class="menu-toggle" type="button" @click="open = !open" :aria-expanded="open" :aria-label="open ? 'Fechar menu' : 'Abrir menu'"><span></span><span></span></button>
          <nav class="site-nav" :class="{ 'is-open': open }" aria-label="Navegação principal">
            ${links.map(([key, label, href]) => `<a href="${href}" ${key === active ? 'aria-current="page"' : ''}>${label}</a>`).join('')}
            <a class="site-nav__contact" href="https://www.instagram.com/bybarbarajorge/" target="_blank" rel="noreferrer">Vamos conversar <span aria-hidden="true">↗</span></a>
          </nav>
        </header>`;
      }
    },
  );

  customElements.define(
    'site-footer',
    class extends HTMLElement {
      connectedCallback() {
        this.innerHTML = `
        <footer class="site-footer">
          <div class="page-wrap site-footer__top">
            <a class="brand brand--footer" href="/"><span class="brand__name">Bárbara Jorge</span><span class="brand__role">Fotografia</span></a>
            <p>Histórias reais, contadas com presença.</p>
            <a class="text-link" href="https://www.instagram.com/bybarbarajorge/" target="_blank" rel="noreferrer">@bybarbarajorge <span aria-hidden="true">↗</span></a>
          </div>
          <div class="page-wrap site-footer__bottom"><span>© ${new Date().getFullYear()} Barbara Jorge</span><a href="/admin.html">Acesso da fotógrafa</a><span>Feito para durar na memória.</span></div>
        </footer>`;
      }
    },
  );
}
