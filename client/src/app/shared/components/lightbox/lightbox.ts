import { afterNextRender, Component, ElementRef, input, output, viewChild } from '@angular/core';
import { Modal } from '../../directives/modal';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-lightbox',
  imports: [NgIcon, Modal],
  host: { '(document:keydown.escape)': 'closed.emit()' },
  template: `
    <div appModal class="lightbox" role="dialog" aria-modal="true" [attr.aria-label]="caption()" (click)="closed.emit()">
      <figure class="lightbox__figure" (click)="$event.stopPropagation()">
        <img [src]="src()" [alt]="caption()" />
        <figcaption>{{ caption() }}</figcaption>
      </figure>

      <button
        #closeButton
        type="button"
        class="icon-btn lightbox__close"
        aria-label="Close"
        (click)="closed.emit()"
      >
        <ng-icon name="faSolidXmark" size="18" />
      </button>
    </div>
  `,
})
export class Lightbox {
  readonly src = input.required<string>();
  readonly caption = input('');
  readonly closed = output<void>();

  private readonly closeButton = viewChild.required<ElementRef<HTMLButtonElement>>('closeButton');

  constructor() {
    afterNextRender(() => this.closeButton().nativeElement.focus());
  }
}
