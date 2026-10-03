import { effect, Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark' | 'terminal';

const STORAGE_KEY = 'portfolio-theme';
const THEMES: Theme[] = ['light', 'dark', 'terminal'];

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<Theme>(this.initialTheme());

  constructor() {
    effect(() => {
      const theme = this.theme();
      document.documentElement.setAttribute('data-theme', theme);

      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch {
        // Storage can be blocked (private mode). The theme still works.
      }
    });
  }

  set(theme: Theme): void {
    this.theme.set(theme);
  }

  private initialTheme(): Theme {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (saved && THEMES.includes(saved)) {
        return saved;
      }
    } catch {
      // ignore
    }

    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
