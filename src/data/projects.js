/**
 * The project list.
 *
 * To add a project: append an object. Only `slug`, `title`, `description`,
 * `tech` and `year` are required — every case-study field is optional and the
 * detail page simply omits the sections you leave out.
 *
 * Any prose field can be a plain value (identical in every language) or a
 * { en, es, ca } object. pick() from @/i18n resolves both, so `title: 'Ledger'`
 * and `description: { en: …, es: …, ca: … }` can sit side by side.
 *
 *   slug          used in the URL: /projects/<slug>
 *   featured      shows on the home page
 *   finished      false renders an "in progress" marker
 *   problem       \
 *   approach       > the case study, rendered in this order
 *   outcome       /
 *   learnings     bulleted list
 *   metrics       the numbers shown in the sidebar
 */
export const projects = [
  {
    slug: 'portfolio-v2',
    title: 'Portfolio v2',
    tech: ['Vue 3', 'Vite', 'Tailwind CSS v4', 'JavaScript'],
    featured: true,
    finished: true,
    year: 2026,
    description: {
      en: "The site you're reading. A monospace portfolio set entirely in Courier Prime, rebuilt from scratch around the content instead of the chrome — file-based routing, three languages and light/dark themes.",
      es: 'El sitio que estás leyendo. Un portfolio monoespaciado compuesto íntegramente en Courier Prime, reconstruido desde cero en torno al contenido en lugar del envoltorio: rutas basadas en archivos, tres idiomas y temas claro/oscuro.',
      ca: "El lloc que estàs llegint. Un portfolio monoespaiat compost íntegrament en Courier Prime, reconstruït des de zero al voltant del contingut en lloc de l'envoltori: rutes basades en fitxers, tres idiomes i temes clar/fosc.",
    },
    role: {
      en: 'Solo build',
      es: 'Proyecto en solitario',
      ca: 'Projecte en solitari',
    },
    durationLabel: { en: 'Ongoing', es: 'En curso', ca: 'En curs' },
    problem: {
      en: 'v1 was a tech demo first and a portfolio second. The code-editor frame was the whole idea, and it worked — but it put a layer of interface between a visitor and the actual work, and it only really landed for people who already knew what a code editor was. I wanted the opposite: something that gets out of the way.',
      es: 'La v1 era antes una demo técnica que un portfolio. El marco de editor de código era la idea entera, y funcionaba, pero ponía una capa de interfaz entre quien visitaba y el trabajo en sí, y solo calaba de verdad en quien ya sabía lo que era un editor de código. Quería lo contrario: algo que se quite de en medio.',
      ca: "La v1 era abans una demo tècnica que un portfolio. El marc d'editor de codi era la idea sencera, i funcionava, però posava una capa d'interfície entre qui visitava i la feina en si, i només calava de debò en qui ja sabia què era un editor de codi. Volia el contrari: alguna cosa que s'aparti del mig.",
    },
    approach: {
      en: 'One typeface for everything — Courier Prime — and a layout built from hairline rules, index numbers and a single accent colour, so hierarchy comes from spacing and weight rather than decoration. Routing is file-based: a .vue file dropped into src/pages becomes a route and declares its own nav label and title. All the content lives in three data files, so adding a project or an album is one object, not a new component.',
      es: 'Una sola tipografía para todo —Courier Prime— y una maquetación hecha de filetes finos, numeración y un único color de acento, para que la jerarquía venga del espaciado y del peso en vez de la decoración. El enrutado es por archivos: un .vue en src/pages se convierte en una ruta y declara su propia etiqueta de navegación y su título. Todo el contenido vive en tres archivos de datos, así que añadir un proyecto o un álbum es un objeto, no un componente nuevo.',
      ca: "Una sola tipografia per a tot —Courier Prime— i una maquetació feta de filets fins, numeració i un únic color d'accent, perquè la jerarquia vingui de l'espaiat i del pes en lloc de la decoració. L'encaminament és per fitxers: un .vue a src/pages es converteix en una ruta i declara la seva pròpia etiqueta de navegació i el seu títol. Tot el contingut viu en tres fitxers de dades, així que afegir un projecte o un àlbum és un objecte, no un component nou.",
    },
    outcome: {
      en: 'Six routes, three languages and a third less JavaScript than v1. Language follows the domain — .cat opens in Catalan, .es in Spanish, .com in English — and the theme follows the operating system until you override it. The live parts survived the rewrite: GitHub stats, Spotify now playing, and the Cloudflare R2 gallery.',
      es: 'Seis rutas, tres idiomas y un tercio menos de JavaScript que la v1. El idioma sigue al dominio —.cat abre en catalán, .es en castellano, .com en inglés— y el tema sigue al sistema operativo hasta que lo cambias. Las partes en vivo sobrevivieron a la reescritura: estadísticas de GitHub, Spotify sonando ahora y la galería de Cloudflare R2.',
      ca: "Sis rutes, tres idiomes i un terç menys de JavaScript que la v1. L'idioma segueix el domini —.cat obre en català, .es en castellà, .com en anglès— i el tema segueix el sistema operatiu fins que el canvies. Les parts en directe van sobreviure a la reescriptura: estadístiques de GitHub, Spotify sonant ara i la galeria de Cloudflare R2.",
    },
    learnings: {
      en: [
        'Domain-based language detection is three lines of code and removes an entire decision from the visitor. It should be the default, not the fallback.',
        "Keeping translations next to the content instead of in a separate catalogue kept 'add a project' a one-file job — the thing that made v1 pleasant to maintain.",
        "Monospace forces honesty about hierarchy. With one weight axis and no display face to hide behind, anything that isn't earning its place is obvious.",
      ],
      es: [
        'La detección de idioma por dominio son tres líneas de código y le quita al visitante una decisión entera. Debería ser lo normal, no el recurso de última hora.',
        "Poner las traducciones junto al contenido en lugar de en un catálogo aparte mantuvo 'añadir un proyecto' como un trabajo de un solo archivo, que es lo que hacía agradable mantener la v1.",
        'El monoespaciado obliga a ser honesto con la jerarquía. Con un solo eje de peso y sin tipografía de titulares tras la que esconderse, lo que no se gana su sitio canta.',
      ],
      ca: [
        "La detecció d'idioma per domini són tres línies de codi i li treu al visitant una decisió sencera. Hauria de ser el normal, no el recurs d'última hora.",
        "Posar les traduccions al costat del contingut en lloc d'en un catàleg a part va mantenir 'afegir un projecte' com una feina d'un sol fitxer, que és el que feia agradable mantenir la v1.",
        "El monoespaiat obliga a ser honest amb la jerarquia. Amb un sol eix de pes i sense tipografia de titulars darrere la qual amagar-se, el que no es guanya el seu lloc canta.",
      ],
    },
    metrics: [
      { label: { en: 'Bundle', es: 'Bundle', ca: 'Bundle' }, value: '61 kB gz' },
      { label: { en: 'Languages', es: 'Idiomas', ca: 'Idiomes' }, value: '3' },
      { label: { en: 'Runtime deps', es: 'Dependencias', ca: 'Dependències' }, value: '2' },
    ],
  },
  {
    slug: 'git-viewer',
    title: 'Git Viewer',
    tech: ['Tauri', 'Rust', 'React', 'TypeScript'],
    github: 'https://github.com/Jordiop/git-viewer',
    featured: true,
    finished: false,
    year: 2026,
    role: {
      en: 'Solo build',
      es: 'Proyecto en solitario',
      ca: 'Projecte en solitari',
    },
    description: {
      en: 'A standalone desktop app that scans a folder tree for git repositories and gives you a VSCode-style Source Control panel — status, staged and unstaged diffs, commit, fetch, pull, push and branch switching — without running an editor.',
      es: 'Una aplicación de escritorio independiente que rastrea un árbol de carpetas en busca de repositorios git y ofrece un panel de control de versiones al estilo de VSCode: estado, diffs preparados y sin preparar, commit, fetch, pull, push y cambio de rama, sin tener que abrir un editor.',
      ca: "Una aplicació d'escriptori independent que rastreja un arbre de carpetes buscant repositoris git i ofereix un panell de control de versions a l'estil de VSCode: estat, diffs preparats i sense preparar, commit, fetch, pull, push i canvi de branca, sense haver d'obrir un editor.",
    },
    problem: {
      en: "I was tired of depending on each text editor's own implementation of git. I like the way VSCode handles it, but I don't want to run a full, bloated editor just to manage my repositories — especially now that they are all piling on agentic features with no real way to make them disappear.",
      es: 'Estaba cansado de depender de la implementación de git de cada editor de texto. Me gusta cómo lo maneja VSCode, pero no quiero abrir un editor entero y pesado solo para gestionar mis repositorios, y menos ahora que todos amontonan funciones agénticas sin una forma real de quitarlas de en medio.',
      ca: "Estava cansat de dependre de la implementació de git de cada editor de text. M'agrada com ho gestiona VSCode, però no vull obrir un editor sencer i pesat només per gestionar els meus repositoris, i menys ara que tots amunteguen funcions agèntiques sense una manera real de treure-les del mig.",
    },
    approach: {
      en: 'Tauri with a Rust core for the git operations and filesystem scanning, and a React + shadcn/ui front end for the interface. Diffs are rendered with the Monaco diff editor, so the part everyone actually looks at behaves exactly like the editor it is replacing.',
      es: 'Tauri con un núcleo en Rust para las operaciones de git y el rastreo del sistema de archivos, y un front de React + shadcn/ui para la interfaz. Los diffs se muestran con el editor de diffs de Monaco, así que la parte que todo el mundo mira de verdad se comporta igual que el editor al que sustituye.',
      ca: "Tauri amb un nucli en Rust per a les operacions de git i el rastreig del sistema de fitxers, i un front de React + shadcn/ui per a la interfície. Els diffs es mostren amb l'editor de diffs de Monaco, així que la part que tothom mira de debò es comporta igual que l'editor al qual substitueix.",
    },
  },
  {
    slug: 'forza-telemetry',
    title: 'Forza Telemetry',
    tech: ['Nuxt', 'Vue', 'TypeScript', 'PostgreSQL', 'Docker'],
    github: 'https://github.com/Jordiop/forza-telemetry',
    featured: true,
    finished: true,
    year: 2026,
    role: {
      en: 'Solo build',
      es: 'Proyecto en solitario',
      ca: 'Projecte en solitari',
    },
    description: {
      en: "Records Forza Horizon's UDP telemetry into Postgres and renders it as a dashboard — a live HUD while you drive, plus session history with synchronised charts and a track map coloured by speed. One Nuxt app, no second process.",
      es: 'Registra la telemetría UDP de Forza Horizon en Postgres y la muestra como un panel: un HUD en directo mientras conduces, más el historial de sesiones con gráficas sincronizadas y un mapa del circuito coloreado por velocidad. Una sola app de Nuxt, sin un segundo proceso.',
      ca: "Registra la telemetria UDP de Forza Horizon a Postgres i la mostra com un tauler: un HUD en directe mentre condueixes, més l'historial de sessions amb gràfiques sincronitzades i un mapa del circuit acolorit per velocitat. Una sola app de Nuxt, sense un segon procés.",
    },
    approach: {
      en: 'Forza broadcasts a fixed binary struct over UDP at around 60 Hz through its built-in "Data Out" feature — no game modding and no memory reading. The app listens for that stream, parses it, stores it and draws it. The UDP listener runs inside the Nuxt server itself, so arming a recording from the dashboard takes effect on the very next packet, and the live HUD streams over SSE without any recording running at all.',
      es: 'Forza emite una estructura binaria fija por UDP a unos 60 Hz mediante su función integrada "Data Out": sin modificar el juego y sin leer memoria. La app escucha ese flujo, lo parsea, lo guarda y lo dibuja. El receptor UDP corre dentro del propio servidor de Nuxt, así que activar una grabación desde el panel surte efecto en el siguiente paquete, y el HUD en directo se transmite por SSE sin necesidad de estar grabando.',
      ca: 'Forza emet una estructura binària fixa per UDP a uns 60 Hz mitjançant la seva funció integrada "Data Out": sense modificar el joc i sense llegir memòria. L\'app escolta aquest flux, el parseja, el desa i el dibuixa. El receptor UDP corre dins del mateix servidor de Nuxt, així que activar un enregistrament des del tauler té efecte al paquet següent, i el HUD en directe es transmet per SSE sense necessitat d\'estar enregistrant.',
    },
  },
  {
    slug: 'card-forge',
    title: 'Card Forge',
    tech: ['React', 'TypeScript', 'Vite', 'Canvas'],
    github: 'https://github.com/Jordiop/card-generator',
    demo: 'https://card-generator-rosy.vercel.app',
    featured: false,
    finished: true,
    year: 2026,
    role: {
      en: 'Solo build',
      es: 'Proyecto en solitario',
      ca: 'Projecte en solitari',
    },
    description: {
      en: 'A trading card generator in the style of Pokémon cards. Feed it an image, a description and some attributes, then export the card as a PNG. Everything runs in the browser — nothing is uploaded and there is no server.',
      es: 'Un generador de cartas coleccionables al estilo de las cartas de Pokémon. Le das una imagen, una descripción y unos atributos, y exportas la carta como PNG. Todo funciona en el navegador: no se sube nada y no hay servidor.',
      ca: 'Un generador de cartes col·leccionables a l\'estil de les cartes de Pokémon. Li dones una imatge, una descripció i uns atributs, i exportes la carta com a PNG. Tot funciona al navegador: no es puja res i no hi ha servidor.',
    },
    approach: {
      en: 'A Vite + React + TypeScript app with a shadcn/ui interface. The card itself is drawn on a canvas, which keeps it independent of the surrounding theme — the UI has pure-white and pure-black modes that follow the OS by default, but exports look identical either way.',
      es: 'Una app de Vite + React + TypeScript con interfaz de shadcn/ui. La carta se dibuja sobre un canvas, lo que la mantiene independiente del tema que la rodea: la interfaz tiene modos de blanco puro y negro puro que siguen al sistema operativo por defecto, pero las exportaciones se ven idénticas en ambos casos.',
      ca: "Una app de Vite + React + TypeScript amb interfície de shadcn/ui. La carta es dibuixa sobre un canvas, cosa que la manté independent del tema del voltant: la interfície té modes de blanc pur i negre pur que segueixen el sistema operatiu per defecte, però les exportacions es veuen idèntiques en tots dos casos.",
    },
  },
  {
    slug: 'portfolio-v1',
    title: 'Portfolio v1',
    tech: ['Vue 3', 'TypeScript', 'Tailwind CSS', 'Vite'],
    github: 'https://github.com/Jordiop/portfolio',
    demo: 'https://old.jordiop.com',
    featured: false,
    finished: true,
    year: 2025,
    description: {
      en: 'The first version, now archived at old.jordiop.com and old.jordiop.es. A portfolio built around an original code-editor design — command palette, tabbed file bar, and a split pane rendering each page as syntax-highlighted source. Vue 3, TypeScript and Tailwind CSS.',
      es: 'La primera versión, ahora archivada en old.jordiop.es y old.jordiop.com. Un portfolio construido alrededor de un diseño original de editor de código: paleta de comandos, barra de pestañas y un panel dividido que muestra cada página como código resaltado. Vue 3, TypeScript y Tailwind CSS.',
      ca: "La primera versió, ara arxivada a old.jordiop.es i old.jordiop.com. Un portfolio construït al voltant d'un disseny original d'editor de codi: paleta d'ordres, barra de pestanyes i un panell dividit que mostra cada pàgina com a codi ressaltat. Vue 3, TypeScript i Tailwind CSS.",
    },
    role: {
      en: 'Solo build',
      es: 'Proyecto en solitario',
      ca: 'Projecte en solitari',
    },
    durationLabel: { en: 'Ongoing', es: 'En curso', ca: 'En curs' },
    problem: {
      en: "Most developer portfolios look the same: a hero, a project grid, a contact form. I wanted a portfolio that signaled what I actually do all day — write Vue and TypeScript inside a code editor — without sacrificing legibility for visitors who aren't developers.",
      es: 'La mayoría de portfolios de desarrollador son iguales: una cabecera, una rejilla de proyectos, un formulario de contacto. Quería un portfolio que mostrara lo que realmente hago cada día —escribir Vue y TypeScript dentro de un editor de código— sin sacrificar la legibilidad para quien lo visita sin ser desarrollador.',
      ca: "La majoria de portfolios de desenvolupador són iguals: una capçalera, una graella de projectes, un formulari de contacte. Volia un portfolio que mostrés el que realment faig cada dia —escriure Vue i TypeScript dins d'un editor de codi— sense sacrificar la llegibilitat per a qui el visita sense ser desenvolupador.",
    },
    approach: {
      en: "I framed the entire UI as a fake code editor: a sidebar of icons, a tabbed file bar, and a split pane where the left side renders the page's source as syntax-highlighted text and the right side renders the actual preview. Every page is a real Vue route, but the code shown next to it is generated from the same data that drives the preview, so they can never drift. Cmd/Ctrl+B hides the code pane for visitors who'd rather just read.",
      es: 'Planteé toda la interfaz como un editor de código falso: una barra lateral de iconos, una barra de pestañas y un panel dividido donde la izquierda muestra el código de la página resaltado y la derecha muestra la vista real. Cada página es una ruta de Vue real, pero el código que aparece al lado se genera a partir de los mismos datos que alimentan la vista, así que nunca pueden desincronizarse. Cmd/Ctrl+B oculta el panel de código para quien prefiera solo leer.',
      ca: "Vaig plantejar tota la interfície com un editor de codi fals: una barra lateral d'icones, una barra de pestanyes i un panell dividit on l'esquerra mostra el codi de la pàgina ressaltat i la dreta mostra la vista real. Cada pàgina és una ruta de Vue real, però el codi que apareix al costat es genera a partir de les mateixes dades que alimenten la vista, així que mai es poden desincronitzar. Cmd/Ctrl+B amaga el panell de codi per a qui prefereixi només llegir.",
    },
    outcome: {
      en: 'A portfolio that doubles as a tech demo. Visitors see live Vue 3 + Tailwind v4 + Vite working in front of them, with a command palette, dark mode, mobile liquid-glass nav, a Spotify Now Playing widget, and a Cloudflare R2-backed photo gallery. All routes render in under 200ms on dev hardware.',
      es: 'Un portfolio que también funciona como demo técnica. Quien lo visita ve Vue 3 + Tailwind v4 + Vite funcionando en directo, con paleta de comandos, modo oscuro, navegación móvil de cristal líquido, un widget de Spotify y una galería de fotos servida desde Cloudflare R2. Todas las rutas se renderizan en menos de 200 ms en hardware de desarrollo.',
      ca: "Un portfolio que també funciona com a demo tècnica. Qui el visita veu Vue 3 + Tailwind v4 + Vite funcionant en directe, amb paleta d'ordres, mode fosc, navegació mòbil de vidre líquid, un widget de Spotify i una galeria de fotos servida des de Cloudflare R2. Totes les rutes es renderitzen en menys de 200 ms en maquinari de desenvolupament.",
    },
    learnings: {
      en: [
        'Generating syntax-highlighted code from structured data beats maintaining two parallel sources of truth.',
        'A command palette pays for itself the first time you demo the site to someone — keyboard-driven nav is genuinely faster.',
        "Tailwind v4's CSS-variable-driven theming made the dark mode toggle a 5-line change instead of a refactor.",
      ],
      es: [
        'Generar el código resaltado a partir de datos estructurados es mejor que mantener dos fuentes de verdad en paralelo.',
        'Una paleta de comandos se amortiza la primera vez que enseñas la web a alguien: navegar con el teclado es realmente más rápido.',
        'El tema basado en variables CSS de Tailwind v4 convirtió el modo oscuro en un cambio de 5 líneas en vez de una refactorización.',
      ],
      ca: [
        'Generar el codi ressaltat a partir de dades estructurades és millor que mantenir dues fonts de veritat en paral·lel.',
        "Una paleta d'ordres s'amortitza la primera vegada que ensenyes el web a algú: navegar amb el teclat és realment més ràpid.",
        'El tema basat en variables CSS de Tailwind v4 va convertir el mode fosc en un canvi de 5 línies en lloc d\'una refactorització.',
      ],
    },
    metrics: [
      { label: 'Lighthouse', value: '98' },
      { label: { en: 'Routes', es: 'Rutas', ca: 'Rutes' }, value: '6' },
      { label: { en: 'First paint', es: 'Primer pintado', ca: 'Primer pintat' }, value: '<300ms' },
    ],
  },
  {
    slug: 'mood-tracker',
    title: 'Mood Tracker',
    tech: ['Vue.js', 'Laravel', 'Supabase'],
    github: 'https://github.com/Jordiop/mood-tracker',
    demo: 'https://mood.jordiop.es',
    featured: false,
    finished: true,
    year: 2024,
    description: {
      en: 'A simple and intuitive mood tracking app that helps users monitor their emotional well-being over time, featuring daily logs and insightful analytics.',
      es: 'Una aplicación sencilla e intuitiva para registrar el estado de ánimo y seguir el bienestar emocional a lo largo del tiempo, con registros diarios y analíticas útiles.',
      ca: "Una aplicació senzilla i intuïtiva per registrar l'estat d'ànim i seguir el benestar emocional al llarg del temps, amb registres diaris i analítiques útils.",
    },
    role: {
      en: 'Solo build',
      es: 'Proyecto en solitario',
      ca: 'Projecte en solitari',
    },
    durationLabel: { en: '3 weeks', es: '3 semanas', ca: '3 setmanes' },
    problem: {
      en: 'Off-the-shelf mood tracking apps either drown the user in features or lock the data behind a paywall. I wanted something that took ten seconds a day to use, kept the data in a Postgres I controlled, and turned a month of logs into something I could actually look at.',
      es: 'Las apps de seguimiento del ánimo que hay o ahogan al usuario en funciones o esconden los datos tras un muro de pago. Quería algo que costara diez segundos al día, que guardara los datos en un Postgres bajo mi control y que convirtiera un mes de registros en algo que se pudiera mirar de verdad.',
      ca: "Les apps de seguiment de l'ànim que hi ha o ofeguen l'usuari amb funcions o amaguen les dades darrere d'un mur de pagament. Volia una cosa que costés deu segons al dia, que guardés les dades en un Postgres sota el meu control i que convertís un mes de registres en alguna cosa que es pogués mirar de debò.",
    },
    approach: {
      en: 'Vue on the front for the daily log UI, Laravel as the API layer (auth, validation, aggregation queries), and Supabase for managed Postgres + auth. The daily log is a single screen — emoji picker, optional note, save. The analytics view rolls 30 days of entries into a heatmap and a trend line so patterns show up without scrolling.',
      es: 'Vue en el front para la interfaz del registro diario, Laravel como capa de API (autenticación, validación, consultas de agregación) y Supabase para Postgres gestionado y autenticación. El registro diario es una sola pantalla: selector de emoji, nota opcional, guardar. La vista de analíticas agrupa 30 días de entradas en un mapa de calor y una línea de tendencia para que los patrones se vean sin hacer scroll.',
      ca: "Vue al front per a la interfície del registre diari, Laravel com a capa d'API (autenticació, validació, consultes d'agregació) i Supabase per a Postgres gestionat i autenticació. El registre diari és una sola pantalla: selector d'emoji, nota opcional, desar. La vista d'analítiques agrupa 30 dies d'entrades en un mapa de calor i una línia de tendència perquè els patrons es vegin sense fer scroll.",
    },
    outcome: {
      en: 'Used it daily for several months. The 10-second log target held — I never skipped a day because of friction. The monthly heatmap surfaced a sleep-mood correlation that would not have been obvious from individual entries.',
      es: 'Lo usé a diario durante varios meses. El objetivo de los 10 segundos se mantuvo: nunca me salté un día por fricción. El mapa de calor mensual sacó a la luz una correlación entre sueño y ánimo que no habría sido evidente mirando entradas sueltas.',
      ca: "El vaig fer servir diàriament durant uns quants mesos. L'objectiu dels 10 segons es va mantenir: mai vaig saltar-me un dia per fricció. El mapa de calor mensual va treure a la llum una correlació entre son i ànim que no hauria estat evident mirant entrades soltes.",
    },
    learnings: {
      en: [
        'Splitting auth (Supabase) from business logic (Laravel) was overkill for a solo app — one of them could have done both.',
        'The hardest part was not the tracking, it was designing the analytics view so a glance gave you something useful.',
        'Daily-streak gamification was tempting but I left it out. Tracking should serve the user, not retain them.',
      ],
      es: [
        'Separar la autenticación (Supabase) de la lógica de negocio (Laravel) fue excesivo para una app en solitario: cualquiera de los dos podría haber hecho ambas cosas.',
        'Lo más difícil no fue el registro, sino diseñar la vista de analíticas para que un vistazo te diera algo útil.',
        'La gamificación por rachas diarias era tentadora, pero la dejé fuera. El registro debe servir al usuario, no retenerlo.',
      ],
      ca: [
        "Separar l'autenticació (Supabase) de la lògica de negoci (Laravel) va ser excessiu per a una app en solitari: qualsevol dels dos hauria pogut fer les dues coses.",
        'El més difícil no va ser el registre, sinó dissenyar la vista d\'analítiques perquè una ullada et donés alguna cosa útil.',
        "La gamificació per ratxes diàries era temptadora, però la vaig deixar fora. El registre ha de servir l'usuari, no retenir-lo.",
      ],
    },
    metrics: [
      { label: { en: 'Time per log', es: 'Tiempo por registro', ca: 'Temps per registre' }, value: '<10s' },
      { label: 'Stack', value: 'Vue + Laravel' },
      {
        label: { en: 'Daily users', es: 'Usuarios diarios', ca: 'Usuaris diaris' },
        value: { en: '1 (me)', es: '1 (yo)', ca: '1 (jo)' },
      },
    ],
  },
  {
    slug: 'newtab-extension',
    title: 'Newtab Extension',
    tech: ['HTML', 'CSS', 'JavaScript', 'Chrome API'],
    github: 'https://github.com/Jordiop/newtab',
    featured: false,
    finished: true,
    year: 2024,
    description: {
      en: 'A minimalist Chrome new tab extension that provides a clean, customizable interface for productivity and quick access to frequently used tools.',
      es: 'Una extensión minimalista para la nueva pestaña de Chrome que ofrece una interfaz limpia y personalizable para la productividad y el acceso rápido a las herramientas de uso frecuente.',
      ca: "Una extensió minimalista per a la nova pestanya de Chrome que ofereix una interfície neta i personalitzable per a la productivitat i l'accés ràpid a les eines d'ús freqüent.",
    },
  },
  {
    slug: 'weather-app',
    title: {
      en: 'Multiplatform Weather App',
      es: 'App del tiempo multiplataforma',
      ca: 'App del temps multiplataforma',
    },
    tech: ['Flutter', 'Dart', 'OpenWeatherMap API'],
    featured: false,
    finished: false,
    year: 2024,
    description: {
      en: 'A cross-platform weather application that delivers accurate forecasts and real-time updates, built using Flutter for a seamless experience on both iOS and Android devices.',
      es: 'Una aplicación del tiempo multiplataforma que ofrece previsiones precisas y actualizaciones en tiempo real, construida con Flutter para una experiencia fluida tanto en iOS como en Android.',
      ca: "Una aplicació del temps multiplataforma que ofereix previsions precises i actualitzacions en temps real, construïda amb Flutter per a una experiència fluida tant a iOS com a Android.",
    },
  },
]

export function findProject(slug) {
  return projects.find((project) => project.slug === slug) ?? null
}

export function featuredProjects() {
  return projects.filter((project) => project.featured)
}

export function siblings(slug) {
  const index = projects.findIndex((project) => project.slug === slug)
  if (index === -1) return { previous: null, next: null }
  return {
    previous: projects[index - 1] ?? null,
    next: projects[index + 1] ?? null,
  }
}
