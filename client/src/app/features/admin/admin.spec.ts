import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AdminPage } from './admin';
import { AdminApi, AdminProfile } from './admin-api';
import { PortfolioStore } from '../../core/services/portfolio-store';
import { FieldEditor } from './field-editor';

const profile: AdminProfile = {
  name: 'Owner', headline: 'Developer', summary: 'Introduction', photoUrl: '/profile.jpg', seoDescription: '',
  jargon: [], location: '', email: '', phone: '', resumeUrl: '', revision: 1,
  socials: { github: '', linkedin: '', leetcode: '', twitter: '', instagram: '' },
  experience: [], education: [], skillGroups: [], services: [], certifications: [], testimonials: [], quotes: [],
};
afterEach(() => { TestBed.resetTestingModule(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });
describe('Admin content editing', () => {
  it('adds, saves and removes service content with a stable ID and refreshes public data', async () => {
    const refresh = vi.fn();
    const saveProfile = vi.fn((data, revision) => of({ ...structuredClone(data), revision: revision + 1 }));
    const api = { session: signal({ email: 'owner@example.test', csrfToken: 'test' }), check: () => of({}), profile: () => of(structuredClone(profile)), projects: () => of([]), saveProfile };
    await TestBed.configureTestingModule({ imports: [AdminPage], providers: [provideRouter([]), { provide: AdminApi, useValue: api }, { provide: PortfolioStore, useValue: { refresh } }] }).compileComponents();
    vi.stubGlobal('confirm', () => true);
    const fixture = TestBed.createComponent(AdminPage); fixture.detectChanges();
    const page = fixture.componentInstance;
    page.select('services'); page.add(); fixture.detectChanges();
    const service = page.records()[0]; service['title'] = 'API development'; service['description'] = 'Validated APIs';
    const id = service['id']; expect(id).toMatch(/^[a-f0-9-]{36}$/);
    page.save(); fixture.detectChanges();
    expect(saveProfile).toHaveBeenCalledWith(expect.objectContaining({ services: [expect.objectContaining({ id, title: 'API development' })] }), 1);
    expect(refresh).toHaveBeenCalledOnce(); expect(page.dirty()).toBe(false);
    page.remove(0); page.save(); fixture.detectChanges();
    expect(saveProfile).toHaveBeenLastCalledWith(expect.objectContaining({ services: [] }), 2);
    expect(page.records().length).toBe(0);
    page.projectDraft = { title: 'Modern Portfolio', slug: '' };
    const previousDraft = page.projectDraft;
    page.generateSlug();
    expect(page.projectDraft?.['slug']).toBe('modern-portfolio');
    expect(page.projectDraft).not.toBe(previousDraft);
  });
  it('preserves a trailing newline while editing multiline lists', async () => {
    await TestBed.configureTestingModule({ imports: [FieldEditor] }).compileComponents();
    const fixture = TestBed.createComponent(FieldEditor);
    const value = { tags: ['Angular'] };
    fixture.componentRef.setInput('fields', [{ key: 'tags', label: 'Tags', type: 'list' }]);
    fixture.componentRef.setInput('value', value); fixture.componentRef.setInput('prefix', 'test'); fixture.detectChanges();
    const textarea = fixture.nativeElement.querySelector('textarea');
    textarea.value = 'Angular\n'; textarea.dispatchEvent(new Event('input')); fixture.detectChanges();
    expect(value.tags).toEqual(['Angular', '']);
  });
});
