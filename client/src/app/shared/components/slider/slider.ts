import { afterNextRender, Component, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-slider',
  imports: [NgIcon],
  host: { '(window:resize)': 'update()' },
  template: `
    <div class="slider">
      <div
        class="slider__track"
        #track
        tabindex="0"
        role="region"
        aria-label="Scrollable list"
        (scroll)="update()"
      >
        <ng-content />
      </div>

      <div class="slider__controls">
        <button
          type="button"
          class="icon-btn"
          aria-label="Previous"
          [disabled]="!canPrev()"
          (click)="move(-1)"
        >
          <ng-icon name="faSolidChevronLeft" size="16" />
        </button>

        <ng-content select="[slider-action]" />

        <button
          type="button"
          class="icon-btn"
          aria-label="Next"
          [disabled]="!canNext()"
          (click)="move(1)"
        >
          <ng-icon name="faSolidChevronRight" size="16" />
        </button>
      </div>
    </div>
  `,
})
export class Slider {
  private readonly track = viewChild.required<ElementRef<HTMLDivElement>>('track');

  protected readonly canPrev = signal(false);
  protected readonly canNext = signal(true);

  constructor() {
    const destroy = inject(DestroyRef);
    afterNextRender(() => {
      const observer = new ResizeObserver(() => this.update());
      observer.observe(this.track().nativeElement);
      const changes = new MutationObserver(() => this.update());
      changes.observe(this.track().nativeElement, { childList: true, subtree: true });
      this.update();
      destroy.onDestroy(() => { observer.disconnect(); changes.disconnect(); });
    });
  }

  protected move(direction: -1 | 1): void {
    const element = this.track().nativeElement;
    element.scrollBy({ left: direction * element.clientWidth * 0.85, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }

  update(): void {
    const element = this.track().nativeElement;
    this.canPrev.set(element.scrollLeft > 4);
    this.canNext.set(element.scrollLeft + element.clientWidth < element.scrollWidth - 4);
  }
}
