import { Component, inject } from '@angular/core';

import { PortfolioStore } from '../../core/services/portfolio-store';
import { ProjectCard } from '../../shared/components/project-card/project-card';
import { SectionHeading } from '../../shared/components/section-heading/section-heading';
import { Reveal } from '../../shared/directives/reveal';

@Component({
  selector: 'app-projects-page',
  imports: [SectionHeading, ProjectCard, Reveal],
  template: `
    <app-section-heading
      eyebrow="Projects"
      title="Everything I've built"
      subtitle="Click any project to see what it does and how it was built."
    />

    @if (store.projects(); as list) {
      <div class="grid grid--3">
        @for (project of list; track project._id; let i = $index) {
          <app-project-card appReveal [project]="project" [index]="i" [style.--i]="i % 3" />
        } @empty {
          <p class="status">No projects yet. Run the seed command.</p>
        }
      </div>
    } @else if (store.projects() === null) {
      <p class="status status--error">Could not load projects. Is the backend running?</p>
    } @else {
      <p class="status">Loading…</p>
    }
  `,
})
export class ProjectsPage {
  protected readonly store = inject(PortfolioStore);
}
