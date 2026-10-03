# Portfolio

Angular standalone client with a layered Express/MongoDB API. This repository does not currently implement independently deployed microservices.

## Local setup

Install dependencies separately at the root, `client/`, and `server/` using `npm ci`. Copy `server/.env.example` to `server/.env` and configure MongoDB. Never commit credentials.

- `npm run dev`: API at 127.0.0.1:5000 and Angular at localhost:4200.
- `npm run build`: production Angular build.
- `npm test`: backend HTTP/validation tests and frontend project-route tests.
- `bash scripts/fetch-assets.sh`: download missing supplied assets; existing files are preserved.

Do not start a second dev server on ports already in use. The client development proxy forwards `/api/**` to the API. Production hosting must separately configure API proxying and SPA route fallback.

## Content and data

`server/src/scripts/seed-data.js` defines the requested eight projects, current job, jargon phrases, skill descriptions and image references. `npm run seed` initializes an empty database only and refuses to overwrite existing content. Once the admin is in use, edit live content at `/admin`; seed-data.js is no longer the source of truth.

Project details use `/projects/:slug` and the shared project list. Images without a configured file use initials/gradient fallbacks. Screenshots for E-Commerce Platform, MEAN Stack Portfolio and Authflow, and an iTech Mission logo, remain unsupplied.

Reviews submit to `POST /api/feedback`, are validated and rate limited independently of contact submissions, and default to `approved: false`. Reviews are not exposed publicly. The owner can review, approve/unapprove, and delete submissions in `/admin`; approval alone does not publish a testimonial. Contact remains `POST /api/contact`.

## Verification

The automated tests cover feedback validation, honeypot handling, persistence failure, moderation defaults, independent rate limits, JSON error status, seed schema validity, and changes between project detail routes. Backend tests replace persistence locally and do not connect to Atlas. Frontend tests simulate loaded, missing and failed project data.

## Remaining content decisions

The implementation retains the supplied Annu Mudgal branding and LinkedIn/AProject links. Confirm those URLs and the e-commerce description against the actual projects before publishing. Generic iTech Mission responsibilities and missing images can be updated in the content source.

## Admin setup

For this upgraded checkout, existing content was migrated without replacement. On another existing installation, run `npm run migrate` once before editing.

1. Run `npm run admin:create` from the root. Enter your owner email and a password of at least 12 characters; password input is hidden. This command refuses to overwrite an existing owner.
2. Run `npm run dev` if the servers are not already running.
3. Open `http://localhost:4200/admin` and sign in.
4. Edit/add/remove content, then save. Projects can be kept private until ready. Image/resume fields accept existing local /paths or HTTPS URLs; no upload provider is configured.

See `docs/DATA_AND_STORAGE.md` for collections, revision conflicts, privacy, storage and deployment requirements. Set exact `ADMIN_ORIGINS` and `NODE_ENV=production` for HTTPS deployment. Public registration is disabled.
