# Content, database and storage

## Current ownership

This remains one Angular client and a layered Express backend. Admin is a lazy Angular route; it does not add another runtime. Logical content and identity modules are distinct, but are not independently deployed microservices.

| Collection | Purpose | Access |
| --- | --- | --- |
| profiles | One portfolio aggregate: identity/contact, socials, ordered services, education, experience, skills, certificates, testimonials, quotes, hero phrases, photo/resume references, SEO description | Public allowlisted read; owner edit |
| projects | Separate project records, stable Mongo IDs, unique slugs, details, media references, featured/order and public visibility | Public published-only read; owner CRUD |
| messages | General contact submissions and read state | Public submission; owner paginated review/delete |
| feedbacks | Review submissions and approval state | Public submission; owner paginated moderation/delete; no public listing |
| owners | Single owner identity, role and scrypt password hash | Operator account setup; protected authentication only |
| adminsessions | Hashed opaque session tokens, CSRF tokens and 8-hour expiry | Server only; expiry TTL and explicit expiration check |

The profile arrays are appropriate for the small bounded content set now: one read supplies the portfolio, ordering is explicit, and saving is atomic. Each entry has a stable UUID; skills inside categories have their own IDs. These IDs allow later entry endpoints or extraction into independently owned collections without matching on editable titles. Projects use independent documents already.

Profiles and projects have a revision (`__v` in MongoDB, `revision` in admin responses). Writes and project deletion must match the current revision. Stale edits return HTTP 409 rather than overwriting another save. The UI keeps unsaved input and offers reload/discard. Reordering profile entries is persisted through array order; project order uses a numeric field.

## Content flow

1. Owner signs in at `/admin`; an HttpOnly SameSite=Strict cookie identifies an 8-hour session.
2. Admin loads protected content into a local editable draft. Nothing changes on typing.
3. Save sends allowed data, revision and a session CSRF header to Express. Origin and owner permission are enforced server-side.
4. Server validates field types, lengths, IDs, icons, and URL protocols, then saves to MongoDB.
5. Same-tab public data refreshes; other visitors see the new data on their next page load. There is no cross-tab realtime push in this phase.
6. Content edits publish immediately. Projects may remain drafts using “Visible publicly”. A future general draft/publish workflow can build on these same records.

There is no public owner registration. Create the real owner once from the trusted project terminal using `npm run admin:create`; passwords are hidden while entered and stored only as salted scrypt hashes. Authentication tokens never go into localStorage. Production must use HTTPS, NODE_ENV=production and exact ADMIN_ORIGINS. Do not expose development servers publicly.

## Existing data and migration

`npm run migrate` only adds missing stable entry IDs, photo/SEO references and public-project flags. It does not replace descriptions, employers, skills or projects. It is repeatable and does not touch messages/reviews. Migration increments revisions when changing a record; run before owner editing during an upgrade.

`npm run seed` is now first-time initialization only. It refuses to run when a profile or projects already exist. Once admin is in use, MongoDB is the source of truth; changing seed-data.js does not update the live website. Do not reset collections to apply ordinary content changes.

## Files and object storage

MongoDB stores URLs/paths and metadata, not image/PDF binaries. For now:

- `/profile.jpg`, `/resume.pdf`, and `/images/...` refer to files in `client/public` copied into the frontend deployment.
- An HTTPS URL refers to a publicly reachable file hosted elsewhere.
- Editing a path in admin does not upload, move or delete a file. Verify the actual file exists before saving.
- Existing public files remain public even if you remove their UI references.
- Removing a project/content entry removes its database record/reference; it does not delete the underlying image.
- Private documents or inquiry attachments must never go in `client/public`.

Later uploads should use an object-storage adapter: admin asks the API for a short-lived upload permission, uploads a size/type-validated file, and saves its object key/URL. Public portfolio media can use a CDN. Private attachments require authorization or short-lived signed downloads, plus retention rules. Select a provider after checking current cost/limits; no provider or paid service has been selected now. Keep storage keys and credentials server-side. Add explicit orphan-file cleanup rather than deleting shared assets whenever a reference is removed.

## Operation and recovery

Use separate databases and credentials for development and production. Keep `.env` out of Git and use least-privilege database access. Back up MongoDB plus public/object-storage assets before migrations or deployment; test restore to an isolated database. MongoDB backups do not back up files in client/public.

Owner-password recovery is an operator task in this initial version; no public email recovery, OAuth, team invitations or MFA is implemented. Do not enable team accounts until permissions and recovery are defined. Review/contact retention, audit history, automated backups and storage uploads are later operational work, not implemented by this first content-admin phase.

API response headers disable caching for `/api/admin`. Public responses explicitly select portfolio fields; projects marked private are excluded. Future admin-only fields must remain outside these public allowlists.
