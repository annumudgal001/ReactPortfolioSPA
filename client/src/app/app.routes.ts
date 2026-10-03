import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'admin', title: 'Portfolio studio', loadComponent: () => import('./features/admin/admin').then(m => m.AdminPage), canDeactivate: [(component: { canLeave(): boolean }) => component.canLeave()] },
  {
    path: '',
    pathMatch: 'full',
    title: 'Home',
    loadComponent: () => import('./features/home/home').then((m) => m.HomePage),
  },
  {
    path: 'projects',
    title: 'Projects',
    loadComponent: () => import('./features/projects/projects').then((m) => m.ProjectsPage),
  },
  {
    path: 'projects/:slug',
    loadComponent: () =>
      import('./features/projects/project-detail').then((m) => m.ProjectDetailPage),
  },
  {
    path: 'services',
    title: 'Services',
    loadComponent: () => import('./features/services/services').then((m) => m.ServicesPage),
  },
  {
    path: 'skills',
    title: 'Skills',
    loadComponent: () => import('./features/skills/skills').then((m) => m.SkillsPage),
  },
  {
    path: 'contact',
    title: 'Contact',
    loadComponent: () => import('./features/contact/contact').then((m) => m.ContactPage),
  },
  { path: '**', redirectTo: '' },
];
