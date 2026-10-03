import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';

import { Project } from '../../core/models/portfolio.models';
import { ProjectCard } from '../../shared/components/project-card/project-card';
import { SectionHeading } from '../../shared/components/section-heading/section-heading';
import { Slider } from '../../shared/components/slider/slider';
import { Reveal } from '../../shared/directives/reveal';

@Component({
  selector: 'app-featured-projects',
  imports: [RouterLink, NgIcon, SectionHeading, Slider, ProjectCard, Reveal],
  template: `
    <section class="section" id="projects">
      <app-section-heading
        eyebrow="Work"
        title="Featured projects"
        subtitle="Swipe or use the arrows. Click a project to read the full story."
      />

      @if (featured().length) {
        <app-slider appReveal>
          @for (project of featured(); track project._id; let i = $index) {
            <app-project-card [project]="project" [index]="i" />
          }

          <a slider-action class="btn btn--primary" routerLink="/projects">
            Show all projects <ng-icon name="faSolidArrowRight" size="16" />
          </a>
        </app-slider>
      } @else {
        <p class="status">No featured projects to display.</p>
        <a class="btn" routerLink="/projects">Show all projects</a>
      }
    </section>
  `,
})
export class FeaturedProjects {
  readonly projects = input.required<Project[]>();

  protected readonly featured = computed(() =>
    this.projects().filter((project) => project.featured),
  );
}
