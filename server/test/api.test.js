import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';
import { Feedback } from '../src/models/feedback.model.js';
import { Project } from '../src/models/project.model.js';
import { Profile } from '../src/models/profile.model.js';
import { profile, projects } from '../src/scripts/seed-data.js';

// Exercise real HTTP routing and validation; persistence is replaced per test.
test('feedback validation, moderation, persistence failures and independent limits', async () => {
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const original = Feedback.create;
  const writes = [];
  Feedback.create = async data => { writes.push(data); return new Feedback(data); };
  const send = (body, path = '/api/feedback') => fetch(base + path, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body),
  });
  try {
    const invalid = await send({ name: 'x', rating: 6, message: 'short' });
    assert.equal(invalid.status, 400);
    assert.equal((await invalid.json()).errors.length, 3);
    assert.equal(writes.length, 0);
    const valid = { name: 'Test reviewer', rating: 5, message: 'Useful project case studies.' };
    const success = await send({ ...valid, approved: true });
    assert.equal(success.status, 201);
    assert.equal((await success.json()).success, true);
    assert.equal(writes.length, 1);
    assert.equal(writes[0].approved, undefined);
    assert.equal(new Feedback(writes[0]).approved, false);
    const bot = await send({ ...valid, website: 'spam.example' });
    assert.equal(bot.status, 201);
    assert.equal(writes.length, 1);
    Feedback.create = async () => { throw new Error('database offline'); };
    const failure = await send(valid);
    assert.equal(failure.status, 500);
    assert.equal((await failure.json()).success, false);
    await send(valid);
    assert.equal((await send(valid)).status, 429);
    // Contact has a separate limiter; exhausting feedback must not block it.
    assert.equal((await send({}, '/api/contact')).status, 400);
    const malformed = await fetch(base + '/api/contact', {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: '{broken',
    });
    assert.equal(malformed.status, 400);
    assert.equal((await fetch(base + '/unknown')).status, 404);
    assert.equal((await fetch(base + '/api/health')).status, 503);
  } finally {
    Feedback.create = original;
    await new Promise(resolve => server.close(resolve));
  }
});

test('requested content has valid unique project slugs and schema-compatible fields', async () => {
  assert.equal(projects.length, 8);
  assert.equal(new Set(projects.map(p => p.slug)).size, 8);
  assert.equal(profile.jargon.length, 18);
  assert.equal(profile.experience.filter(x => x.current).length, 1);
  assert.equal(profile.experience.find(x => x.current).company, 'iTech Mission Private Limited');
  await new Profile(profile).validate();
  for (const project of projects) await new Project(project).validate();
  assert.equal(profile.skillGroups.some(g => g.items.some(i => 'level' in i)), false);
});
