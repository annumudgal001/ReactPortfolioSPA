import { DestroyRef, Directive, ElementRef, inject } from '@angular/core';

@Directive({ selector: '[appReveal]' })
export class Reveal {
  constructor() {
    const node = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    node.classList.add('reveal');

    if (typeof IntersectionObserver === 'undefined') {
      node.classList.add('is-visible');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add('is-visible');
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(node);
    inject(DestroyRef).onDestroy(() => observer.disconnect());
  }
}
