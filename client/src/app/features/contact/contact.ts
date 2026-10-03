import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';

import { PortfolioApiService } from '../../core/services/portfolio-api.service';
import { PortfolioStore } from '../../core/services/portfolio-store';
import { socialLinks } from '../../core/utils/socials';
import { SectionHeading } from '../../shared/components/section-heading/section-heading';
import { Reveal } from '../../shared/directives/reveal';

type Status = 'idle' | 'sending' | 'sent' | 'error';
type FieldName = 'name' | 'email' | 'message';

@Component({
  selector: 'app-contact-page',
  imports: [ReactiveFormsModule, NgIcon, SectionHeading, Reveal],
  template: `
    @if (store.profile(); as p) {
      <app-section-heading
        eyebrow="Contact"
        title="Let's build something"
        subtitle="Questions, collaborations or opportunities, my inbox is open."
      />

      <div class="contact-grid">
        <aside class="card" appReveal>
          <div class="info-list">
            @if (p.location) {
              <div class="info">
                <span class="cert__icon"><ng-icon name="faSolidLocationDot" /></span>
                <div><strong>Address</strong><span>{{ p.location }}</span></div>
              </div>
            }
            @if (p.phone) {
              <div class="info">
                <span class="cert__icon"><ng-icon name="faSolidPhone" /></span>
                <div><strong>Call me</strong><a [href]="tel(p.phone)">{{ p.phone }}</a></div>
              </div>
            }
            @if (p.email) {
              <div class="info">
                <span class="cert__icon"><ng-icon name="faSolidEnvelope" /></span>
                <div><strong>Email me</strong><a [href]="'mailto:' + p.email">{{ p.email }}</a></div>
              </div>
            }
          </div>

          <div class="socials" style="margin-top: 28px">
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
        </aside>

        <form
          class="card"
          appReveal
          [style.--i]="1"
          [formGroup]="form"
          (ngSubmit)="submit()"
          novalidate
        >
          <div class="field">
            <label for="name">Name</label>
            <input id="name" type="text" formControlName="name" autocomplete="name" />
            @if (invalid('name')) {
              <span class="field__error">Please enter your name (at least 2 characters).</span>
            }
          </div>

          <div class="field">
            <label for="email">Email</label>
            <input id="email" type="email" formControlName="email" autocomplete="email" />
            @if (invalid('email')) {
              <span class="field__error">Please enter a valid email address.</span>
            }
          </div>

          <div class="field">
            <label for="message">Message</label>
            <textarea id="message" formControlName="message"></textarea>
            @if (invalid('message')) {
              <span class="field__error">Please write at least 10 characters.</span>
            }
          </div>

          <!-- Honeypot: hidden from people, tempting for bots -->
          <div class="hp" aria-hidden="true">
            <label for="website">Website</label>
            <input
              id="website"
              type="text"
              formControlName="website"
              tabindex="-1"
              autocomplete="off"
            />
          </div>

          <button class="btn btn--primary" type="submit" [disabled]="status() === 'sending'">
            <ng-icon name="faSolidPaperPlane" size="16" />
            {{ status() === 'sending' ? 'Sending…' : 'Send message' }}
          </button>

          @if (status() === 'sent') {
            <p class="status status--ok" role="status" style="margin-top: 20px">{{ feedback() }}</p>
          }
          @if (status() === 'error') {
            <p class="status status--error" role="alert" style="margin-top: 20px">
              {{ feedback() }}
            </p>
          }
        </form>
      </div>
    } @else if (store.profile() === null) {
      <p class="status status--error">Could not load contact details. Is the backend running?</p>
    } @else {
      <p class="status">Loading…</p>
    }
  `,
})
export class ContactPage {
  protected readonly store = inject(PortfolioStore);
  private readonly api = inject(PortfolioApiService);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(120)]],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
    website: [''],
  });

  protected readonly status = signal<Status>('idle');
  protected readonly feedback = signal('');

  protected readonly links = computed(() => {
    const profile = this.store.profile();
    return profile ? socialLinks(profile.socials) : [];
  });

  protected invalid(field: FieldName): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || control.dirty);
  }

  protected tel(phone: string): string {
    return 'tel:' + phone.replace(/[^\d+]/g, '');
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.status.set('sending');

    this.api.sendMessage(this.form.getRawValue()).subscribe({
      next: (response) => {
        this.status.set('sent');
        this.feedback.set(response.message);
        this.form.reset();
      },
      error: (error: HttpErrorResponse) => {
        this.status.set('error');
        this.feedback.set(error.error?.message ?? 'Something went wrong. Please try again.');
      },
    });
  }
}
