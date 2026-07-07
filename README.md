# Freelancer Marketplace — Authentication & Profile Completion Module

## What's included
- `backend/` — Express API: JWT auth, bcrypt password hashing, role-based middleware,
  Client/Freelancer registration & login, complete-profile endpoints (with file uploads), protected dashboard placeholder routes.
- `freelancing/` — your existing React app, extended with: role selection landing page,
  separate Client/Freelancer register & login pages, the two big Complete Profile forms, and
  template-only dashboards with nav placeholders.

## Setup

### Backend
```
cd backend
npm install
cp .env.example .env   # then fill in MONGO_URI and a real JWT_SECRET
npm run dev
```
Runs on `http://localhost:5000`.

### Frontend
```
cd freelancing
npm install
npm start
```
Runs on `http://localhost:3000`.

## Important security note
Your uploaded `backend/app.js` had a live MongoDB Atlas connection string
(with username and password) hardcoded directly in the source file. The new `app.js`
reads it from `.env` instead (see `.env.example`). Since that password was sitting in
plain text in a file, it's worth rotating it in Atlas and making sure `.env` is in
`.gitignore` (it already is here) so it never gets committed.

## Notes on choices made
- Used **Mongoose** instead of the raw `mongodb` driver so the `User` / `ClientProfile` /
  `FreelancerProfile` schemas from the spec map directly to models — still the same
  MongoDB Atlas database, just a cleaner data layer.
- JWT is stored in `localStorage` on the frontend and sent as a `Bearer` token
  (matches how the project already stored the logged-in user in `localStorage`).
  This is simple for a pure SPA + separate API, but is more exposed to XSS than an
  httpOnly cookie — worth revisiting later if this goes to production.
- Downgraded `react-router-dom` to `^6.28.0`. Version 7 is incompatible with Create
  React App's Jest resolver out of the box (a known upstream issue) and broke
  `npm test`. Everything used here (`Routes`, `Route`, `Navigate`, `Link`, `useNavigate`)
  works identically in v6.
- File uploads (profile pictures, resumes, portfolio files, certificates) are stored
  on local disk under `backend/uploads/` via Multer, and served statically — fine for
  development; swap for cloud storage before deploying anywhere persistent.
- Marketplace features (job posting, bidding, messaging, payments, admin, search) are
  intentionally left as placeholder nav items only, per the spec.

Both the backend (module load + route/validation checks) and frontend (`npm run build`
and `npm test`) were verified to work before handing this off.
