import { Component, input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

import { Testimonial } from '../../core/models/portfolio.models';
import { SectionHeading } from '../../shared/components/section-heading/section-heading';
import { Reveal } from '../../shared/directives/reveal';

@Component({
  selector: 'app-testimonials',
  imports: [NgIcon, SectionHeading, Reveal],
  template: `
    <section class="section" id="testimonials">
      <app-section-heading eyebrow="Testimonials" title="Kind words" />

      <div class="grid grid--3">
        @for (item of testimonials(); track item.id || item.author; let i = $index) {
          <article class="card testimonial" appReveal [style.--i]="i">
            <ng-icon name="faSolidQuoteLeft" size="22" />
            <blockquote class="muted">{{ item.quote }}</blockquote>
            <footer>
              <span class="avatar-sm">{{ initials(item.author) }}</span>
              <div>
                <strong>{{ item.author }}</strong>
                <span class="muted small">{{ item.role }}</span>
              </div>
            </footer>
          </article>
        }
      </div>
    </section>
  `,
})
export class Testimonials {
  readonly testimonials = input.required<Testimonial[]>();

  protected initials(name: string): string {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }
}
