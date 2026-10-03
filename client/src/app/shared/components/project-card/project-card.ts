import { Component, computed, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';

import { Project } from '../../../core/models/portfolio.models';

@Component({
  selector: 'app-project-card',
  imports: [RouterLink, NgIcon],
  template: `
    <article class="card project" [style.--hue]="hue()">
      <div class="project__art">
        @if (project().thumbnail && !imageFailed()) {
          <img
            [src]="project().thumbnail"
            [alt]="project().title + ' preview'"
            loading="lazy"
            (error)="imageFailed.set(true)"
          />
        } @else {
          <span>{{ initials() }}</span>
        }
      </div>

      <h3>
        <a class="project__link" [routerLink]="['/projects', project().slug]">{{ project().title }}</a>
      </h3>
      <p class="muted">{{ project().description }}</p>

      <div class="tags">
        @for (tech of project().technologies.slice(0, 4); track tech) {
          <span class="chip">{{ tech }}</span>
        }
      </div>

      <div class="project__links">
        @if (project().repoUrl) {
          <a
            class="icon-btn"
            [href]="project().repoUrl"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Source code"
            title="Source code"
          >
            <ng-icon name="faBrandGithub" size="18" />
          </a>
        }
        @if (project().liveUrl) {
          <a
            class="icon-btn"
            [href]="project().liveUrl"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Live demo"
            title="Live demo"
          >
            <ng-icon name="faSolidArrowUpRightFromSquare" size="16" />
          </a>
        }
        <span class="project__more">
          View details <ng-icon name="faSolidArrowRight" size="14" />
        </span>
      </div>
    </article>
  `,
})
export class ProjectCard {
  readonly project = input.required<Project>();
  readonly index = input(0);

  protected readonly imageFailed = signal(false);

  protected readonly hue = computed(() => (this.index() * 47 + 215) % 360);

  protected readonly initials = computed(() =>
    this.project()
      .title.split(/[\s-]+/)
      .filter(Boolean)
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase(),
  );
}
