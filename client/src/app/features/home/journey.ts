import { Component, input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

import { Education, Experience } from '../../core/models/portfolio.models';
import { Logo } from '../../shared/components/logo/logo';
import { SectionHeading } from '../../shared/components/section-heading/section-heading';
import { Reveal } from '../../shared/directives/reveal';

@Component({
  selector: 'app-journey',
  imports: [NgIcon, Logo, SectionHeading, Reveal],
  template: `
    <section class="section" [class.two-col]="experience().length && education().length" id="journey">
      @if (experience().length) {
      <div>
        <app-section-heading eyebrow="Experience" title="Where I've worked" />

        <div class="timeline">
          @for (item of experience(); track item.id || item.company; let i = $index) {
            <article class="timeline__item" appReveal [style.--i]="i">
              <span class="timeline__dot"><ng-icon name="faSolidBriefcase" size="13" /></span>
              <div class="card">
                <div class="entry__head">
                  <app-logo [src]="item.logo" [name]="item.company" />
                  <div>
                    <p class="meta">{{ item.period }}</p>
                    <h3>{{ item.role }}</h3>
                    <p class="company">
                      {{ item.company }}
                      @if (item.location) {
                        <span class="muted"> · {{ item.location }}</span>
                      }
                    </p>
                  </div>
                </div>

                <div class="tags">
                  @if (item.current) {
                    <span class="chip chip--status"><span class="pulse"></span> Current</span>
                  }
                  @if (item.type) {
                    <span class="chip">{{ item.type }}</span>
                  }
                  @if (item.industry) {
                    <span class="chip">{{ item.industry }}</span>
                  }
                </div>

                <p class="muted">{{ item.summary }}</p>
              </div>
            </article>
          }
        </div>
      </div>

      }
      @if (education().length) {
      <div>
        <app-section-heading eyebrow="Education" title="Where I've studied" />

        <div class="timeline">
          @for (item of education(); track item.id || item.degree; let i = $index) {
            <article class="timeline__item" appReveal [style.--i]="i">
              <span class="timeline__dot"><ng-icon name="faSolidGraduationCap" size="13" /></span>
              <div class="card">
                <div class="entry__head">
                  <app-logo [src]="item.logo" [name]="item.institution" />
                  <div>
                    <p class="meta">{{ item.period }}</p>
                    <h3>{{ item.degree }}</h3>
                    <p class="company">
                      {{ item.institution }}<span class="muted"> · {{ item.score }}</span>
                    </p>
                  </div>
                </div>

                <div class="tags">
                  @for (course of item.coursework; track course) {
                    <span class="chip">{{ course }}</span>
                  }
                </div>

                <p class="muted">{{ item.summary }}</p>
              </div>
            </article>
          }
        </div>
      </div>
      }
    </section>
  `,
})
export class Journey {
  readonly experience = input.required<Experience[]>();
  readonly education = input.required<Education[]>();
}
