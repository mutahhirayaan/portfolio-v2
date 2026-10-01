// Add a project by adding one object. Cards, filters, detail page, SEO and sitemap all read from here.
// Set `github` / `liveDemo` to real URLs; empty strings hide the matching button.
const GH = 'https://github.com/mutahhirayaan';
const shots = (id, alts) => alts.map((alt, i) => ({ src: `/screenshots/${id}/shot-${i + 1}.png`, alt, caption: alt }));

export const projectFilters = ['All', 'Frontend', 'Full Stack', 'Backend', 'Mobile', 'API'];

export const projects = [
  {
    id: 'ledger',
    slug: 'ledger',
    title: 'Ledger',
    tagline: 'Real-time one-to-one and group chatting application.',
    category: 'Mobile',
    categories: ['Mobile', 'API', 'Backend'],
    status: 'In progress',
    year: '2026',
    role: 'Designer and Developer',
    description:
      'A real-time chatting application that allows users to connect with friends, have one-to-one conversations and participate in group chats.',
    image: '/screenshots/ledger/shot-1.svg',
    theme: ['#10b981', '#6366f1'],
    technologies: ['ASP.NET Core', '.NET 8', 'Entity Framework', 'REST API', 'JWT', 'SignalR', 'Firebase', 'Ionic', 'Capacitor'],
    overview:
      'A modern real-time chatting application built for private and group conversations. Users can connect with friends, send messages instantly and communicate through one-to-one or group chats.',
    problem:
      'Users need a simple and reliable way to communicate privately or in groups while keeping conversations fast and synchronized in real time.',
    solution:
      'One-to-one and group messaging powered by SignalR, combined with friend management, authentication and push notifications for a smooth real-time communication experience.',
    features: [
      'User registration and login',
      'Friend request management',
      'Send, accept and remove friend requests',
      'One-to-one real-time chat',
      'Group chat functionality',
      'Real-time message delivery using SignalR',
      'Online and offline user status',
      'Firebase push notifications',
      'Google authentication',
      'Simple user profile',
    ],
    architecture: {
      summary:
        'A real-time mobile chat client with an ASP.NET Core API and SignalR for instant communication, with Firebase used for authentication and push notifications.',
      layers: [
        'Ionic + Capacitor client',
        'ASP.NET Core .NET 8 API',
        'SignalR real-time communication',
        'Entity Framework',
        'Relational database',
      ],
    },
    frontendDetails:
      'Touch-friendly and responsive chat screens designed for quick one-to-one and group conversations.',
    backendDetails:
      'ASP.NET Core .NET 8 Web API handling users, friends, conversations, groups and messages, with SignalR providing real-time communication.',
    database:
      'Relational schema for users, friend requests, conversations, groups, group members and messages.',
    authentication:
      'JWT authentication with Firebase Google authentication support.',
    api: {
      summary:
        'REST API for authentication, friends, conversations, groups and messaging, with SignalR handling real-time communication.',
      endpoints: [
        'POST /auth/login',
        'GET /friends',
        'POST /friends/request',
        'POST /friends/accept',
        'GET /conversations',
        'POST /groups',
        'GET /groups',
        'POST /messages',
      ],
    },
    challenges: [
      'Maintaining reliable real-time communication between users.',
      'Handling both one-to-one and group conversations.',
      'Keeping online and offline status synchronized.',
      'Implementing real-time notifications for new messages.',
    ],
    learned: [
      'Real-time applications require careful connection and presence management.',
      'SignalR makes real-time communication easier to implement with ASP.NET Core.',
      'Designing the database around conversations and group membership makes chat features easier to extend.',
    ],
    screenshots: shots('salesman-app', ['Party list', 'Order notes', 'Payments overview']),
    github: GH,
    liveDemo: '',
  },

  {
    id: 'loopbook',
    slug: 'loopbook',
    title: 'LoopBook',
    tagline: 'Split group expenses without the awkward maths.',
    category: 'Full Stack',
    categories: ['Full Stack', 'Frontend', 'Mobile'],
    status: 'Active',
    year: '2026',
    role: 'Full Stack Developer at Cubic Eight',
    description: 'A group expense-splitting app with shared groups, transactions, an admin panel and an Android build.',
    image: '/screenshots/loopbook/shot-1.png',
    theme: ['#06b6d4', '#6366f1'],
    technologies: ['React', 'Vite', 'Tailwind CSS', 'Framer Motion', 'ASP.NET Core', 'Entity Framework', 'Firebase', 'Capacitor'],
    overview: 'LoopBook helps friends, flatmates and travel groups track who paid, who owes and who has settled up. It ships as a responsive web app and as an Android app through Capacitor, with an admin panel for monitoring usage.',
    problem: 'Splitting bills in group chats gets messy fast: screenshots of receipts, half-remembered amounts and nobody sure who owes whom.',
    solution: 'One shared ledger per group. Every expense is recorded once, balances update instantly, and each member sees exactly what they owe with clear, sortable transaction history.',
    features: [
      'Groups with members, shared expenses and running balances',
      'Transaction lists with sorting and IST-safe date labels',
      'Light, System and Dark theme switch across the whole app',
      'Admin panel with charts and a "Loop Ring" radial visualisation',
      'Searchable Help & Support FAQ, Privacy Policy and About pages',
      'Splash screen with animated logo transition and system theme detection',
      'Android packaging with Capacitor and Play Store assets',
    ],
    architecture: {
      summary: 'A React single-page client talks to a .NET REST API. Firebase handles messaging while Capacitor wraps the same codebase for Android.',
      layers: ['React + Vite client', 'Axios service layer', 'ASP.NET Core Web API', 'EF Core data access', 'Relational database'],
    },
    frontendDetails: 'Built with React and Vite, styled with Tailwind using a ThemeContext that exposes an isDark flag for explicit light and dark class pairs. Framer Motion powers page and logo transitions, Recharts drives admin charts, and dvh units keep modals correct on mobile browsers.',
    backendDetails: 'ASP.NET Core Web API using dependency injection and repository-style services. Concurrency conflicts from EF Core are handled explicitly so two members editing the same record never silently overwrite each other.',
    database: 'Relational schema managed with Entity Framework Core migrations, covering users, groups, memberships and transactions.',
    authentication: 'Token-based authentication with Google sign-in on mobile through Capacitor, exchanged for an API session. Admin routes are role-protected.',
    api: {
      summary: 'Resource-oriented REST endpoints consumed through a central Axios instance.',
      endpoints: ['GET /groups', 'POST /groups', 'GET /groups/{id}/transactions', 'POST /transactions', 'GET /admin/stats'],
    },
    challenges: [
      'Keeping date labels correct for Indian users by handling Asia/Kolkata time explicitly in the frontend.',
      'Resolving peer dependency conflicts between the Capacitor Google Auth plugin and Capacitor 8.',
      'Diagnosing an EF Core optimistic concurrency exception and a .NET NullReferenceException early in the backend.',
    ],
    learned: [
      'Design tokens and a theme context make dual-theme UIs far easier to maintain than scattered overrides.',
      'Plan for mobile from day one: viewport units, safe areas and touch targets change layout decisions.',
      'Concurrency is a product problem, not only a database one.',
    ],
    screenshots: shots('loopbook', ['Dashboard with group balances', 'Group transactions list', 'Group Details panel', 'Profile panel']),
    github: GH,
    liveDemo: '',
  },

  {
    id: 'reminder',
    slug: 'reminder',
    title: 'Reminder',
    tagline: 'A reminder app that actually nudges you.',
    category: 'Full Stack',
    categories: ['Full Stack', 'API'],
    status: 'Completed',
    year: '2026',
    role: 'Full Stack Developer',
    description: 'A calendar-based reminder app with push notifications, a glassmorphism UI and an ASP.NET Core API.',
    image: '/screenshots/reminder/shot-1.png',
    theme: ['#8b5cf6', '#22d3ee'],
    technologies: ['React', 'Vite', 'Tailwind CSS', 'Formik', 'Axios', 'ASP.NET Core', 'SQL Server', 'Firebase Cloud Messaging', 'Capacitor'],
    overview: 'RemindMe combines a custom calendar, quick add, notes and settings in a glassmorphism interface. Push notifications through Firebase Cloud Messaging make sure reminders reach the device even when the app is closed.',
    problem: 'Simple to-do lists are easy to forget about, and calendar apps are heavy for small time-based nudges.',
    solution: 'A focused reminder workflow: create in seconds, see everything on a calendar, and get a push notification at the right time on web or Android.',
    features: [
      'Custom calendar with create, edit and delete modals',
      'Form validation with Formik and Yup',
      'Firebase Cloud Messaging push notifications end to end',
      'Category, sound and notification toggles per reminder',
      'Paged listing endpoint and complete/undo actions',
      'Android build via Capacitor',
    ],
    architecture: {
      summary: 'React client with a useReminders hook that maps UI fields to API view models. The API uses a repository pattern and a notification service backed by the Firebase Admin SDK.',
      layers: ['React + Tailwind UI', 'useReminders hook + reminderApi', 'ReminderController', 'Repositories', 'DbContext + SQL Server', 'FirebaseNotificationService'],
    },
    frontendDetails: 'React 18 with Vite and Tailwind, react-router-dom for routing and moment for date handling. A dedicated hook owns field mapping (date to reminderDate, time to HH:mm:ss, done to isCompleted) so components stay clean.',
    backendDetails: 'ASP.NET Core with models, view models and repositories in separate projects. Notifications are sent through an INotificationService implementation wrapping the Firebase Admin SDK.',
    database: 'Entity Framework Core with an ApplicationDbContext. Started on MySQL via Pomelo and moved to SQL Server, using retry-on-failure for transient connection errors.',
    authentication: 'Device tokens are registered per device for push delivery. The API is CORS-restricted to the frontend origin.',
    api: {
      summary: 'Action-based routes under api/Reminder.',
      endpoints: ['GET api/Reminder/GetAll?PageNo&PageSize', 'GET api/Reminder/GetById/{id}', 'POST api/Reminder/Create', 'PUT api/Reminder/Update', 'DELETE api/Reminder/Delete/{id}'],
    },
    challenges: [
      'Untangling CORS problems caused by duplicate UseCors calls and HTTP/HTTPS redirects.',
      'Getting Android builds stable when antivirus and OneDrive locked Gradle cache files.',
      'Aligning frontend field names with backend view models without leaking mapping logic into components.',
    ],
    learned: [
      'A mapping layer between UI and API keeps both sides free to evolve.',
      'Push notifications are a pipeline: permission, service worker, token, storage and delivery all need testing.',
      'Pin dependency versions when a toolchain moves faster than its plugins.',
    ],
    screenshots: shots('reminder', ['Calendar view', 'Create reminder','Reminder list']),
    github: GH,
    liveDemo: '',
  },
  {
    id: 'Student-management',
    slug: 'student-management-system',
    title: 'Student Management System',
    tagline: 'A complete system for managing students, books and book allotments.',
    category: 'Full Stack',
    categories: ['Full Stack', 'Backend', 'API'],
    status: 'Completed',
    year: '2025',
    role: 'Full Stack Developer Trainee',
    description:
      'A full stack management system for managing student records, books and book allotments, built with React, ASP.NET Core and SQL Server.',
    image: '/screenshots/student-management/shot-1.png',
    theme: ['#f59e0b', '#8b5cf6'],
    technologies: [
      'React',
      'Tailwind CSS',
      'ASP.NET Core',
      'C#',
      'Entity Framework',
      'SQL Server',
      'REST API',
      'JWT',
      'Swagger',
      'Axios'
    ],
    overview:
      'A full stack training project that connects a React frontend with an ASP.NET Core Web API and SQL Server database. The system provides student management, book management and book allotment features with role-based access for Admin and Student users.',
    problem:
      'Managing student records, available books and book allotments manually can make it difficult to keep information organized and track which books are assigned to which students.',
    solution:
      'A centralized management system that allows administrators to manage students and books, allot books to students and maintain organized records through a responsive web interface.',
    features: [
      'Student CRUD management',
      'Book CRUD management',
      'Book allotment management',
      'Student and book record management',
      'Admin and Student roles',
      'JWT-based authentication',
      'Role-based access control',
      'Responsive React interface',
      'API documentation with Scalar',
    ],
    architecture: {
      summary:
        'A full stack architecture with a React frontend, ASP.NET Core Web API backend, Entity Framework for data access and SQL Server as the relational database.',
      layers: [
        'React UI',
        'ASP.NET Core Web API',
        'Controllers',
        'Services',
        'Entity Framework',
        'SQL Server'
      ],
    },
    frontendDetails:
      'React components with Tailwind CSS for responsive student, book and allotment management screens. Axios is used for communication with the ASP.NET Core API.',
    backendDetails:
      'ASP.NET Core Web API with controllers, business logic and Entity Framework for database operations. JWT authentication and role-based authorization are used to protect application resources.',
    database:
      'SQL Server database containing students, books and book allotment records with relationships managed through Entity Framework.',
    authentication:
      'JWT authentication with Admin and Student roles for role-based access control.',
    api: {
      summary:
        'REST API endpoints for authentication, students, books and book allotments.',
      endpoints: [
        'POST /api/auth/login',
        'GET /api/students',
        'POST /api/students',
        'PUT /api/students/{id}',
        'DELETE /api/students/{id}',
        'GET /api/books',
        'POST /api/books',
        'PUT /api/books/{id}',
        'DELETE /api/books/{id}',
        'POST /api/book-allotments',
        'GET /api/book-allotments'
      ],

    },
    challenges: [
      'Designing relationships between students, books and book allotments.',
      'Implementing JWT authentication and role-based authorization.',
      'Connecting the React frontend with the ASP.NET Core Web API.',
      'Keeping CRUD operations and validation consistent across the application.'
    ],
    learned: [
      'How to build a complete full stack application using React and ASP.NET Core.',
      'How to implement JWT authentication and role-based authorization.',
      'How to work with Entity Framework and SQL Server relationships.',
      'How to design and consume REST APIs from a React application.'
    ],
    screenshots: shots(
      'student-management',
      [
        'Admin Dashboard',
        'Student management',
        'Book management',
      ]
    ),
    github: GH,
    liveDemo: '',
  },
];

export const getProjectBySlug = (slug) => projects.find((p) => p.slug === slug);
