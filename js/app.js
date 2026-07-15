const body = document.body;
const loader = document.querySelector('.page-loader');
const themeToggle = document.querySelector('.theme-toggle');
const savedTheme = localStorage.getItem('ricardo-theme');

if (savedTheme === 'light') {
  body.classList.add('theme-light');
}

window.addEventListener('load', () => {
  setTimeout(() => loader.classList.add('hidden'), 250);
});

themeToggle?.addEventListener('click', () => {
  body.classList.toggle('theme-light');
  localStorage.setItem('ricardo-theme', body.classList.contains('theme-light') ? 'light' : 'dark');
});

const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');
let mx = -100, my = -100, rx = -100, ry = -100;

if(dot && ring){
  window.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
  });

  function cursorLoop(){
    rx += (mx-rx)*.16;
    ry += (my-ry)*.16;
    ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(cursorLoop);
  }
  cursorLoop();
}

document.querySelectorAll('a,button,.featured-project').forEach(el => {
  el.addEventListener('mouseenter', () => body.classList.add('cursor-active'));
  el.addEventListener('mouseleave', () => body.classList.remove('cursor-active'));
});

const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
},{threshold:.12});
reveals.forEach(el => revealObserver.observe(el));

const themed = document.querySelectorAll('[data-bg]');
const themeClasses = ['bg-ecoalf','bg-ikks','bg-story','bg-journal'];
let activeBackground = '';
const bgObserver = new IntersectionObserver(entries => {
  const visible = entries
    .filter(entry => entry.isIntersecting)
    .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];

  if(!visible) return;
  const bg = visible.target.dataset.bg || '';
  if(bg === activeBackground) return;

  activeBackground = bg;
  themeClasses.forEach(cls => body.classList.remove(cls));
  if(['ecoalf','ikks','story','journal'].includes(bg)){
    requestAnimationFrame(() => body.classList.add(`bg-${bg}`));
  }
},{rootMargin:'-35% 0px -50% 0px',threshold:[0,.15,.35,.6]});
themed.forEach(el => bgObserver.observe(el));

let targetY = window.scrollY;
let currentY = window.scrollY;
let active = false;

function smoothLoop(){
  currentY += (targetY-currentY)*.11;
  if(Math.abs(targetY-currentY)<.4) currentY=targetY;
  window.scrollTo(0,currentY);
  active = Math.abs(targetY-currentY)>.4;
  if(active) requestAnimationFrame(smoothLoop);
}

window.addEventListener('wheel', e => {
  if(window.innerWidth<900) return;
  e.preventDefault();
  targetY = Math.max(0,Math.min(document.documentElement.scrollHeight-window.innerHeight,targetY+e.deltaY*.82));
  if(!active){active=true;requestAnimationFrame(smoothLoop)}
},{passive:false});

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target=document.querySelector(link.getAttribute('href'));
    if(!target) return;
    e.preventDefault();
    targetY=target.offsetTop;
    if(!active){active=true;requestAnimationFrame(smoothLoop)}
  });
});

document.querySelectorAll('.project-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    loader.classList.remove('hidden');
    loader.style.transform='translateY(0)';
    setTimeout(()=>window.location.href=link.href,650);
  });
});

const yearEl=document.getElementById('year');
if(yearEl) yearEl.textContent=new Date().getFullYear();

// Basic image-protection layer: blocks right-click-save and drag-save on photography.
// (No client-side method fully prevents screenshots/devtools — this deters casual downloads.)
document.addEventListener('contextmenu', e => {
  if(e.target.closest('.project-image,.full-image,.drawer-image,.protected-media')) e.preventDefault();
});
document.addEventListener('dragstart', e => {
  if(e.target.closest('.project-image,.full-image,.drawer-image,.protected-media')) e.preventDefault();
});


// Architectural background parallax.
// Desktop follows the pointer by only a few pixels.
// Mobile uses device orientation when permission is already available.
const lineLayer = document.querySelector('.construction-lines');
const vignette = document.querySelector('.ambient-vignette');

function setAmbientMotion(x, y){
  const px = Math.max(-1,Math.min(1,x));
  const py = Math.max(-1,Math.min(1,y));
  lineLayer?.style.setProperty('--line-x', `${px * 3}px`);
  lineLayer?.style.setProperty('--line-y', `${py * 3}px`);
  if(vignette){
    vignette.style.transform = `translate3d(${px * .8}px,${py * .8}px,0) scale(1.004)`;
  }
}

window.addEventListener('pointermove', event => {
  if(window.matchMedia('(pointer:coarse)').matches) return;
  const x = (event.clientX / window.innerWidth - .5) * 2;
  const y = (event.clientY / window.innerHeight - .5) * 2;
  setAmbientMotion(x,y);
},{passive:true});

window.addEventListener('deviceorientation', event => {
  if(event.gamma == null || event.beta == null) return;
  setAmbientMotion(event.gamma / 35,(event.beta - 45) / 45);
},{passive:true});

// Roman numeral reveal, deliberately slower than the normal content animation.
const romanObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('roman-visible');
      romanObserver.unobserve(entry.target);
    }
  });
},{threshold:.3});
document.querySelectorAll('.roman-reveal').forEach(el => romanObserver.observe(el));





const baseTranslations = {"en": {"navWork": "Work", "navMap": "Map", "navStory": "Story", "navJournal": "Journal", "navContact": "Contact", "themeToggle": "Switch colour mode", "heroEyebrow": "Retail design  Furniture  Technical development", "heroTitle": "I design what happens between the first idea and the finished space.", "heroBody": "I work across design, technical development and production. I enjoy understanding the whole project, from the first survey to the workshop and final installation.", "heroLink": "See selected work", "positionLabel": "Position", "positionText": "A drawing becomes useful when the client, workshop and installer can all read it without guessing what happens next.", "selectedWorkLabel": "Selected work", "selectedWorkTitle": "Projects grouped by the problems they solve", "ecoalfLabel": "Making retail projects buildable", "ecoalfTitle": "Ecoalf retail development across Spain and Portugal", "ecoalfBody": "Technical projects for permanent corners and temporary spaces in Vigo, Pozuelo, Marbella, Gaia and Lisbon.", "openCase": "Open case study", "observationLabel": "Observation 03", "observationText": "Reusing furniture is not a compromise when the new layout gives each piece a clearer purpose.", "ikksLabel": "Organising a temporary retail environment", "ikksTitle": "IKKS pop up in San Sebastián de los Reyes", "ikksBody": "A temporary store still needs permanent clarity. Plans, dimensions and elevations remove doubt before installation begins.", "continuousConversation": "Design, technical development and production should feel like one continuous conversation.", "japonLabel": "Building a visual system across formats", "japonTitle": "Japon Market 24h", "japonBody": "Store design, architectural drawings, visualisation, packaging, editorial work, social media and web content developed as one connected experience.", "builtWorkLabel": "Built work", "builtWorkTitle": "Places where the work became real", "builtWorkIntro": "This atlas follows the evolution of my work, from architectural drafting in Venezuela to residential design, retail identity and production-led projects across Spain and Portugal.", "stageAll": "All work", "stageFoundations": "Foundations", "stageResidential": "Residential design", "stageIdentity": "Retail identity", "stageProduction": "Retail production", "mapCountries": "Venezuela, Spain and Portugal", "mapCaption": "Selected built and developed work", "close": "Close", "closeProject": "Close project information", "selectProject": "Select a project location", "selectProjectText": "Choose a point on the map or an item from the index to see the work connected to that place.", "period": "Period", "type": "Type", "role": "Role", "projectImage": "Project image", "drawingDetail": "Drawing or detail", "imagesLater": "Images can be added here as the portfolio develops.", "location": "Location", "work": "Work", "stage": "Stage", "storyLabel": "How I ended up here", "storyTitle": "A professional story, not a timeline", "storyIntro": "I did not plan a career that moved between architecture, graphics, retail, production and furniture. It happened because each stage made me curious about the next one.", "story1Title": "Architecture taught me to think through drawings.", "story1Body": "I began in Venezuela, working with plans, models and visual presentations. It gave me the technical foundation that still supports the way I work.", "story2Title": "Moving to Spain made me more adaptable.", "story2Body": "I moved between interior design, graphic work and communication, learning how space and identity influence each other.", "story3Title": "Retail made every decision immediate.", "story3Body": "Circulation, stock, visibility, furniture, brand language and installation all have to work at the same time.", "story4Title": "The workshop changed the way I design.", "story4Body": "Working close to production made me think earlier about materials, thicknesses, transport, assembly and the people responsible for building the project.", "story5Title": "I am ready for a more international chapter.", "story5Body": "I am drawn to Germany and the Netherlands because of the way design, industry, craft and experimentation are connected.", "journalLabel": "Journal", "journalTitle": "Notes from the work", "journalIntro": "This is not a blog. It is a place to record the practical things that rarely appear in a finished portfolio.", "journalSurveyLabel": "Survey", "journalSurveyTitle": "How I document a retail survey", "journalReuseLabel": "Reuse", "journalReuseTitle": "Why existing furniture can improve a project", "journalInstallationLabel": "Installation", "journalInstallationTitle": "What I learned from overnight retail installations", "journalProductionLabel": "Production", "journalProductionTitle": "Five things I check before sending a project to production", "readNote": "Read note", "contactTitle": "I am open to good work, thoughtful teams and projects that deserve careful attention.", "locationFooter": "Gijón, Spain"}, "es": {"navWork": "Trabajo", "navMap": "Mapa", "navStory": "Historia", "navJournal": "Cuaderno", "navContact": "Contacto", "themeToggle": "Cambiar modo de color", "heroEyebrow": "Diseño retail  Mobiliario  Desarrollo técnico", "heroTitle": "Diseño lo que ocurre entre la primera idea y el espacio terminado.", "heroBody": "Trabajo entre el diseño, el desarrollo técnico y la producción, actualmente como diseñador en Maison Caligari. Me interesa comprender el proyecto completo, desde el primer levantamiento hasta el taller y el montaje final.", "heroLink": "Ver trabajos seleccionados", "positionLabel": "Enfoque", "positionText": "Un plano se vuelve útil cuando el cliente, el taller y el equipo de montaje pueden leerlo sin tener que adivinar qué ocurre después.", "selectedWorkLabel": "Trabajo seleccionado", "selectedWorkTitle": "Proyectos agrupados por los problemas que resuelven", "ecoalfLabel": "Convertir proyectos retail en soluciones construibles", "ecoalfTitle": "Desarrollo retail para Ecoalf en España y Portugal", "ecoalfBody": "Proyectos técnicos para corners permanentes y espacios temporales en Vigo, Pozuelo, Marbella, Gaia y Lisboa.", "openCase": "Abrir caso de estudio", "observationLabel": "Observación 03", "observationText": "Reutilizar mobiliario no es una concesión cuando la nueva distribución da a cada pieza una función más clara.", "ikksLabel": "Organizar un entorno retail temporal", "ikksTitle": "Pop up de IKKS en San Sebastián de los Reyes", "ikksBody": "Una tienda temporal también necesita claridad duradera. Los planos, cotas y alzados eliminan dudas antes de que empiece el montaje.", "continuousConversation": "El diseño, el desarrollo técnico y la producción deberían sentirse como una conversación continua.", "japonLabel": "Construir un sistema visual en distintos formatos", "japonTitle": "Japon Market 24h", "japonBody": "Diseño de tiendas, planos arquitectónicos, visualización, packaging, diseño editorial, redes sociales y contenido web desarrollados como una experiencia conectada.", "builtWorkLabel": "Trabajo realizado", "builtWorkTitle": "Lugares donde el trabajo se convirtió en realidad", "builtWorkIntro": "Este atlas recorre la evolución de mi trabajo, desde la delineación arquitectónica en Venezuela hasta el diseño residencial, la identidad retail y los proyectos vinculados a producción en España y Portugal.", "stageAll": "Todo el trabajo", "stageFoundations": "Inicios", "stageResidential": "Diseño residencial", "stageIdentity": "Identidad retail", "stageProduction": "Producción retail", "mapCountries": "Venezuela, España y Portugal", "mapCaption": "Selección de trabajos construidos y desarrollados", "close": "Cerrar", "closeProject": "Cerrar información del proyecto", "selectProject": "Selecciona una ubicación", "selectProjectText": "Elige un punto del mapa o un elemento del índice para ver el trabajo relacionado con ese lugar.", "period": "Periodo", "type": "Tipo", "role": "Rol", "projectImage": "Imagen del proyecto", "drawingDetail": "Plano o detalle", "imagesLater": "Aquí se podrán añadir imágenes a medida que avance el portfolio.", "location": "Ubicación", "work": "Trabajo", "stage": "Etapa", "storyLabel": "Cómo llegué hasta aquí", "storyTitle": "Una historia profesional, no una cronología", "storyIntro": "No planeé una carrera que pasara por la arquitectura, el diseño gráfico, el retail, la producción y el mobiliario. Ocurrió porque cada etapa despertó mi curiosidad por la siguiente.", "story1Title": "La arquitectura me enseñó a pensar mediante dibujos.", "story1Body": "Comencé en Venezuela trabajando con planos, modelos y presentaciones visuales. Esa etapa me dio la base técnica que todavía sostiene mi forma de trabajar.", "story2Title": "Mudarse a España me hizo más adaptable.", "story2Body": "Pasé por el interiorismo, el diseño gráfico y la comunicación, aprendiendo cómo el espacio y la identidad se influyen mutuamente.", "story3Title": "El retail hizo que cada decisión fuese inmediata.", "story3Body": "La circulación, el producto, la visibilidad, el mobiliario, la identidad de marca y el montaje tienen que funcionar al mismo tiempo.", "story4Title": "El taller cambió mi forma de diseñar.", "story4Body": "Trabajar cerca de producción me llevó a pensar antes en materiales, espesores, transporte, montaje y en las personas responsables de construir el proyecto.", "story5Title": "Estoy preparado para una etapa más internacional.", "story5Body": "Me atraen Alemania y los Países Bajos por la forma en que conectan diseño, industria, oficio y experimentación.", "journalLabel": "Cuaderno", "journalTitle": "Notas desde el trabajo", "journalIntro": "No es un blog. Es un lugar donde registrar las cuestiones prácticas que rara vez aparecen en un portfolio terminado.", "journalSurveyLabel": "Levantamiento", "journalSurveyTitle": "Cómo documento un levantamiento retail", "journalReuseLabel": "Reutilización", "journalReuseTitle": "Por qué el mobiliario existente puede mejorar un proyecto", "journalInstallationLabel": "Montaje", "journalInstallationTitle": "Lo que aprendí coordinando montajes nocturnos", "journalProductionLabel": "Producción", "journalProductionTitle": "Cinco cosas que reviso antes de enviar un proyecto a producción", "readNote": "Leer nota", "contactTitle": "Estoy abierto a buenos proyectos, equipos cuidadosos y trabajos que merezcan atención.", "locationFooter": "Gijón, España"}};
const localizedProjectData = {"es": {"venezuela": {"title": "Venezuela", "summary": "El inicio de mi carrera, centrado en delineación arquitectónica, modelado 3D y visualización.", "period": "2015 a 2017", "type": "Delineación arquitectónica", "role": "Delineación, modelado y visualización"}, "gijon-residential": {"title": "Gijón", "summary": "Tres viviendas unifamiliares privadas desarrolladas durante mi etapa de diseño residencial.", "period": "2018 a 2020", "type": "Residencial privado", "role": "Diseño arquitectónico e interior"}, "oviedo-residential": {"title": "Oviedo", "summary": "Dos viviendas unifamiliares privadas desarrolladas para clientes en Asturias.", "period": "2018 a 2020", "type": "Residencial privado", "role": "Diseño arquitectónico e interior"}, "langreo": {"title": "Langreo", "summary": "Vivienda unifamiliar privada desarrollada durante mi etapa de diseño residencial en Asturias.", "period": "2018 a 2020", "type": "Residencial privado", "role": "Diseño arquitectónico"}, "laviana": {"title": "Pola de Laviana", "summary": "Diseño de una vivienda privada. La fase de ejecución fue gestionada por el equipo de obra.", "period": "2018 a 2020", "type": "Residencial privado", "role": "Desarrollo de diseño"}, "regueras": {"title": "Las Regueras, Tahoces", "summary": "Vivienda unifamiliar privada desarrollada en un contexto rural de Asturias.", "period": "2018 a 2020", "type": "Residencial privado", "role": "Diseño arquitectónico"}, "coruna-commercial": {"title": "A Coruña", "summary": "Proyecto de adecuación comercial desarrollado durante mi etapa en Innova y Mejora.", "period": "2018 a 2020", "type": "Adecuación comercial", "role": "Diseño interior y técnico"}, "automatic-stores": {"title": "España", "summary": "Diseño visual para más de 70 tiendas automáticas, acompañado de trabajos de branding, packaging y comunicación.", "period": "2020 a 2024", "type": "Red de retail automatizado", "role": "Branding, packaging y sistemas visuales"}, "japon-gijon": {"title": "Gijón", "summary": "Diseño de tienda e identidad visual para Japon Market 24h.", "period": "2020 a 2024", "type": "Identidad retail", "role": "Diseño interior, gráfico y de marca"}, "japon-oviedo": {"title": "Oviedo", "summary": "Diseño de tienda e identidad visual para Japon Market 24h.", "period": "2020 a 2024", "type": "Identidad retail", "role": "Diseño interior, gráfico y de marca"}, "japon-aviles": {"title": "Avilés", "summary": "Diseño de tienda e identidad visual para Japon Market 24h.", "period": "2020 a 2024", "type": "Identidad retail", "role": "Diseño interior, gráfico y de marca"}, "japon-lugo": {"title": "Lugo", "summary": "Diseño de tienda e identidad visual para Japon Market 24h.", "period": "2020 a 2024", "type": "Identidad retail", "role": "Diseño interior, gráfico y de marca"}, "japon-madrid": {"title": "Móstoles, Madrid", "summary": "Diseño de tienda e identidad visual para Japon Market 24h.", "period": "2020 a 2024", "type": "Identidad retail", "role": "Diseño interior, gráfico y de marca"}, "japon-las-palmas": {"title": "Las Palmas de Gran Canaria", "summary": "Diseño de tienda e identidad visual para Japon Market 24h.", "period": "2020 a 2024", "type": "Identidad retail", "role": "Diseño interior, gráfico y de marca"}, "japon-tenerife": {"title": "Tenerife", "summary": "Diseño de tienda e identidad visual para Japon Market 24h.", "period": "2020 a 2024", "type": "Identidad retail", "role": "Diseño interior, gráfico y de marca"}, "ecoalf-vigo": {"title": "Vigo", "summary": "Ecoalf Man y Woman en El Corte Inglés.", "period": "2025 a 2026", "type": "Retail de moda", "role": "Diseño, desarrollo técnico, compras y coordinación de montaje"}, "ecoalf-alicante": {"title": "Alicante", "summary": "Pop up de Ecoalf Woman en El Corte Inglés Alicante.", "period": "2025 a 2026", "type": "Retail de moda", "role": "Diseño, desarrollo técnico, compras y coordinación de montaje"}, "ecoalf-zaragoza": {"title": "Zaragoza", "summary": "Ecoalf Man y Woman en El Corte Inglés.", "period": "2025 a 2026", "type": "Retail de moda", "role": "Diseño, desarrollo técnico, compras y coordinación de montaje"}, "ecoalf-murcia": {"title": "Murcia", "summary": "Ecoalf Woman en El Corte Inglés Murcia.", "period": "2025 a 2026", "type": "Retail de moda", "role": "Diseño, desarrollo técnico, compras y coordinación de montaje"}, "ecoalf-pozuelo": {"title": "Pozuelo, Madrid", "summary": "Ecoalf Man en El Corte Inglés Pozuelo.", "period": "2025 a 2026", "type": "Retail de moda", "role": "Diseño, desarrollo técnico, compras y coordinación de montaje"}, "ecoalf-salamanca": {"title": "Salamanca", "summary": "Ecoalf Woman en El Corte Inglés Salamanca.", "period": "2025 a 2026", "type": "Retail de moda", "role": "Diseño, desarrollo técnico, compras y coordinación de montaje"}, "ecoalf-burgos": {"title": "Burgos", "summary": "Ecoalf Man y Woman en El Corte Inglés Burgos.", "period": "2025 a 2026", "type": "Retail de moda", "role": "Diseño, desarrollo técnico, compras y coordinación de montaje"}, "ecoalf-lisbon": {"title": "Lisboa", "summary": "Ecoalf Man y Woman en El Corte Inglés Lisboa.", "period": "2025 a 2026", "type": "Retail de moda", "role": "Diseño, desarrollo técnico, compras y coordinación de montaje"}, "ecoalf-gaia": {"title": "Vila Nova de Gaia", "summary": "Ecoalf Man y Woman en El Corte Inglés Gaia.", "period": "2025 a 2026", "type": "Retail de moda", "role": "Diseño, desarrollo técnico, compras y coordinación de montaje"}, "ecoalf-valderas": {"title": "San José de Valderas, Madrid", "summary": "Ecoalf Man en El Corte Inglés San José de Valderas.", "period": "2025 a 2026", "type": "Retail de moda", "role": "Diseño, desarrollo técnico, compras y coordinación de montaje"}, "ecoalf-barcelona": {"title": "Barcelona", "summary": "Ecoalf Man en El Corte Inglés Diagonal.", "period": "2025 a 2026", "type": "Retail de moda", "role": "Diseño, desarrollo técnico, compras y coordinación de montaje"}, "ecoalf-tarragona": {"title": "Tarragona", "summary": "Ecoalf Man en El Corte Inglés Tarragona.", "period": "2025 a 2026", "type": "Retail de moda", "role": "Diseño, desarrollo técnico, compras y coordinación de montaje"}, "ecoalf-sanchinarro": {"title": "Sanchinarro, Madrid", "summary": "Ecoalf Man en El Corte Inglés Sanchinarro.", "period": "2025 a 2026", "type": "Retail de moda", "role": "Diseño, desarrollo técnico, compras y coordinación de montaje"}, "ecoalf-marbella": {"title": "Marbella", "summary": "Ecoalf Woman en El Corte Inglés Marbella.", "period": "2025 a 2026", "type": "Retail de moda", "role": "Diseño, desarrollo técnico, compras y coordinación de montaje"}}};

const translations = {
  en: {...baseTranslations.en, ...(window.pageTranslations?.en || {})},
  es: {...baseTranslations.es, ...(window.pageTranslations?.es || {})}
};

let currentLanguage = localStorage.getItem('ricardo-language') || 'en';

function applyLanguage(language){
  currentLanguage = language;
  document.documentElement.lang = language;
  localStorage.setItem('ricardo-language', language);

  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.dataset.i18n;
    const value = translations[language]?.[key];
    if(value) element.textContent = value;
  });

  document.querySelectorAll('[data-i18n-aria]').forEach(element => {
    const key = element.dataset.i18nAria;
    const value = translations[language]?.[key];
    if(value) element.setAttribute('aria-label', value);
  });

  document.querySelectorAll('.language-button').forEach(button => {
    button.classList.toggle('active', button.dataset.language === language);
  });

  if(typeof refreshAtlasLanguage === 'function') refreshAtlasLanguage();
}

document.querySelectorAll('.language-button').forEach(button => {
  button.addEventListener('click', () => applyLanguage(button.dataset.language));
});

applyLanguage(currentLanguage);

// Built Work Atlas
const atlasElement = document.getElementById('project-map');

if(atlasElement && window.L){
  const projectData = {"venezuela": {"coords": [10.4806, -66.9036], "stage": "foundations", "number": "I", "title": "Venezuela", "summary": "The beginning of my career, focused on architectural drafting, 3D modelling and visualisation.", "period": "2015 to 2017", "type": "Architectural drafting", "role": "Drafting, modelling and visualisation"}, "gijon-residential": {"coords": [43.5322, -5.6611], "stage": "residential", "number": "II", "title": "Gijón", "summary": "Three private single-family homes developed during my residential design stage.", "period": "2018 to 2020", "type": "Private residential", "role": "Architectural and interior design"}, "oviedo-residential": {"coords": [43.3614, -5.8494], "stage": "residential", "number": "III", "title": "Oviedo", "summary": "Two private single-family homes developed for clients in Asturias.", "period": "2018 to 2020", "type": "Private residential", "role": "Architectural and interior design"}, "langreo": {"coords": [43.3083, -5.6944], "stage": "residential", "number": "IV", "title": "Langreo", "summary": "A private single-family home developed as part of my residential design work in Asturias.", "period": "2018 to 2020", "type": "Private residential", "role": "Architectural design"}, "laviana": {"coords": [43.2456, -5.5627], "stage": "residential", "number": "V", "title": "Pola de Laviana", "summary": "Design work for a private home. The construction phase was handled by the site team.", "period": "2018 to 2020", "type": "Private residential", "role": "Design development"}, "regueras": {"coords": [43.4148, -5.9708], "stage": "residential", "number": "VI", "title": "Las Regueras, Tahoces", "summary": "Private single-family home developed in a rural context in Asturias.", "period": "2018 to 2020", "type": "Private residential", "role": "Architectural design"}, "coruna-commercial": {"coords": [43.3623, -8.4115], "stage": "residential", "number": "VII", "title": "A Coruña", "summary": "Commercial refurbishment project developed during my time at Innova y Mejora.", "period": "2018 to 2020", "type": "Commercial refurbishment", "role": "Interior and technical design"}, "japon-gijon": {"coords": [43.5322, -5.6611], "stage": "identity", "number": "I", "title": "Gijón", "summary": "Store design and visual identity for Japon Market 24h.", "period": "2020 to 2024", "type": "Retail identity", "role": "Interior, graphic and brand design"}, "japon-oviedo": {"coords": [43.3614, -5.8494], "stage": "identity", "number": "II", "title": "Oviedo", "summary": "Store design and visual identity for Japon Market 24h.", "period": "2020 to 2024", "type": "Retail identity", "role": "Interior, graphic and brand design"}, "japon-aviles": {"coords": [43.556, -5.9248], "stage": "identity", "number": "III", "title": "Avilés", "summary": "Store design and visual identity for Japon Market 24h.", "period": "2020 to 2024", "type": "Retail identity", "role": "Interior, graphic and brand design"}, "japon-lugo": {"coords": [43.0121, -7.5559], "stage": "identity", "number": "IV", "title": "Lugo", "summary": "Store design and visual identity for Japon Market 24h.", "period": "2020 to 2024", "type": "Retail identity", "role": "Interior, graphic and brand design"}, "japon-madrid": {"coords": [40.3223, -3.865], "stage": "identity", "number": "V", "title": "Móstoles, Madrid", "summary": "Store design and visual identity for Japon Market 24h.", "period": "2020 to 2024", "type": "Retail identity", "role": "Interior, graphic and brand design"}, "japon-las-palmas": {"coords": [28.1235, -15.4363], "stage": "identity", "number": "VI", "title": "Las Palmas de Gran Canaria", "summary": "Store design and visual identity for Japon Market 24h.", "period": "2020 to 2024", "type": "Retail identity", "role": "Interior, graphic and brand design"}, "japon-tenerife": {"coords": [28.4636, -16.2518], "stage": "identity", "number": "VII", "title": "Tenerife", "summary": "Store design and visual identity for Japon Market 24h.", "period": "2020 to 2024", "type": "Retail identity", "role": "Interior, graphic and brand design"}, "automatic-stores": {"coords": [40.15, -3.7], "stage": "identity", "number": "VIII", "title": "Across Spain", "summary": "Visual design for more than 70 automated stores, supported by branding, packaging and communication work.", "period": "2020 to 2024", "type": "Automated retail network", "role": "Branding, packaging and visual systems"}, "ecoalf-vigo": {"coords": [42.2406, -8.7207], "stage": "production", "number": "I", "title": "Vigo", "summary": "Ecoalf Man and Woman retail projects inside El Corte Inglés.", "period": "2025 to 2026", "type": "Fashion retail", "role": "Design, technical development, procurement and installation coordination"}, "ecoalf-alicante": {"coords": [38.3452, -0.481], "stage": "production", "number": "II", "title": "Alicante", "summary": "Ecoalf Woman pop up inside El Corte Inglés Alicante.", "period": "2025 to 2026", "type": "Fashion retail pop up", "role": "Technical development and production coordination"}, "ecoalf-zaragoza": {"coords": [41.6488, -0.8891], "stage": "production", "number": "III", "title": "Zaragoza", "summary": "Ecoalf Man and Woman retail projects inside El Corte Inglés.", "period": "2025 to 2026", "type": "Fashion retail", "role": "Design, technical development and production coordination"}, "ecoalf-murcia": {"coords": [37.9922, -1.1307], "stage": "production", "number": "IV", "title": "Murcia", "summary": "Ecoalf Woman retail project inside El Corte Inglés Murcia.", "period": "2025 to 2026", "type": "Fashion retail", "role": "Technical development and production coordination"}, "ecoalf-pozuelo": {"coords": [40.4359, -3.8134], "stage": "production", "number": "V", "title": "Pozuelo, Madrid", "summary": "Ecoalf Man retail project inside El Corte Inglés Pozuelo.", "period": "2025 to 2026", "type": "Fashion retail", "role": "Design, procurement and installation coordination"}, "ecoalf-salamanca": {"coords": [40.9701, -5.6635], "stage": "production", "number": "VI", "title": "Salamanca", "summary": "Ecoalf Woman retail project inside El Corte Inglés Salamanca.", "period": "2025 to 2026", "type": "Fashion retail", "role": "Technical development and production coordination"}, "ecoalf-burgos": {"coords": [42.3439, -3.6969], "stage": "production", "number": "VII", "title": "Burgos", "summary": "Ecoalf Man and Woman retail projects inside El Corte Inglés Burgos.", "period": "2025 to 2026", "type": "Fashion retail", "role": "Technical development, procurement and installation coordination"}, "ecoalf-lisbon": {"coords": [38.7223, -9.1393], "stage": "production", "number": "VIII", "title": "Lisbon", "summary": "Ecoalf Man and Woman projects inside El Corte Inglés Lisbon.", "period": "2025 to 2026", "type": "Fashion retail", "role": "Design, technical development and production coordination"}, "ecoalf-gaia": {"coords": [41.1336, -8.6174], "stage": "production", "number": "IX", "title": "Vila Nova de Gaia", "summary": "Ecoalf Man and Woman projects inside El Corte Inglés Gaia.", "period": "2025 to 2026", "type": "Fashion retail", "role": "Design, technical development and production coordination"}, "ecoalf-valderas": {"coords": [40.3495, -3.8312], "stage": "production", "number": "X", "title": "San José de Valderas, Madrid", "summary": "Ecoalf Man retail project inside El Corte Inglés San José de Valderas.", "period": "2025 to 2026", "type": "Fashion retail", "role": "Technical development and installation coordination"}, "ecoalf-barcelona": {"coords": [41.3888, 2.113], "stage": "production", "number": "XI", "title": "Barcelona", "summary": "Ecoalf Man project inside El Corte Inglés Diagonal.", "period": "2025 to 2026", "type": "Fashion retail", "role": "Technical development and production coordination"}, "ecoalf-tarragona": {"coords": [41.1189, 1.2445], "stage": "production", "number": "XII", "title": "Tarragona", "summary": "Ecoalf Man retail project inside El Corte Inglés Tarragona.", "period": "2025 to 2026", "type": "Fashion retail", "role": "Technical development and production coordination"}, "ecoalf-sanchinarro": {"coords": [40.4928, -3.6558], "stage": "production", "number": "XIII", "title": "Sanchinarro, Madrid", "summary": "Ecoalf Man retail project inside El Corte Inglés Sanchinarro.", "period": "2025 to 2026", "type": "Fashion retail", "role": "Technical development and installation coordination"}, "ecoalf-marbella": {"coords": [36.5101, -4.8825], "stage": "production", "number": "XIV", "title": "Marbella", "summary": "Ecoalf Woman retail project inside El Corte Inglés Marbella.", "period": "2025 to 2026", "type": "Fashion retail", "role": "Design, procurement and installation coordination"}};
  const atlasMap = L.map('project-map', {
    zoomControl:true,
    attributionControl:true,
    scrollWheelZoom:false,
    tap:true,
    minZoom:2
  }).setView([31,-13],3);

  L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    {
      maxZoom:19,
      subdomains:'abcd',
      attribution:'&copy; OpenStreetMap &copy; CARTO'
    }
  ).addTo(atlasMap);

  const markerLayer = L.layerGroup().addTo(atlasMap);
  const markers = {};

  function getStageLabels(){
    return currentLanguage === 'es'
      ? {
          foundations:'Inicios',
          residential:'Diseño residencial',
          identity:'Identidad retail',
          production:'Producción retail'
        }
      : {
          foundations:'Foundations',
          residential:'Residential design',
          identity:'Retail identity',
          production:'Retail production'
        };
  }

  function getProject(key){
    const base = projectData[key];
    if(currentLanguage === 'es' && localizedProjectData.es[key]){
      return {...base, ...localizedProjectData.es[key]};
    }
    return base;
  }

  function markerIcon(project){
    return L.divIcon({
      className:'',
      html:`<div class="project-marker marker-${project.stage}"><span>${project.number}</span></div>`,
      iconSize:[38,38],
      iconAnchor:[19,38]
    });
  }

  function renderMarkers(stage='all'){
    markerLayer.clearLayers();
    Object.entries(projectData).forEach(([key,baseProject])=>{
      const project=getProject(key);
      if(stage !== 'all' && project.stage !== stage) return;
      const marker = L.marker(project.coords,{icon:markerIcon(project)}).addTo(markerLayer);
      marker.on('click',()=>openProject(key,true));
      markers[key]=marker;
    });

    const visible = Object.keys(projectData).map(getProject).filter(project=>stage==='all'||project.stage===stage);
    if(visible.length){
      const bounds=L.latLngBounds(visible.map(project=>project.coords));
      atlasMap.fitBounds(bounds.pad(stage==='foundations'?.5:.22),{animate:true,duration:1});
    }
  }

  window.refreshAtlasLanguage = function(){
    const activeRow = document.querySelector('.project-row.active');
    if(activeRow) openProject(activeRow.dataset.project,false);
    renderMarkers(document.querySelector('.stage-button.active')?.dataset.stage || 'all');
  };

  const drawer = document.querySelector('.project-drawer');
  const drawerNumber = drawer.querySelector('.drawer-number');
  const drawerStage = drawer.querySelector('.drawer-stage');
  const drawerTitle = drawer.querySelector('.drawer-title');
  const drawerSummary = drawer.querySelector('.drawer-summary');
  const drawerPeriod = drawer.querySelector('.drawer-period');
  const drawerType = drawer.querySelector('.drawer-type');
  const drawerRole = drawer.querySelector('.drawer-role');

  function openProject(key,moveMap=false){
    const project=getProject(key);
    if(!project) return;

    drawerNumber.textContent=project.number;
    drawerStage.textContent=getStageLabels()[project.stage];
    drawerTitle.textContent=project.title;
    drawerSummary.textContent=project.summary;
    drawerPeriod.textContent=project.period;
    drawerType.textContent=project.type;
    drawerRole.textContent=project.role;
    drawer.classList.add('active');

    document.querySelectorAll('.project-row').forEach(row=>{
      row.classList.toggle('active',row.dataset.project===key);
    });

    if(moveMap){
      atlasMap.flyTo(project.coords,Math.max(atlasMap.getZoom(),7),{duration:1.15});
    }
  }

  document.querySelectorAll('.project-row').forEach(row=>{
    row.addEventListener('click',()=>openProject(row.dataset.project,true));
  });

  document.querySelector('.drawer-close')?.addEventListener('click',()=>{
    drawer.classList.remove('active');
    document.querySelectorAll('.project-row').forEach(row=>row.classList.remove('active'));
  });

  document.querySelectorAll('.stage-button').forEach(button=>{
    button.addEventListener('click',()=>{
      const stage=button.dataset.stage;
      document.querySelectorAll('.stage-button').forEach(item=>item.classList.toggle('active',item===button));
      document.querySelectorAll('.project-group').forEach(group=>{
        group.classList.toggle('hidden',stage!=='all'&&group.dataset.stageGroup!==stage);
      });
      renderMarkers(stage);
    });
  });

  renderMarkers('all');

  const atlasObserver = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting) setTimeout(()=>atlasMap.invalidateSize(),180);
    });
  },{threshold:.12});
  atlasObserver.observe(atlasElement);
}


window.addEventListener('load',()=>{
  const mapEl=document.getElementById('project-map');
  if(mapEl && !window.L){
    const loading=mapEl.querySelector('.map-loading');
    if(loading) loading.textContent=currentLanguage==='es'?'No se pudo cargar el mapa. Revisa la conexión.':'The map could not load. Check your connection.';
  }
});
