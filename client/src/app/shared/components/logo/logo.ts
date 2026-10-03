import { Component, computed, input, signal } from '@angular/core';

@Component({
  selector: 'app-logo',
  template: `
    <span class="logo">
      @if (src() && !failed()) {
        <img [src]="src()" [alt]="name() + ' logo'" loading="lazy" (error)="failed.set(true)" />
      } @else {
        <span class="logo__fallback">{{ initials() }}</span>
      }
    </span>
  `,
})
export class Logo {
  readonly src = input('');
  readonly name = input.required<string>();

  protected readonly failed = signal(false);

  protected readonly initials = computed(() => {
    const words = this.name().split(/[\s,]+/).filter(Boolean);
    const letters = words.length > 1 ? words[0][0] + words[1][0] : this.name().slice(0, 2);
    return letters.toUpperCase();
  });
}
