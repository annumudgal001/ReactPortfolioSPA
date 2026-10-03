import { AfterViewInit, DestroyRef, Directive, ElementRef, inject } from '@angular/core';

let openModals = 0;
let originalOverflow = '';

/** Keeps keyboard focus inside an open modal and returns it to its trigger. */
@Directive({ selector: '[appModal]', host: { '(keydown)': 'onKey($event)' } })
export class Modal implements AfterViewInit {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly trigger = document.activeElement as HTMLElement | null;

  constructor() {
    if (openModals++ === 0) {
      originalOverflow = document.documentElement.style.overflow;
      document.documentElement.style.overflow = 'hidden';
    }
    inject(DestroyRef).onDestroy(() => {
      if (--openModals === 0) document.documentElement.style.overflow = originalOverflow;
      if (this.trigger?.isConnected) this.trigger.focus();
    });
  }

  ngAfterViewInit(): void {
    queueMicrotask(() => {
      if (this.element.isConnected) this.controls()[0]?.focus();
    });
  }

  private controls(): HTMLElement[] {
    return Array.from(this.element.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), [tabindex="0"]',
    )).filter((node) => node.tabIndex >= 0 && node.getClientRects().length > 0);
  }

  onKey(event: KeyboardEvent): void {
    if (event.key !== 'Tab') return;
    const controls = this.controls();
    const first = controls[0];
    const last = controls.at(-1);
    if (!first) { event.preventDefault(); return; }
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  }
}
