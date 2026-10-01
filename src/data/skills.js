// Add a new technology by adding one object here. Nothing else needs to change.
// level: 3 = daily driver, 2 = comfortable, 1 = working knowledge
export const skillCategories = ['Frontend', 'Backend', 'Database', 'Mobile', 'Tools'];

export const skills = [
  // ---------------- FRONTEND ----------------
  { name: 'HTML5', icon: 'html5', category: 'Frontend', level: 3, description: 'Semantic, accessible markup that search engines and screen readers understand.', officialUrl: 'https://developer.mozilla.org/docs/Web/HTML' },
  { name: 'CSS3', icon: 'css3', category: 'Frontend', level: 3, description: 'Grid, flexbox, custom properties and 3D transforms for responsive layouts.', officialUrl: 'https://developer.mozilla.org/docs/Web/CSS' },
  { name: 'JavaScript', icon: 'javascript', category: 'Frontend', level: 3, description: 'Modern ES6+ for UI logic, async flows and browser APIs.', officialUrl: 'https://developer.mozilla.org/docs/Web/JavaScript' },
  { name: 'React.js', icon: 'react', category: 'Frontend', level: 3, description: 'Component-driven interfaces with hooks, context and routing.', officialUrl: 'https://react.dev' },
  { name: 'Tailwind CSS', icon: 'tailwind', category: 'Frontend', level: 3, description: 'Utility-first styling with design tokens and dark mode.', officialUrl: 'https://tailwindcss.com' },
  { name: 'Axios', icon: 'axios', category: 'Frontend', level: 3, description: 'A typed-feeling service layer with interceptors for auth and errors.', officialUrl: 'https://axios-http.com' },
  { name: 'Framer Motion', icon: 'framer', category: 'Frontend', level: 2, description: 'Spring-based animation, layout transitions and scroll reveals.', officialUrl: 'https://www.framer.com/motion' },
  { name: 'Lucide React', icon: 'lucide', category: 'Frontend', level: 3, description: 'Consistent, lightweight SVG icons across the interface.', officialUrl: 'https://lucide.dev' },
  { name: 'Material UI', icon: 'mui', category: 'Frontend', level: 2, description: 'Accessible component primitives for admin and data-heavy screens.', officialUrl: 'https://mui.com' },
  { name: 'Redux', icon: 'redux', category: 'Frontend', level: 2, description: 'Predictable global state with Redux Toolkit slices.', officialUrl: 'https://redux-toolkit.js.org' },

  // ---------------- BACKEND ----------------
  { name: 'C#', icon: 'csharp', category: 'Backend', level: 3, description: 'Strongly typed, modern C# for clean and maintainable services.', officialUrl: 'https://learn.microsoft.com/dotnet/csharp' },
  { name: 'ASP.NET Core Web API', icon: 'dotnet', category: 'Backend', level: 3, description: 'Fast, secure REST APIs with controllers, middleware and validation.', officialUrl: 'https://learn.microsoft.com/aspnet/core' },
  { name: 'REST API', icon: 'rest', category: 'Backend', level: 3, description: 'Resource-oriented endpoints with predictable contracts and status codes.' },
  { name: 'Dependency Injection', icon: 'di', category: 'Backend', level: 3, description: 'Loosely coupled services and repositories that are easy to test.', officialUrl: 'https://learn.microsoft.com/aspnet/core/fundamentals/dependency-injection' },
  { name: 'LINQ', icon: 'linq', category: 'Backend', level: 3, description: 'Expressive querying and shaping of collections and database data.', officialUrl: 'https://learn.microsoft.com/dotnet/csharp/linq' },
  { name: 'Entity Framework', icon: 'efcore', category: 'Backend', level: 3, description: 'Code-first models, migrations and concurrency handling with EF Core.', officialUrl: 'https://learn.microsoft.com/ef/core' },
  { name: 'JWT Authentication', icon: 'jwt', category: 'Backend', level: 3, description: 'Stateless token auth with refresh flows and secure claims.', officialUrl: 'https://jwt.io' },
  { name: 'Google OAuth', icon: 'google', category: 'Backend', level: 2, description: 'Social sign-in exchanged for your own API session token.', officialUrl: 'https://developers.google.com/identity' },
  { name: 'Role-Based Access Control', icon: 'rbac', category: 'Backend', level: 2, description: 'Policies and roles that keep admin features locked down.' },
  { name: 'SignalR', icon: 'signalr', category: 'Backend', level: 2, description: 'Real-time updates over WebSockets with automatic fallbacks.', officialUrl: 'https://learn.microsoft.com/aspnet/core/signalr' },

  // ---------------- DATABASE ----------------
  { name: 'MySQL', icon: 'mysql', category: 'Database', level: 2, description: 'Relational schemas, indexes and queries with the Pomelo EF Core provider.', officialUrl: 'https://www.mysql.com' },
  { name: 'SQL Server', icon: 'sqlserver', category: 'Database', level: 3, description: 'T-SQL, migrations and retry-safe connections for production apps.', officialUrl: 'https://www.microsoft.com/sql-server' },

  // ---------------- MOBILE ----------------
  { name: 'Ionic', icon: 'ionic', category: 'Mobile', level: 2, description: 'Web-first mobile UI patterns that feel native on Android.', officialUrl: 'https://ionicframework.com' },
  { name: 'Capacitor', icon: 'capacitor', category: 'Mobile', level: 2, description: 'Ships React apps to Android with native plugins and push notifications.', officialUrl: 'https://capacitorjs.com' },

  // ---------------- DEVELOPMENT TOOLS ----------------
  { name: 'Git', icon: 'git', category: 'Tools', level: 3, description: 'Branching, rebasing and clean commit history.', officialUrl: 'https://git-scm.com' },
  { name: 'GitHub', icon: 'github', category: 'Tools', level: 3, description: 'Repositories, pull requests and CI workflows.', officialUrl: 'https://github.com' },
  { name: 'Visual Studio', icon: 'visualstudio', category: 'Tools', level: 3, description: 'Full IDE for building, debugging and profiling .NET backends.', officialUrl: 'https://visualstudio.microsoft.com' },
  { name: 'VS Code', icon: 'vscode', category: 'Tools', level: 3, description: 'Daily editor for the frontend with a tuned extension setup.', officialUrl: 'https://code.visualstudio.com' },
  { name: 'Postman', icon: 'postman', category: 'Tools', level: 3, description: 'Collections and environments to test and document APIs.', officialUrl: 'https://www.postman.com' },
  { name: 'Firebase Console', icon: 'firebase', category: 'Tools', level: 2, description: 'Cloud Messaging, auth and project configuration.', officialUrl: 'https://console.firebase.google.com' },
  { name: 'Scalar', icon: 'scalar', category: 'Tools', level: 2, description: 'Interactive API reference generated from OpenAPI.', officialUrl: 'https://scalar.com' },
];

export const levelLabels = { 3: 'Daily driver', 2: 'Comfortable', 1: 'Learning' };

export const marqueeTech = [
  'react', 'javascript', 'dotnet', 'csharp', 'sqlserver', 'mysql', 'efcore', 'jwt', 'signalr', 'tailwind', 'redux', 'github',
].map((icon) => {
  const s = skills.find((k) => k.icon === icon);
  return { icon, name: s ? s.name.replace(' Web API', '').replace(' Authentication', '') : icon };
});
