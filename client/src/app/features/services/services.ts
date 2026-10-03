import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';

import { PortfolioStore } from '../../core/services/portfolio-store';
import { SectionHeading } from '../../shared/components/section-heading/section-heading';
import { Reveal } from '../../shared/directives/reveal';

@Component({
  selector: 'app-services-page',
  imports: [RouterLink, NgIcon, SectionHeading, Reveal],
  template: `
    @if (store.profile(); as p) {
      <app-section-heading
        eyebrow="Services"
        title="What I can do for you"
        subtitle="From first sketch to deployed product: design, build, test and ship."
      />

      <div class="grid grid--3">
        @for (service of p.services; track service.id || service.title; let i = $index) {
          <article class="card service" appReveal [style.--i]="i % 3">
            <span class="service__icon">
              @if (service.icon) {
                <ng-icon [name]="service.icon" />
              }
            </span>
            <h3>{{ service.title }}</h3>
            <p class="muted">{{ service.description }}</p>
            <div class="tags">
              @for (tag of service.tags; track tag) {
                <span class="chip">{{ tag }}</span>
              }
            </div>
          </article>
        }
      </div>

      <div class="pullquote neu" appReveal>
        <h3 class="gradient-text">Have a project in mind?</h3>
        <p>Let's talk about what you want to build.</p>
        <p class="center">
          <a class="btn btn--primary" routerLink="/contact">
            <ng-icon name="faSolidPaperPlane" size="16" /> Start a conversation
          </a>
        </p>
      </div>
    } @else if (store.profile() === null) {
      <p class="status status--error">Could not load services. Is the backend running?</p>
    } @else {
      <p class="status">Loading…</p>
    }
  `,
})
export class ServicesPage {
  protected readonly store = inject(PortfolioStore);
}
