/**
 * Everything that is "you". Edit this file first.
 *
 * Any prose field can be either a plain value (identical in every language) or
 * a { en, es, ca } object. pick() from @/i18n resolves both, so you only
 * translate what actually differs.
 */
export const site = {
  name: 'Jordi Osarenkhoe Petro',
  location: 'Mallorca, ES',
  email: 'jordiosarenkhoe@outlook.es',
  resume: '/resume.pdf',
  resumeFilename: 'Jordi_Osarenkhoe_Resume.pdf',
  github: 'jordiop',

  role: {
    en: 'Full Stack Developer',
    es: 'Desarrollador Full Stack',
    ca: 'Desenvolupador Full Stack',
  },
  greeting: {
    en: "Hello 👋, I'm",
    es: 'Hola 👋, soy',
    ca: 'Hola 👋, sóc',
  },
  available: {
    en: 'Full Stack Developer at Omniaccess / Marlink',
    es: 'Desarrollador Full Stack en Omniaccess / Marlink',
    ca: 'Desenvolupador Full Stack a Omniaccess / Marlink',
  },
  statement: {
    en:
      "I'm a Full Stack Developer with over 3 years of experience building modern web " +
      'applications. I specialise in web applications, creating efficient ' +
      'and scalable solutions that deliver exceptional user experiences.',
    es:
      'Soy desarrollador Full Stack con más de 3 años de experiencia construyendo ' +
      'aplicaciones web. Me especializo en aplicaciones web, creando ' +
      'soluciones eficientes y escalables que ofrecen experiencias de usuario excepcionales.',
    ca:
      "Sóc desenvolupador Full Stack amb més de 3 anys d'experiència construint " +
      "aplicacions web. M'especialitzo en aplicacions web " +
      "solucions eficients i escalables que ofereixen experiències d'usuari excepcionals.",
  },

  links: [
    { label: 'GitHub', href: 'https://github.com/jordiop' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jordiop/' },
    { label: 'Twitter', href: 'https://twitter.com/jordiscript' },
  ],
}

export const bio = {
  en: [
    "I'm a passionate Full Stack Developer with over 3 years of experience building modern web applications. I specialise in Vue.js, TypeScript and Node.js, creating efficient and scalable solutions that deliver exceptional user experiences.",
    "When I'm not coding, you can find me exploring new technologies, reading books, or watching videos. One non-related passion of mine is car mechanics — I'm teaching myself how to restore classic cars.",
  ],
  es: [
    'Soy un desarrollador Full Stack apasionado, con más de 3 años de experiencia construyendo aplicaciones web. Me especializo en Vue.js, TypeScript y Node.js, creando soluciones eficientes y escalables que ofrecen experiencias de usuario excepcionales.',
    'Cuando no estoy programando, me encontrarás explorando nuevas tecnologías, leyendo libros o viendo vídeos. Una pasión mía que no tiene nada que ver es la mecánica: estoy aprendiendo por mi cuenta a restaurar coches clásicos.',
  ],
  ca: [
    "Sóc un desenvolupador Full Stack apassionat, amb més de 3 anys d'experiència construint aplicacions web. M'especialitzo en Vue.js, TypeScript i Node.js, creant solucions eficients i escalables que ofereixen experiències d'usuari excepcionals.",
    "Quan no estic programant, em trobaràs explorant noves tecnologies, llegint llibres o mirant vídeos. Una passió meva que no hi té res a veure és la mecànica: estic aprenent pel meu compte a restaurar cotxes clàssics.",
  ],
}

export const skills = [
  {
    group: { en: 'Frontend', es: 'Frontend', ca: 'Frontend' },
    items: ['Vue.js', 'Nuxt.js', 'TypeScript', 'Tailwind CSS'],
  },
  {
    group: { en: 'Backend', es: 'Backend', ca: 'Backend' },
    items: ['Node.js', 'Python', 'PostgreSQL', 'Laravel'],
  },
  {
    group: { en: 'Tooling', es: 'Herramientas', ca: 'Eines' },
    items: ['Git', 'Docker', 'Vite', 'Vuetify'],
  },
]

export const experience = [
  {
    company: 'Omniaccess / Marlink',
    technologies: ['Nuxt.js', 'Vuetify', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'Python'],
    role: {
      en: 'Full Stack Developer',
      es: 'Desarrollador Full Stack',
      ca: 'Desenvolupador Full Stack',
    },
    duration: {
      en: 'January 2025 — Present',
      es: 'Enero 2025 — Actualidad',
      ca: 'Gener 2025 — Actualitat',
    },
    description: {
      en: "Following my previous experience, I'm working on projects using Nuxt and Vuetify and collaborating with the design team to deliver high-quality products.",
      es: 'Continuando con mi experiencia previa, trabajo en proyectos con Nuxt y Vuetify y colaboro con el equipo de diseño para entregar productos de alta calidad.',
      ca: "Continuant amb la meva experiència prèvia, treballo en projectes amb Nuxt i Vuetify i col·laboro amb l'equip de disseny per lliurar productes d'alta qualitat.",
    },
  },
  {
    company: 'Omniaccess',
    technologies: ['Vue.js', 'Nuxt.js', 'Tailwind CSS', 'JavaScript'],
    role: {
      en: 'Junior Full Stack Developer',
      es: 'Desarrollador Full Stack Junior',
      ca: 'Desenvolupador Full Stack Júnior',
    },
    duration: {
      en: 'June 2023 — December 2024',
      es: 'Junio 2023 — Diciembre 2024',
      ca: 'Juny 2023 — Desembre 2024',
    },
    description: {
      en: 'Maintained and improved existing web applications using Vue.js and Tailwind CSS. Developed a customer portal for a company client.',
      es: 'Mantenimiento y mejora de aplicaciones web existentes con Vue.js y Tailwind CSS. Desarrollé un portal de clientes para un cliente de la empresa.',
      ca: "Manteniment i millora d'aplicacions web existents amb Vue.js i Tailwind CSS. Vaig desenvolupar un portal de clients per a un client de l'empresa.",
    },
  },
]

export const education = [
  {
    institution: 'IEDIB',
    duration: '2024 — 2025',
    degree: {
      en: 'Big data and artificial intelligence',
      es: 'Big data e inteligencia artificial',
      ca: 'Big data i intel·ligència artificial',
    },
    description: {
      en: 'Focused on learning the basics of big data and artificial intelligence.',
      es: 'Centrado en aprender los fundamentos del big data y la inteligencia artificial.',
      ca: "Centrat a aprendre els fonaments del big data i la intel·ligència artificial.",
    },
  },
  {
    institution: 'CIFP Borja Moll',
    duration: '2021 — 2023',
    degree: {
      en: 'Web Development and Programming',
      es: 'Desarrollo de Aplicaciones Web',
      ca: "Desenvolupament d'Aplicacions Web",
    },
    description: {
      en: 'Focused on learning the basics of web development and programming.',
      es: 'Centrado en aprender los fundamentos del desarrollo web y la programación.',
      ca: 'Centrat a aprendre els fonaments del desenvolupament web i la programació.',
    },
  },
]

export const interests = {
  en: ['Open source', 'Learning new tech', 'Community', 'Problem solving', 'Classic car restoration'],
  es: ['Código abierto', 'Aprender tecnologías nuevas', 'Comunidad', 'Resolver problemas', 'Restaurar coches clásicos'],
  ca: ['Codi obert', 'Aprendre tecnologies noves', 'Comunitat', 'Resoldre problemes', 'Restaurar cotxes clàssics'],
}
