# API contract (ASP.NET Core)

Base URL: `VITE_API_BASE_URL`. JSON, camelCase. Admin routes need `Authorization: Bearer <jwt>` with role `Admin`.

| Method | Route | Body / Response |
|---|---|---|
| GET | `/projects` | `Project[]` (same shape as `src/data/projects.js`) |
| GET | `/projects/{slug}` | `Project` |
| GET | `/skills` | `Skill[]` |
| POST | `/contact` | `{ name, email, subject, message }` -> 200 |
| POST | `/analytics/visit` | `{ path, visitorId? }` -> 204 (dedupe by visitorId + day) |
| GET | `/analytics/views` | `{ total }` |
| POST | `/analytics/project-view` | `{ slug }` -> 204 |
| POST | `/auth/login` | `{ email, password }` -> `{ token }` |
| POST | `/auth/google` | `{ credential }` (Google ID token, verify server-side) -> `{ token }` |
| GET | `/admin/stats` | `{ visitors, projectViews, messages, projects, skills }` |
| POST/PUT/DELETE | `/admin/projects[/{id}]` | Project CRUD |
| POST/PUT/DELETE | `/admin/skills[/{id}]` | Skill CRUD |
| POST | `/admin/uploads` | multipart `file` -> `{ url }` |
| POST | `/admin/resume` | multipart `file` (PDF) |
| GET | `/admin/messages` | `{ id, name, email, subject, message, createdAt }[]` |

CORS: allow only your frontend origin. Rate-limit `/contact` and `/analytics/visit`.
JWT must contain a role claim (`role` or the standard ClaimTypes.Role URI) equal to `Admin`.
