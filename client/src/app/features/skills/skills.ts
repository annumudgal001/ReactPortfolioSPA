import { Component, inject } from '@angular/core';

import { PortfolioStore } from '../../core/services/portfolio-store';
import { SectionHeading } from '../../shared/components/section-heading/section-heading';
import { Reveal } from '../../shared/directives/reveal';

@Component({
  selector: 'app-skills-page',
  imports: [SectionHeading, Reveal],
  template: `
    @if (store.profile(); as p) {
      <app-section-heading
        eyebrow="Skills"
        title="Tech stack & core skills"
        subtitle="Technical skills plus the habits that make teams ship well: communication, problem-solving and collaboration."
      />

      <div class="skills">
        @for (group of p.skillGroups; track group.id || group.category; let g = $index) {
          <article class="card" appReveal [style.--i]="g % 2">
            <h3>{{ group.category }}</h3>

            <ul class="skill-list">
              @for (item of group.items; track item.id || item.name) {
                <li>
                  <strong>{{ item.name }}</strong>
                  @if (item.description) {
                    <span class="muted small">{{ item.description }}</span>
                  }
                </li>
              }
            </ul>
          </article>
        }
      </div>
    } @else if (store.profile() === null) {
      <p class="status status--error">Could not load skills. Is the backend running?</p>
    } @else {
      <p class="status">Loading…</p>
    }
  `,
})
export class SkillsPage {
  protected readonly store = inject(PortfolioStore);
}
