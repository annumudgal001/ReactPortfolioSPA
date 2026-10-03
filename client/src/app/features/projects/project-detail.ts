import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';

import { PortfolioStore } from '../../core/services/portfolio-store';

@Component({
  selector: 'app-project-detail-page',
  imports: [RouterLink, NgIcon],
  template: `
    @if (project(); as p) {
      <a class="back" routerLink="/projects">
        <ng-icon name="faSolidArrowLeft" size="14" /> All projects
      </a>

      <article class="detail">
        <header>
          <p class="eyebrow">{{ p.featured ? 'Featured project' : 'Project' }}</p>
          <h1 class="detail__title gradient-text">{{ p.title }}</h1>
          <p class="muted detail__lead">{{ p.description }}</p>

          <div class="tags">
            @for (tech of p.technologies; track tech) {
              <span class="chip">{{ tech }}</span>
            }
          </div>

          <div class="actions">
            @if (p.liveUrl) {
              <a class="btn btn--primary" [href]="p.liveUrl" target="_blank" rel="noopener noreferrer">
                <ng-icon name="faSolidArrowUpRightFromSquare" size="15" /> Live demo
              </a>
            }
            @if (p.repoUrl) {
              <a class="btn" [href]="p.repoUrl" target="_blank" rel="noopener noreferrer">
                <ng-icon name="faBrandGithub" size="17" /> Source code
              </a>
            }
          </div>
        </header>

        <div class="detail__art neu" [style.--hue]="hue()">
          @if (p.thumbnail && failedSlug() !== p.slug) {
            <img [src]="p.thumbnail" [alt]="p.title + ' preview'" (error)="failedSlug.set(p.slug)" />
          } @else {
            <span>{{ initials() }}</span>
          }
        </div>

        @if (p.details) {
          <section class="card">
            <h2 class="detail__heading">About this project</h2>
            <p class="muted">{{ p.details }}</p>
          </section>
        }

        @if (p.highlights.length) {
          <section class="card">
            <h2 class="detail__heading">Highlights</h2>
            <ul class="check-list">
              @for (item of p.highlights; track item) {
                <li>{{ item }}</li>
              }
            </ul>
          </section>
        }

        <nav class="pager" aria-label="More projects">
          @if (neighbours().prev; as prev) {
            <a class="btn" [routerLink]="['/projects', prev.slug]">
              <ng-icon name="faSolidArrowLeft" size="14" /> {{ prev.title }}
            </a>
          } @else {
            <span></span>
          }

          @if (neighbours().next; as next) {
            <a class="btn" [routerLink]="['/projects', next.slug]">
              {{ next.title }} <ng-icon name="faSolidArrowRight" size="14" />
            </a>
          }
        </nav>
      </article>
    } @else if (store.projects() === undefined) {
      <p class="status">Loading…</p>
    } @else if (store.projects() === null) {
      <p class="status status--error">Could not load this project. Is the backend running?</p>
    } @else {
      <a class="back" routerLink="/projects">
        <ng-icon name="faSolidArrowLeft" size="14" /> All projects
      </a>
      <p class="status">That project could not be found.</p>
    }
  `,
})
export class ProjectDetailPage {
  // Filled automatically from the :slug part of the URL.
  readonly slug = input.required<string>();

  protected readonly store = inject(PortfolioStore);
  private readonly title = inject(Title);

  protected readonly failedSlug = signal('');

  protected readonly project = computed(
    () => this.store.projects()?.find((item) => item.slug === this.slug()) ?? null,
  );

  protected readonly neighbours = computed(() => {
    const list = this.store.projects() ?? [];
    const index = list.findIndex((item) => item.slug === this.slug());

    return {
      prev: index > 0 ? list[index - 1] : null,
      next: index >= 0 && index < list.length - 1 ? list[index + 1] : null,
    };
  });

  protected readonly hue = computed(() => {
    const index = (this.store.projects() ?? []).findIndex((item) => item.slug === this.slug());
    return (Math.max(index, 0) * 47 + 215) % 360;
  });

  protected readonly initials = computed(() =>
    (this.project()?.title ?? '')
      .split(/[\s-]+/)
      .filter(Boolean)
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase(),
  );

  constructor() {
    effect(() => {
      const project = this.project();

      if (project) {
        this.title.setTitle(`${project.title} | ${this.store.profile()?.name || 'Portfolio'}`);
      }
    });
  }
}
