import { Component, input } from '@angular/core';

import { Reveal } from '../../directives/reveal';

@Component({
  selector: 'app-section-heading',
  imports: [Reveal],
  template: `
    <header class="section-head" appReveal>
      <p class="eyebrow">{{ eyebrow() }}</p>
      <h2>{{ title() }}</h2>
      @if (subtitle()) {
        <p class="muted">{{ subtitle() }}</p>
      }
    </header>
  `,
})
export class SectionHeading {
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  readonly subtitle = input('');
}
