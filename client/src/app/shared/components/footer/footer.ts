import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';

import { PortfolioStore } from '../../../core/services/portfolio-store';
import { socialLinks } from '../../../core/utils/socials';
import { Feedback } from '../feedback/feedback';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, NgIcon, Feedback],
  template: `
    @if (store.profile(); as p) {
      <footer class="footer">
        <div class="container">
          <div class="footer__grid">
            <div>
              <h4>Contact</h4>
              <ul>
                <li><a [href]="'mailto:' + p.email">{{ p.email }}</a></li>
                <li><a [href]="tel(p.phone)">{{ p.phone }}</a></li>
                <li class="muted">{{ p.location }}</li>
              </ul>
            </div>

            <div>
              <h4>Quick links</h4>
              <ul>
                <li><a routerLink="/" fragment="projects">Featured projects</a></li>
                <li><a routerLink="/projects">All projects</a></li>
                <li><a routerLink="/services">Services</a></li>
                <li><a routerLink="/skills">Skills</a></li>
                <li><a routerLink="/contact">Contact</a></li>
                <li><a routerLink="/admin">Owner login</a></li>
              </ul>
            </div>

            <div>
              <h4>Follow</h4>
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
                    <ng-icon [name]="link.icon" size="18" />
                  </a>
                }
              </div>
            </div>
          </div>

          <app-feedback />

          <p class="footer__bottom">
            © {{ year }} {{ p.name }}. All rights reserved. Built with Angular, Express and MongoDB.
          </p>
        </div>
      </footer>
    }
  `,
})
export class Footer {
  protected readonly store = inject(PortfolioStore);
  protected readonly year = new Date().getFullYear();

  protected readonly links = computed(() => {
    const profile = this.store.profile();
    return profile ? socialLinks(profile.socials) : [];
  });

  protected tel(phone: string): string {
    return 'tel:' + phone.replace(/[^\d+]/g, '');
  }
}
