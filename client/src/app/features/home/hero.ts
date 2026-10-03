import { Component, computed, DestroyRef, effect, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';

import { Profile, Project } from '../../core/models/portfolio.models';
import { socialLinks } from '../../core/utils/socials';
import { Terminal } from '../../shared/components/terminal/terminal';

@Component({
  selector: 'app-hero',
  imports: [RouterLink, NgIcon, Terminal],
  template: `
    <section class="hero">
      <div class="hero__copy">
        <div class="hero__top">
          <div class="avatar">
            @if (profile().photoUrl && !avatarFailed()) {
              <img
                [src]="profile().photoUrl"
                [alt]="profile().name"
                width="88"
                height="88"
                (error)="avatarFailed.set(true)"
              />
            } @else {
              <span>{{ initials() }}</span>
            }
          </div>

          @if (current(); as job) {
            <span class="chip chip--status">
              <span class="pulse"></span> {{ job.role }} &#64; {{ job.company }}
            </span>
          }
        </div>

        <p class="eyebrow">Hello, I'm</p>
        <h1 class="gradient-text">{{ profile().name }}</h1>
        <p class="hero__role">{{ profile().headline }}</p>

        @if (profile().jargon.length) {
          <div class="ticker" aria-hidden="true">
            <span class="ticker__prompt">$</span>
            <span><span class="ticker__text">{{ typed() }}</span><span class="caret"></span></span>
          </div>
        }

        <p class="muted">{{ profile().summary }}</p>

        <div class="actions">
          @if (profile().resumeUrl) {
          <a class="btn btn--primary" [href]="profile().resumeUrl" target="_blank" rel="noopener">
            <ng-icon name="faSolidDownload" size="16" /> View Resume
          </a>
          }
          <a class="btn" routerLink="/contact">
            <ng-icon name="faSolidPaperPlane" size="16" /> Get in touch
          </a>
        </div>

        <div class="socials">
          @for (link of links(); track link.label) {
            <a
              class="icon-btn"
              [href]="link.url"
              target="_blank"
              rel="noopener noreferrer"
              [attr.aria-label]="link.label"
              [title]="link.label"
            >
              <ng-icon [name]="link.icon" size="20" />
            </a>
          }
        </div>
      </div>

      <div class="hero__visual">
        <span class="hero__glow" aria-hidden="true"></span>
        <app-terminal [profile]="profile()" [projects]="projects()" />
        <div class="hero__floaters" aria-hidden="true">
          @for (item of floaters; track item) {
            <span>{{ item }}</span>
          }
        </div>
      </div>
    </section>
  `,
})
export class Hero {
  readonly profile = input.required<Profile>();
  readonly projects = input<Project[]>([]);

  protected readonly typed = signal('');
  protected readonly avatarFailed = signal(false);
  protected readonly floaters = ['</>', '{ }', '200 OK', 'git push', 'async/await', 'npm run dev'];

  protected readonly links = computed(() => socialLinks(this.profile().socials));

  protected readonly current = computed(
    () => this.profile().experience.find((item) => item.current) ?? null,
  );

  protected readonly initials = computed(() =>
    this.profile()
      .name.split(' ')
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase(),
  );

  constructor() {
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const reduced = signal(motion.matches);
    const updateMotion = () => reduced.set(motion.matches);
    motion.addEventListener('change', updateMotion);
    inject(DestroyRef).onDestroy(() => motion.removeEventListener('change', updateMotion));

    effect((onCleanup) => {
      const phrases = this.profile().jargon.map((phrase) => phrase.trim()).filter(Boolean);
      const reduceMotion = reduced();
      let index = 0;
      let chars = 0;
      let deleting = false;
      let timer: ReturnType<typeof setTimeout> | undefined;
      this.typed.set(phrases[0] || '');
      onCleanup(() => clearTimeout(timer));
      if (phrases.length < 2) return;

      const tick = () => {
        if (reduceMotion) {
          index = (index + 1) % phrases.length;
          this.typed.set(phrases[index]);
          timer = setTimeout(tick, 4000);
          return;
        }
        const phrase = phrases[index % phrases.length];
        chars += deleting ? -1 : 1;
        this.typed.set(phrase.slice(0, chars));
        let delay = deleting ? 18 : 38;
        if (!deleting && chars === phrase.length) {
          deleting = true;
          delay = 1700;
        } else if (deleting && chars === 0) {
          deleting = false;
          index++;
          delay = 300;
        }
        timer = setTimeout(tick, delay);
      };
      if (reduceMotion) timer = setTimeout(tick, 4000);
      else {
        this.typed.set('');
        timer = setTimeout(tick, 500);
      }
    });
  }
}
