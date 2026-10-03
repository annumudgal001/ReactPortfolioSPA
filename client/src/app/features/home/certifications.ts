import { NgTemplateOutlet } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

import { Certification } from '../../core/models/portfolio.models';
import { Lightbox } from '../../shared/components/lightbox/lightbox';
import { SectionHeading } from '../../shared/components/section-heading/section-heading';
import { Slider } from '../../shared/components/slider/slider';
import { Reveal } from '../../shared/directives/reveal';

@Component({
  selector: 'app-certifications',
  imports: [NgTemplateOutlet, NgIcon, SectionHeading, Slider, Lightbox, Reveal],
  template: `
    <section class="section" id="certifications">
      <app-section-heading
        eyebrow="Certifications"
        title="Always learning"
        subtitle="Click a certificate to view it full size."
      />

      @if (!expanded()) {
        <app-slider appReveal>
          @for (cert of certifications(); track cert.id || cert.title) {
            <ng-container [ngTemplateOutlet]="card" [ngTemplateOutletContext]="{ $implicit: cert }" />
          }

          <button slider-action type="button" class="btn btn--primary" (click)="expanded.set(true)">
            Show all certificates <ng-icon name="faSolidArrowRight" size="16" />
          </button>
        </app-slider>
      } @else {
        <div class="grid grid--3" appReveal>
          @for (cert of certifications(); track cert.id || cert.title) {
            <ng-container [ngTemplateOutlet]="card" [ngTemplateOutletContext]="{ $implicit: cert }" />
          }
        </div>

        <div class="center">
          <button type="button" class="btn" (click)="expanded.set(false)">Show less</button>
        </div>
      }
    </section>

    <ng-template #card let-cert>
      <button
        type="button"
        class="card cert-card"
        [attr.aria-label]="'View certificate: ' + cert.title"
        (click)="open(cert)"
      >
        <span class="cert-card__image">
          <ng-icon name="faSolidAward" size="38" />
          @if (cert.image) {
            <img [src]="cert.image" [alt]="cert.title + ' certificate'" loading="lazy" (error)="hideImage($event)" />
          }
        </span>
        <span class="cert-card__body">
          <strong>{{ cert.title }}</strong>
          <span class="muted small">{{ cert.issuer }}</span>
        </span>
      </button>
    </ng-template>

    @if (selected(); as cert) {
      <app-lightbox
        [src]="cert.image"
        [caption]="cert.title + ' · ' + cert.issuer"
        (closed)="selected.set(null)"
      />
    }
  `,
})
export class Certifications {
  readonly certifications = input.required<Certification[]>();

  protected readonly expanded = signal(false);
  protected readonly selected = signal<Certification | null>(null);

  protected open(cert: Certification): void {
    if (cert.image) {
      this.selected.set(cert);
    }
  }

  protected hideImage(event: Event): void {
    (event.target as HTMLImageElement).hidden = true;
  }
}
