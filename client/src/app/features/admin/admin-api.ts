import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, tap } from 'rxjs';
import { Profile, Project } from '../../core/models/portfolio.models';
export interface OwnerSession { email: string; csrfToken: string; }
export interface AdminProfile extends Profile { revision: number; }
export interface AdminProject extends Project { revision: number; published: boolean; }
export interface InboxItem { _id: string; name: string; email?: string; message: string; rating?: number; read?: boolean; approved?: boolean; createdAt: string; }
export interface Inbox { items: InboxItem[]; total: number; page: number; }
interface Response<T> { success: boolean; data: T; }
@Injectable({ providedIn: 'root' })
export class AdminApi {
  private readonly http = inject(HttpClient);
  readonly session = signal<OwnerSession | null>(null);
  private headers() { return new HttpHeaders({ 'x-csrf-token': this.session()?.csrfToken || '' }); }
  check() { return this.http.get<Response<OwnerSession>>('/api/admin/session').pipe(map(x => x.data), tap(x => this.session.set(x))); }
  login(email: string, password: string) { return this.http.post<Response<OwnerSession>>('/api/admin/login', { email, password }).pipe(map(x => x.data), tap(x => this.session.set(x))); }
  logout() { return this.http.post('/api/admin/logout', {}, { headers: this.headers() }).pipe(tap(() => this.session.set(null))); }
  profile() { return this.http.get<Response<AdminProfile>>('/api/admin/profile').pipe(map(x => x.data)); }
  projects() { return this.http.get<Response<AdminProject[]>>('/api/admin/projects').pipe(map(x => x.data)); }
  saveProfile(data: Profile, revision: number) {
    data = structuredClone(data);
    for (const item of data.services) item.tags = item.tags.map(x => x.trim()).filter(Boolean);
    for (const item of data.education) item.coursework = item.coursework.map(x => x.trim()).filter(Boolean);
    return this.http.put<Response<AdminProfile>>('/api/admin/profile', { data, revision }, { headers: this.headers() }).pipe(map(x => x.data)); }
  saveProject(data: Omit<Project, '_id'> & { published: boolean }, record?: AdminProject) {
    data = structuredClone(data);
    data.highlights = data.highlights.map(x => x.trim()).filter(Boolean);
    data.technologies = data.technologies.map(x => x.trim()).filter(Boolean);
    const options = { headers: this.headers() };
    return (record ? this.http.put<Response<AdminProject>>(`/api/admin/projects/${record._id}`, { data, revision: record.revision }, options) : this.http.post<Response<AdminProject>>('/api/admin/projects', data, options)).pipe(map(x => x.data));
  }
  deleteProject(record: AdminProject) { return this.http.delete(`/api/admin/projects/${record._id}`, { headers: this.headers(), body: { revision: record.revision } }); }
  inbox(kind: 'messages' | 'feedback', page: number) { return this.http.get<Response<Inbox>>(`/api/admin/${kind}`, { params: { page } }).pipe(map(x => x.data)); }
  flag(kind: 'messages' | 'feedback', record: InboxItem) { return this.http.patch(`/api/admin/${kind}/${record._id}`, kind === 'messages' ? { read: !record.read } : { approved: !record.approved }, { headers: this.headers() }); }
  deleteInbox(kind: 'messages' | 'feedback', record: InboxItem) { return this.http.delete(`/api/admin/${kind}/${record._id}`, { headers: this.headers() }); }
}
