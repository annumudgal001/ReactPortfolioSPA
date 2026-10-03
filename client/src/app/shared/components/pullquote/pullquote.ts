import { Component, input } from '@angular/core';

import { Quote } from '../../../core/models/portfolio.models';
import { Reveal } from '../../directives/reveal';

@Component({
  selector: 'app-pullquote',
  imports: [Reveal],
  template: `
    <div class="pullquote neu" appReveal>
      <h3 class="gradient-text">{{ quote().title }}</h3>
      <p>“{{ quote().text }}”</p>
    </div>
  `,
})
export class Pullquote {
  readonly quote = input.required<Quote>();
}
