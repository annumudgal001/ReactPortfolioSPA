import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { afterEach, expect, it, vi } from 'vitest';
import { Hero } from './hero';
import { Profile } from '../../core/models/portfolio.models';

afterEach(() => { TestBed.resetTestingModule(); vi.useRealTimers(); vi.unstubAllGlobals(); });
it('rotates complete phrases with reduced motion and restarts after edits', async () => {
  vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
  await TestBed.configureTestingModule({ imports: [Hero], providers: [provideRouter([])] }).compileComponents();
  vi.useFakeTimers();
  const fixture = TestBed.createComponent(Hero);
  const profile = { name: 'Owner', headline: '', summary: '', photoUrl: '', resumeUrl: '', socials: {}, experience: [], jargon: ['First', ' ', 'Second'] } as unknown as Profile;
  fixture.componentRef.setInput('profile', profile); fixture.detectChanges();
  const text = () => fixture.nativeElement.querySelector('.ticker__text').textContent;
  expect(text()).toBe('First');
  vi.advanceTimersByTime(4000); fixture.detectChanges(); expect(text()).toBe('Second');
  vi.advanceTimersByTime(4000); fixture.detectChanges(); expect(text()).toBe('First');
  fixture.componentRef.setInput('profile', { ...profile, jargon: ['Edited', 'Next'] }); fixture.detectChanges();
  expect(text()).toBe('Edited');
  vi.advanceTimersByTime(4000); fixture.detectChanges(); expect(text()).toBe('Next');
  fixture.destroy(); expect(vi.getTimerCount()).toBe(0);
});
