import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { Title } from '@angular/platform-browser';
import { describe, it, expect } from 'vitest';
import { ProjectDetailPage } from './project-detail';
import { PortfolioStore } from '../../core/services/portfolio-store';
import { Project } from '../../core/models/portfolio.models';
import { APP_ICONS } from '../../core/icons';

const project = (slug: string): Project => ({
  _id: slug, slug, title: slug, description: 'Project description', details: 'Case study',
  highlights: ['Working feature'], technologies: ['Angular'], thumbnail: '', repoUrl: '',
  liveUrl: '', featured: false, order: 0,
});

describe('Project detail route changes', () => {
  it('updates content, title and neighbours when Angular reuses the page for a new slug', async () => {
    const projects = signal<Project[] | null | undefined>(undefined);
    await TestBed.configureTestingModule({
      imports: [ProjectDetailPage],
      providers: [provideRouter([]), provideIcons(APP_ICONS),
        { provide: PortfolioStore, useValue: { projects, profile: signal(null) } }],
    }).compileComponents();
    const fixture = TestBed.createComponent(ProjectDetailPage);
    fixture.componentRef.setInput('slug', 'first');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Loading');
    projects.set([project('first'), project('second')]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h1').textContent).toBe('first');
    expect(TestBed.inject(Title).getTitle()).toContain('first');
    fixture.componentRef.setInput('slug', 'second');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h1').textContent).toBe('second');
    expect(fixture.nativeElement.querySelector('.pager').textContent).toContain('first');
    expect(TestBed.inject(Title).getTitle()).toContain('second');
    fixture.componentRef.setInput('slug', 'missing');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('could not be found');
    projects.set(null);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Could not load');
  });
});
