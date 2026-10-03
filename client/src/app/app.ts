import { Component, effect, inject } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';

import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { Title, Meta } from '@angular/platform-browser';
import { PortfolioStore } from './core/services/portfolio-store';

import { ThemeService } from './core/services/theme.service';
import { Footer } from './shared/components/footer/footer';
import { Navbar } from './shared/components/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer],
  template: `
    @if (!isAdmin()) { <app-navbar /> }
    <main class="container">
      <router-outlet />
    </main>
    @if (!isAdmin()) { <app-footer /> }
  `,
})
export class App {
  private readonly router = inject(Router);
  protected readonly isAdmin = toSignal(this.router.events.pipe(filter(e => e instanceof NavigationEnd), map(() => this.router.url.startsWith('/admin'))), { initialValue: this.router.url.startsWith('/admin') });
  private readonly store = inject(PortfolioStore);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly routeUrl = toSignal(this.router.events.pipe(filter(e => e instanceof NavigationEnd), map(() => this.router.url)), { initialValue: this.router.url });
  constructor() {
    // Creating the service applies the saved theme straight away.
    inject(ThemeService);
    effect(() => {
      const profile = this.store.profile();
      const url = this.routeUrl();
      if (!profile) return;
      this.meta.updateTag({ name: 'description', content: profile.seoDescription || profile.summary });
      if (url.startsWith('/projects/')) return;
      const page = url.split('/')[1]?.split(/[?#]/)[0] || 'Home';
      this.title.setTitle(`${page[0].toUpperCase() + page.slice(1)} | ${profile.name}`);
    });
  }
}
