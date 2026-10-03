import {
  Component,
  effect,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';

import { Modal } from '../../directives/modal';

import { PortfolioApiService } from '../../../core/services/portfolio-api.service';

type Status = 'idle' | 'sending' | 'sent' | 'error';

@Component({
  selector: 'app-feedback',
  imports: [ReactiveFormsModule, NgIcon, Modal],
  host: { '(document:keydown.escape)': 'close()' },
  template: `
    <div class="feedback-cta card">
      <div>
        <h3>Enjoyed the site?</h3>
        <p class="muted">Leave a quick review or feedback. It helps me improve.</p>
      </div>
      <button type="button" class="btn btn--primary" (click)="show()">
        <ng-icon name="faSolidCommentDots" size="16" /> Leave a review
      </button>
    </div>

    @if (open()) {
      <div class="dialog" (click)="close()">
        <div
          class="dialog__panel card"
          appModal
          role="dialog"
          aria-modal="true"
          aria-labelledby="feedback-title"
          (click)="$event.stopPropagation()"
        >
          <h3 id="feedback-title">Leave a review</h3>

          @if (status() === 'sent') {
            <p class="status status--ok" role="status">{{ message() }}</p>
            <button type="button" class="btn" (click)="close()">Close</button>
          } @else {
            <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
              <div class="field">
                <span id="rating-label" class="field__label">Your rating</span>
                <div class="stars" role="radiogroup" aria-labelledby="rating-label">
                  @for (star of stars; track star) {
                    <button
                      type="button"
                      role="radio"
                      [class.is-on]="star <= rating()"
                      [attr.aria-checked]="rating() === star"
                      [attr.aria-label]="star + (star === 1 ? ' star' : ' stars')"
                      [attr.tabindex]="rating() === star || (rating() === 0 && star === 1) ? 0 : -1"
                      (keydown)="ratingKey($event, star)"
                      (click)="rating.set(star); ratingMissing.set(false)"
                    >
                      <ng-icon name="faSolidStar" size="26" />
                    </button>
                  }
                </div>
                @if (ratingMissing()) {
                  <span class="field__error">Please choose a rating.</span>
                }
              </div>

              <div class="field">
                <label for="fb-name">Name</label>
                <input
                  #firstField
                  id="fb-name"
                  type="text"
                  formControlName="name"
                  autocomplete="name"
                />
                @if (invalid('name')) {
                  <span class="field__error">Please enter your name (at least 2 characters).</span>
                }
              </div>

              <div class="field">
                <label for="fb-message">Your feedback</label>
                <textarea id="fb-message" formControlName="message"></textarea>
                @if (invalid('message')) {
                  <span class="field__error">Please write at least 10 characters.</span>
                }
              </div>

              <div class="hp" aria-hidden="true">
                <label for="fb-website">Website</label>
                <input id="fb-website" type="text" formControlName="website" tabindex="-1" autocomplete="off" />
              </div>

              <div class="actions" style="margin: 0">
                <button class="btn btn--primary" type="submit" [disabled]="status() === 'sending'">
                  <ng-icon name="faSolidPaperPlane" size="16" />
                  {{ status() === 'sending' ? 'Sending…' : 'Send review' }}
                </button>
                <button class="btn" type="button" (click)="close()">Cancel</button>
              </div>

              @if (status() === 'error') {
                <p class="status status--error" role="alert" style="margin-top: 20px">{{ message() }}</p>
              }
            </form>
          }
        </div>
      </div>
    }
  `,
})
export class Feedback {
  private readonly api = inject(PortfolioApiService);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly firstField = viewChild<ElementRef<HTMLInputElement>>('firstField');

  protected readonly open = signal(false);
  protected readonly status = signal<Status>('idle');
  protected readonly message = signal('');
  protected readonly rating = signal(0);
  protected readonly ratingMissing = signal(false);
  protected readonly stars = [1, 2, 3, 4, 5];

  protected readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
    website: [''],
  });

  constructor() {
    // Move the cursor into the first field when the popup opens.
    effect(() => {
      const field = this.firstField();
      if (field) {
        setTimeout(() => field.nativeElement.focus());
      }
    });


  }

  protected ratingKey(event: KeyboardEvent, star: number): void {
    const step = event.key === 'ArrowRight' || event.key === 'ArrowUp' ? 1 : event.key === 'ArrowLeft' || event.key === 'ArrowDown' ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = ((star - 1 + step + 5) % 5) + 1;
    this.rating.set(next);
    this.ratingMissing.set(false);
    (event.target as HTMLElement).parentElement?.querySelectorAll<HTMLButtonElement>('button')[next - 1]?.focus();
  }

  protected show(): void {
    if (this.status() === 'sending') return;
    this.status.set('idle');
    this.ratingMissing.set(false);
    this.open.set(true);
  }

  close(): void {
    this.open.set(false);
  }

  protected invalid(field: 'name' | 'message'): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || control.dirty);
  }

  protected submit(): void {
    if (this.status() === 'sending') return;
    this.ratingMissing.set(this.rating() === 0);

    if (this.form.invalid || this.rating() === 0) {
      this.form.markAllAsTouched();
      return;
    }

    this.status.set('sending');

    this.api.sendFeedback({ ...this.form.getRawValue(), rating: this.rating() }).subscribe({
      next: (response) => {
        this.status.set('sent');
        this.message.set(response.message);
        this.form.reset();
        this.rating.set(0);
      },
      error: (error: HttpErrorResponse) => {
        this.status.set('error');
        this.message.set(error.error?.message ?? 'Something went wrong. Please try again.');
      },
    });
  }
}
