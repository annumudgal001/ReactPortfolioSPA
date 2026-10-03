import { Component, computed, inject } from '@angular/core';

import { PortfolioStore } from '../../core/services/portfolio-store';
import { Pullquote } from '../../shared/components/pullquote/pullquote';
import { Certifications } from './certifications';
import { FeaturedProjects } from './featured-projects';
import { Hero } from './hero';
import { Journey } from './journey';
import { Testimonials } from './testimonials';

@Component({
  selector: 'app-home',
  imports: [Hero, Journey, FeaturedProjects, Certifications, Testimonials, Pullquote],
  template: `
    @if (store.profile(); as p) {
      <app-hero [profile]="p" [projects]="projectList()" />
      @if (p.experience.length || p.education.length) { <app-journey [experience]="p.experience" [education]="p.education" /> }
      <app-featured-projects [projects]="projectList()" />

      @if (p.quotes.at(0); as quote) {
        <app-pullquote [quote]="quote" />
      }

      @if (p.certifications.length) { <app-certifications [certifications]="p.certifications" /> }
      @if (p.testimonials.length) { <app-testimonials [testimonials]="p.testimonials" /> }

      @for (quote of p.quotes.slice(1); track quote.id || quote.title) {
        <app-pullquote [quote]="quote" />
      }
    } @else if (store.profile() === null) {
      <p class="status status--error">
        Could not load the portfolio. Is the backend running and seeded?
      </p>
    } @else {
      <p class="status">Loading…</p>
    }
  `,
})
export class HomePage {
  protected readonly store = inject(PortfolioStore);
  protected readonly projectList = computed(() => this.store.projects() ?? []);
}
