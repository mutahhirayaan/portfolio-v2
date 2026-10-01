#Mohammad Mutahhir | 3D Full Stack Developer Portfolio

React 18 + Vite + Tailwind CSS + Framer Motion + React Three Fiber, with an ASP.NET Core-ready service layer.

## Run karne ka tareeka (PowerShell)

```powershell
cd path\to\mutahhir-portfolio
npm install
Copy-Item .env.example .env
npm run dev
```

Production build:

```powershell
$env:SITE_URL = "https://your-domain.com"
npm run build
npm run preview
```

## Sabse pehle ye 4 cheezein badlo

| Kya | Kahan |
|---|---|
| Naam, email, GitHub, LinkedIn, location, tagline | `src/config/site.js` |
| Profile photo | `public/assets/profile.jpg` (path `site.profileImage`) |
| Resume PDF | `public/assets/resume.pdf` (abhi placeholder hai) |
| Projects / screenshots | `src/data/projects.js` + `public/screenshots/<id>/` |

Skills: `src/data/skills.js` (naya skill = ek object). Timeline: `src/data/experience.js`. Services: `src/data/services.js`.

## Firebase (recommended, backend ki zaroorat nahi)

Contact messages, visitor counter, project views aur admin login (Google) Firebase se chalte hain.
1. `.env` me `VITE_FIREBASE_*` values aur `VITE_ADMIN_EMAIL` bharo.
2. `firestore.rules` ka poora content Firebase Console -> Firestore -> Rules me paste karke Publish karo (email check karo).
3. `/admin` par Google se sign in karo. Sirf `VITE_ADMIN_EMAIL` wala account andar ja sakta hai.
Projects aur skills abhi bhi `src/data/` se edit hote hain.

## Contact form (EmailJS, optional)

`.env` me `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY` bharo.
EmailJS template variables: `from_name`, `from_email`, `reply_to`, `subject`, `message`, `to_email`.
Ye public keys hain, secret nahi. Agar EmailJS khali hai aur `VITE_API_BASE_URL` set hai, to form `POST /contact` use karega.

## Visitor counter

`VITE_VIEW_PROVIDER` = `counterapi` (free hosted, default), `api` (apna ASP.NET Core) ya `none`.
Count fake nahi hota: ek naye browser session par +1 (`VITE_COUNT_MODE=unique` se ek browser par ek baar). Provider fail ho to counter chhup jata hai.

## Backend (ASP.NET Core) connect karna

`.env` me `VITE_API_BASE_URL=https://localhost:7065/api` (apna URL). Contract: `docs/BACKEND_API_CONTRACT.md`.
Services: `src/services/` (`api.js`, `projectService.js`, `contactService.js`, `analyticsService.js`, `authService.js`, `adminService.js`).

## Admin dashboard

Route: `/admin` (JWT + role `Admin`, optional Google OAuth via `VITE_GOOGLE_CLIENT_ID`).
Bina backend ke dekhne ke liye (sirf dev): `.env` me `VITE_ADMIN_PREVIEW=true`, phir `/admin/login` par preview button.
Note: token localStorage me store hota hai. Production me httpOnly cookie better hai.

## 3D aur performance

- Hero ka WebGL scene lazy load hota hai (idle par, sirf wide screen, sirf jab `prefers-reduced-motion` off ho, aur WebGL available ho).
- Mobile par CSS 3D cube + gradients dikhte hain, Three.js load nahi hota.
- Fonts `@fontsource` se self-hosted hain, project images `loading="lazy"`.

## Structure

```
src/
  components/  sections/  pages/  layouts/  hooks/
  services/    data/      config/ store/    utils/   styles/
```
