// =====================================================================
//  SINGLE SOURCE OF TRUTH for personal details.
//  Change values here and the whole portfolio updates.
// =====================================================================
export const site = {
  name: 'Mohammad Mutahhir',
  shortName: 'Ayaan',
  handle: 'Mutahhirayaan',
  role: 'Full Stack Web Developer',
  tagline: 'Building Digital Experiences That Feel Alive.',
  subheadline:
    'Full Stack Web Developer specializing in modern React frontends, scalable ASP.NET Core APIs, real-time applications, authentication, databases, and interactive user experiences.',
  intro:
    'I build scalable, responsive and interactive web applications using modern frontend technologies, robust backend APIs, databases, authentication systems and real-time communication.',

  email: 'mutahhirayaan@gmail.com',
  github: 'https://github.com/mutahhirayaan',
  linkedin: 'https://www.linkedin.com/in/mohammad-mutahhir-53887224b',
  location: 'Mau, Uttar Pradesh, India',

  // Put your photo at public/assets/profile.jpg (or change this path). Square-ish, 800x800+ works best.
  profileImage: '/assets/profile.jpeg',
  profileFallback: '/assets/profile-placeholder.svg',
  profileAlt: 'Portrait of Mohammad Mutahhir, Full Stack Web Developer',

  // Put your PDF at public/assets/resume.pdf
  resumePath: '/assets/resume.pdf',
  resumeFileName: 'mutahhir-Resume.pdf',

  company: { name: 'Cubic Eight', role: 'Web & Mobile App Developer' },
  seo: {
    title: 'Mohammad Mutahhir | Full Stack Web Developer',
    description:
      'Portfolio of Mohammad Mutahhir, a Full Stack Web Developer specializing in React, ASP.NET Core, C#, REST APIs, SQL Server, MySQL and modern web applications.',
    ogImage: '/og-image.png',
  },
};

export const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

export const footerLinks = navLinks.filter((l) => ['home', 'about', 'skills', 'projects', 'contact'].includes(l.id));
