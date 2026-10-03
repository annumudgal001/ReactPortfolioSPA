import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AdminApi, AdminProfile, AdminProject, Inbox, InboxItem } from './admin-api';
import { contentKeys, emptyRecord, fields, sections } from './editor-fields';
import { FieldEditor } from './field-editor';
import { Profile } from '../../core/models/portfolio.models';
import { PortfolioStore } from '../../core/services/portfolio-store';
@Component({
  selector: 'app-admin', imports: [FormsModule, RouterLink, FieldEditor],
  templateUrl: './admin.html', styleUrl: './admin.scss',
  host: { '(window:beforeunload)': 'beforeUnload($event)' },
})
export class AdminPage {
  readonly api = inject(AdminApi);
  private readonly publicStore = inject(PortfolioStore);
  readonly sections = sections;
  readonly fields = fields;
  readonly active = signal('profile');
  readonly busy = signal(false);
  readonly booting = signal(true);
  readonly dirty = signal(false);
  readonly message = signal('');
  readonly error = signal('');
  readonly errors = signal<string[]>([]);
  readonly profile = signal<AdminProfile | null>(null);
  readonly projects = signal<AdminProject[]>([]);
  readonly inbox = signal<Inbox>({ items: [], total: 0, page: 1 });
  readonly heading = computed(() => sections.find(x => x.key === this.active())?.label || 'Content');
  draft: Record<string, any> | null = null;
  projectDraft: Record<string, any> | null = null;
  editing?: AdminProject;
  email = '';
  password = '';
  constructor() {
    this.api.check().subscribe({ next: () => { this.booting.set(false); this.load(); }, error: () => this.booting.set(false) });
  }
  login(): void {
    if (this.busy()) return;
    this.busy.set(true); this.clearMessages();
    this.api.login(this.email, this.password).subscribe({
      next: () => { this.password = ''; this.busy.set(false); this.load(); },
      error: error => { this.password = ''; this.fail(error); },
    });
  }
  private clearMessages(): void { this.message.set(''); this.error.set(''); this.errors.set([]); }
  private fail(error: HttpErrorResponse): void {
    this.busy.set(false);
    this.error.set(error.error?.message || 'Could not complete the request. Try again.');
    this.errors.set((error.error?.errors || []).map((x: { field: string; message: string }) => `${x.field}: ${x.message}`));
    if (error.status === 401) this.api.session.set(null);
  }
  load(): void {
    if (this.dirty() && !confirm('Discard unsaved changes and reload?')) return;
    this.busy.set(true); this.clearMessages();
    forkJoin({ profile: this.api.profile(), projects: this.api.projects() }).subscribe({
      next: data => {
        this.profile.set(data.profile); this.projects.set(data.projects);
        this.draft = structuredClone(Object.fromEntries(contentKeys.map(key => [key, data.profile[key]])));
        this.projectDraft = null; this.editing = undefined; this.dirty.set(false); this.busy.set(false);
      }, error: error => this.fail(error),
    });
  }
  select(section: string): void {
    if (this.active() === section) return;
    if (this.dirty()) {
      if (!confirm('Discard unsaved changes?')) return;
      const profile = this.profile();
      if (profile) this.draft = structuredClone(Object.fromEntries(contentKeys.map(key => [key, profile[key]])));
      this.dirty.set(false);
    }
    this.active.set(section); this.projectDraft = null; this.editing = undefined; this.clearMessages();
    if (section === 'messages' || section === 'feedback') this.loadInbox(1);
  }
  records(): Record<string, any>[] { return this.draft?.[this.active()] || []; }
  add(): void { this.records().push(emptyRecord(this.active())); this.dirty.set(true); }
  remove(index: number): void {
    if (!confirm('Remove this entry? Save changes to apply the removal.')) return;
    this.records().splice(index, 1); this.dirty.set(true);
  }
  move(index: number, direction: number): void {
    const list = this.records(); const next = index + direction;
    if (next < 0 || next >= list.length) return;
    [list[index], list[next]] = [list[next], list[index]]; this.dirty.set(true);
  }
  addSkill(group: Record<string, any>): void { group['items'].push({ id: crypto.randomUUID(), name: '', description: '' }); this.dirty.set(true); }
  removeSkill(group: Record<string, any>, index: number): void { group['items'].splice(index, 1); this.dirty.set(true); }
  addPhrase(): void { this.draft!['jargon'].push(''); this.dirty.set(true); }
  save(): void {
    if (this.busy() || !this.draft || !this.profile()) return;
    this.busy.set(true); this.clearMessages();
    this.api.saveProfile(this.draft as Profile, this.profile()!.revision).subscribe({
      next: value => { this.profile.set(value); this.draft = structuredClone(Object.fromEntries(contentKeys.map(key => [key, value[key]]))); this.dirty.set(false); this.busy.set(false); this.message.set('Saved. Public content is updated.'); this.publicStore.refresh(); },
      error: error => this.fail(error),
    });
  }
  editProject(record?: AdminProject): void {
    if (this.dirty() && !confirm('Discard unsaved project changes?')) return;
    this.editing = record;
    this.projectDraft = record ? structuredClone(Object.fromEntries(fields['projects'].map(f => [f.key, record[f.key as keyof AdminProject]]))) : emptyRecord('projects');
    this.dirty.set(false); this.clearMessages();
  }
  saveProject(): void {
    if (this.busy() || !this.projectDraft) return;
    this.busy.set(true); this.clearMessages();
    this.api.saveProject(this.projectDraft as any, this.editing).subscribe({
      next: value => {
        this.projects.update(list => [...list.filter(x => x._id !== value._id), value].sort((a, b) => a.order - b.order));
        this.editing = value; this.dirty.set(false); this.busy.set(false); this.message.set('Project saved.'); this.publicStore.refresh();
      }, error: error => this.fail(error),
    });
  }
  deleteProject(record: AdminProject): void {
    if (this.dirty() && !confirm('Discard unsaved changes before deleting?')) return;
    if (this.busy() || !confirm(`Permanently delete "${record.title}"?`)) return;
    this.busy.set(true); this.clearMessages();
    this.api.deleteProject(record).subscribe({ next: () => { this.projects.update(list => list.filter(x => x._id !== record._id)); this.projectDraft = null; this.dirty.set(false); this.busy.set(false); this.publicStore.refresh(); this.message.set('Project deleted.'); }, error: error => this.fail(error) });
  }
  generateSlug(): void { if (this.projectDraft) { this.projectDraft = { ...this.projectDraft, slug: this.projectDraft['title'].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }; this.dirty.set(true); } }
  loadInbox(page: number): void {
    this.busy.set(true); this.clearMessages();
    this.api.inbox(this.active() as 'messages' | 'feedback', page).subscribe({ next: data => { this.inbox.set(data); this.busy.set(false); }, error: error => this.fail(error) });
  }
  flag(item: InboxItem): void {
    if (this.busy()) return;
    this.busy.set(true);
    this.api.flag(this.active() as 'messages' | 'feedback', item).subscribe({ next: () => this.loadInbox(this.inbox().page), error: error => this.fail(error) });
  }
  deleteInbox(item: InboxItem): void {
    if (this.busy() || !confirm('Permanently delete this submission?')) return;
    this.busy.set(true);
    this.api.deleteInbox(this.active() as 'messages' | 'feedback', item).subscribe({ next: () => this.loadInbox(1), error: error => this.fail(error) });
  }
  logout(): void {
    if (this.busy() || (this.dirty() && !confirm('Discard unsaved changes and sign out?'))) return;
    this.api.logout().subscribe({ next: () => { this.draft = null; this.projects.set([]); this.inbox.set({ items: [], total: 0, page: 1 }); this.dirty.set(false); }, error: error => this.fail(error) });
  }
  canLeave(): boolean { return !this.dirty() || confirm('Leave without saving changes?'); }
  beforeUnload(event: BeforeUnloadEvent): void { if (this.dirty()) { event.preventDefault(); event.returnValue = ''; } }
}
