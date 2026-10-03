import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon } from '@ng-icons/core';

import { PortfolioStore } from '../../../core/services/portfolio-store';
import { Theme, ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, NgIcon],
  template: `
    <header class="topbar">
      <div class="container topbar__inner">
        <a routerLink="/" class="brand" aria-label="Home">
          <span class="brand__mark">{{ initials() }}</span>
          <span class="brand__name">{{ name() }}</span>
        </a>

        <nav class="dock" aria-label="Primary">
          @for (item of items; track item.path) {
            <a
              class="dock__item"
              [routerLink]="item.path"
              routerLinkActive="is-active"
              [routerLinkActiveOptions]="{ exact: item.path === '/' }"
            >
              <ng-icon [name]="item.icon" size="18" />
              <span>{{ item.label }}</span>
            </a>
          }
        </nav>

        <div class="theme" role="radiogroup" aria-label="Colour theme">
          @for (option of themes; track option.id) {
            <button
              type="button"
              role="radio"
              [attr.aria-checked]="themeService.theme() === option.id"
              [attr.aria-label]="option.label + ' theme'"
              [title]="option.label"
              (click)="themeService.set(option.id)"
            >
              <ng-icon [name]="option.icon" size="16" />
            </button>
          }
        </div>
      </div>
    </header>
  `,
})
export class Navbar {
  private readonly store = inject(PortfolioStore);
  protected readonly themeService = inject(ThemeService);

  protected readonly items = [
    { path: '/', label: 'Home', icon: 'faSolidHouse' },
    { path: '/projects', label: 'Projects', icon: 'faSolidFolderOpen' },
    { path: '/services', label: 'Services', icon: 'faSolidGears' },
    { path: '/skills', label: 'Skills', icon: 'faSolidLayerGroup' },
    { path: '/contact', label: 'Contact', icon: 'faSolidEnvelope' },
  ];

  protected readonly themes: { id: Theme; icon: string; label: string }[] = [
    { id: 'light', icon: 'faSolidSun', label: 'Light' },
    { id: 'dark', icon: 'faSolidMoon', label: 'Dark' },
    { id: 'terminal', icon: 'faSolidTerminal', label: 'Terminal' },
  ];

  protected readonly name = computed(() => this.store.profile()?.name ?? 'Portfolio');

  protected readonly initials = computed(() =>
    this.name()
      .split(' ')
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase(),
  );
}
