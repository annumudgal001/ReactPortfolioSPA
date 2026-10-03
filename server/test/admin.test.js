import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import app from '../src/app.js';
import { hashPassword, verifyPassword } from '../src/auth/password.js';
import { Owner, AdminSession } from '../src/auth/auth.models.js';
import { Profile } from '../src/models/profile.model.js';
import { Project } from '../src/models/project.model.js';
import { profile } from '../src/scripts/seed-data.js';
import { profileSchema, projectSchema } from '../src/admin/validation.js';

const fields = ['name','headline','summary','jargon','location','email','phone','photoUrl','resumeUrl','seoDescription','socials','experience','education','skillGroups','services','certifications','testimonials','quotes'];
const publicProfile = () => {
  const value = new Profile({ ...profile, photoUrl: '/profile.jpg', seoDescription: profile.summary }).toObject();
  return Object.fromEntries(fields.map(x => [x, value[x]]));
};
test('owner authentication and protected revision-aware content/project writes', async () => {
  const passwordHash = await hashPassword('A long test-only password');
  assert.equal(await verifyPassword('A long test-only password', passwordHash), true);
  assert.equal(await verifyPassword('incorrect password', passwordHash), false);
  assert.equal(await verifyPassword('whatever', undefined), false);
  const owner = { _id: '123456789012345678901234', email: 'owner@example.test', passwordHash, role: 'owner' };
  let session;
  let current = { ...publicProfile(), _id: '223456789012345678901234', __v: 0 };
  let projects = [];
  const originals = [];
  const stub = (object, key, value) => { const original = object[key]; originals.push(() => { object[key] = original; }); object[key] = value; };
  const query = value => ({ lean: async () => value, select() { return this; }, sort() { return this; }, limit() { return this; } });
  stub(Owner, 'findOne', ({email}) => ({ select: async () => email === owner.email ? owner : null }));
  stub(Owner, 'findById', () => query(owner));
  stub(AdminSession, 'create', async value => { session = { ...value, _id: '323456789012345678901234' }; return session; });
  stub(AdminSession, 'findOne', filter => query(session?.tokenHash === filter.tokenHash && session.expiresAt > new Date() ? session : null));
  stub(AdminSession, 'deleteOne', async () => { session = null; });
  stub(Profile, 'findOne', () => query(current));
  stub(Profile, 'findOneAndUpdate', (filter, update) => {
    if (filter.__v !== current.__v) return query(null);
    current = { ...current, ...update.$set, __v: current.__v + 1 };
    return query(current);
  });
  stub(Project, 'find', filter => query(projects.filter(p => filter?.published?.$ne === false ? p.published !== false : true)));
  stub(Project, 'create', async data => {
    const item = { ...data, _id: '423456789012345678901234', __v: 0 }; projects.push(item);
    return { toObject: () => item };
  });
  stub(Project, 'findOneAndUpdate', (filter, update) => {
    const item = projects.find(p => p._id === filter._id && p.__v === filter.__v);
    if (!item) return query(null);
    Object.assign(item, update.$set, { __v: item.__v + 1 }); return query(item);
  });
  stub(Project, 'deleteOne', async filter => {
    const old = projects.length; projects = projects.filter(p => !(p._id === filter._id && p.__v === filter.__v));
    return { deletedCount: old - projects.length };
  });
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  let cookie = ''; let csrf = '';
  const request = (path, method = 'GET', body, extra = {}) => fetch(base + path, {
    method, headers: { 'content-type': 'application/json', origin: 'http://localhost:4200', cookie, 'x-csrf-token': csrf, ...extra }, ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  try {
    for (const path of ['/api/admin/profile', '/api/admin/projects', '/api/admin/messages', '/api/admin/feedback']) assert.equal((await request(path)).status, 401);
    assert.equal((await request('/api/admin/login','POST',{email:owner.email,password:'bad'})).status,401);
    assert.equal((await request('/api/admin/login','POST',{email:owner.email,password:'A long test-only password'},{origin:'https://evil.example'})).status,403);
    const login = await request('/api/admin/login','POST',{email:owner.email,password:'A long test-only password'});
    assert.equal(login.status,200); cookie=login.headers.get('set-cookie').split(';')[0]; csrf=(await login.json()).data.csrfToken;
    assert.match(login.headers.get('set-cookie'),/HttpOnly/); assert.match(login.headers.get('set-cookie'),/SameSite=Strict/);
    assert.equal((await request('/api/admin/session')).status,200);
    const data = publicProfile(); data.services.push({id:randomUUID(),title:'New service',description:'Description',icon:'faSolidCode',tags:[]});
    assert.equal((await request('/api/admin/profile','PUT',{revision:0,data},{'x-csrf-token':''})).status,403);
    assert.equal((await request('/api/admin/profile','PUT',{revision:0,data},{'x-csrf-token':'é'.repeat(64)})).status,403);
    assert.equal((await request('/api/admin/profile','PUT',{revision:0,data})).status,200);
    assert.equal(current.services.at(-1).title,'New service');
    assert.equal((await request('/api/admin/profile','PUT',{revision:0,data})).status,409);
    assert.equal((await request('/api/admin/profile','PUT',{revision:1,data:{...data,photoUrl:'javascript:alert(1)'}})).status,400);
    const project={title:'New project',slug:'new-project',description:'Description',details:'',highlights:[],technologies:[],thumbnail:'',repoUrl:'',liveUrl:'',featured:false,order:0,published:false};
    const created=await request('/api/admin/projects','POST',project); assert.equal(created.status,201); const record=(await created.json()).data;
    assert.equal((await (await request('/api/projects')).json()).data.length,0);
    assert.equal((await request(`/api/admin/projects/${record._id}`,'PUT',{revision:0,data:{...project,published:true}})).status,200);
    assert.equal((await (await request('/api/projects')).json()).data.length,1);
    assert.equal((await request(`/api/admin/projects/${record._id}`,'DELETE',{revision:0})).status,409);
    assert.equal((await request(`/api/admin/projects/${record._id}`,'DELETE',{revision:1})).status,200);
    assert.equal((await (await request('/api/projects')).json()).data.length,0);
    assert.equal((await request('/api/admin/logout','POST',{})).status,200);
    assert.equal((await request('/api/admin/profile')).status,401);
  } finally {
    for (const restore of originals.reverse()) restore();
    await new Promise(resolve => server.close(resolve));
  }
});
test('content rejects unsafe media, duplicate IDs, unexpected fields and invalid slugs', () => {
  const data=publicProfile();
  assert.equal(profileSchema.safeParse(data).success,true);
  assert.equal(profileSchema.safeParse({...data,services:[data.services[0],data.services[0]]}).success,false);
  assert.equal(profileSchema.safeParse({...data,unexpected:'secret'}).success,false);
  assert.equal(profileSchema.safeParse({...data,resumeUrl:'/../private.env'}).success,false);
  assert.equal(projectSchema.safeParse({title:'X',slug:'../x'}).success,false);
});
