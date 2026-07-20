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

document.getElementById('year').textContent=new Date().getFullYear();

// Basic image-protection layer: blocks right-click-save and drag-save on photography.
// (No client-side method fully prevents screenshots/devtools — this deters casual downloads.)
document.addEventListener('contextmenu', e => {
  if(e.target.closest('.project-image,.full-image,.drawer-image,.protected-media')) e.preventDefault();
});
document.addEventListener('dragstart', e => {
  if(e.target.closest('.project-image,.full-image,.drawer-image,.protected-media')) e.preventDefault();
});

const lightbox=document.createElement('div');
lightbox.className='image-lightbox';
lightbox.innerHTML='<button class="image-lightbox-close" type="button" aria-label="Close">×</button><img class="protected-media" draggable="false" alt="">';
document.body.appendChild(lightbox);
const lightboxImg=lightbox.querySelector('img');
function openLightbox(src,alt){ lightboxImg.src=src; lightboxImg.alt=alt||''; lightbox.classList.add('active'); }
function closeLightbox(){ lightbox.classList.remove('active'); }
document.addEventListener('click', e => {
  const thumb=e.target.closest('.drawer-image[data-lightbox-src]');
  if(thumb){ openLightbox(thumb.dataset.lightboxSrc, thumb.querySelector('img')?.alt); return; }
  if(e.target===lightbox||e.target.closest('.image-lightbox-close')) closeLightbox();
});
document.addEventListener('keydown', e => { if(e.key==='Escape') closeLightbox(); });


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





const baseTranslations = {"en":{"navWork":"Work","navMap":"Map","navStory":"Story","navJournal":"Notebook","navContact":"Contact","themeToggle":"Switch colour mode","heroEyebrow":"Retail and spatial design · technical development · production preparation","regionIberia":"Spain & Portugal","regionVenezuela":"Venezuela","mapIndexLabel":"Locations","mapIndexHint":"A number on a point means more than one project shares that location. Pick one below to see it on its own.","heroTitle":"I turn design ideas into clear, workable projects.","heroBody":"I am an architecture graduate from Venezuela, based in Spain and working across retail interiors, technical drawing and production preparation. I develop layouts and documentation, follow up purchasing and make sure materials and project information are ready for the people who take the work into production and installation.","heroLink":"View selected work","positionLabel":"How I work","positionText":"A drawing is doing its job when the client, workshop and installation lead can understand the same project without filling in the gaps.","selectedWorkLabel":"Selected work","selectedWorkTitle":"Three ways I connect design with delivery","ecoalfQuestion":"How can one retail system adapt to very different spaces?","ecoalfLabel":"Technical development for retail","ecoalfTitle":"Ecoalf across Spain and Portugal","ecoalfBody":"Layouts, plans, elevations, furniture schedules and production-ready information for permanent corners and temporary spaces inside El Corte Inglés.","openCase":"View case study","observationLabel":"Working note","observationText":"Reusing furniture works when the new layout gives every existing piece a reason to remain.","ikksQuestion":"What does a temporary store need before installation begins?","ikksLabel":"Preparing a temporary retail environment","ikksTitle":"IKKS pop-up in San Sebastián de los Reyes","ikksBody":"A clear technical package for a short installation window: dimensions, elevations, fitting rooms, storage and point of sale resolved before the team arrived on site.","continuousConversation":"The finished space is visible. The preparation behind it usually is not.","japonQuestion":"How can one brand stay recognisable across different spaces and formats?","japonLabel":"Connecting brand, space and communication","japonTitle":"Japon Market 24h","japonBody":"Interior design, technical drawings, 3D visualisation, packaging, editorial pieces, social media and web content developed as parts of the same visual system.","builtWorkLabel":"Project atlas","builtWorkTitle":"A career built through places and formats","builtWorkIntro":"From architectural drafting in Venezuela to residential projects, retail identity and technical development in Spain and Portugal, each stage added a new way of understanding how design becomes real.","atlasAphorism":"Clear information saves time long before anything reaches the workshop.","stageAll":"All work","stageFoundations":"Foundations","stageResidential":"Residential design","stageIdentity":"Retail identity","stageProduction":"Technical retail development","mapCountries":"Venezuela, Spain and Portugal","mapCaption":"Selected work developed across three countries","close":"Close","closeProject":"Close project information","drawerViewProject":"View full project","selectProject":"Select a project location","selectProjectText":"Choose a point on the map or an item from the index to see the work connected to that place.","period":"Period","type":"Type","role":"Role","projectImage":"Project image","drawingDetail":"Drawing or detail","imagesLater":"Images can be added here as the portfolio develops.","location":"Location","work":"Work","stage":"Stage","storyLabel":"My path","storyTitle":"One discipline kept leading to another","storyIntro":"My career did not follow a straight line. Architecture led me to interiors, interiors to visual identity, and retail to a much closer relationship with purchasing, materials and production. That mix is now the strongest part of my profile.","storyAphorism":"The best project information answers questions before they become problems.","story1Title":"Architecture taught me to think through drawings.","story1Body":"I started in Venezuela with plans, 3D models and architectural visualisation. That training gave me the spatial and technical foundation I still rely on today.","story2Title":"Moving to Spain made my work broader.","story2Body":"I worked across interiors, graphic design and communication, learning that a space and the identity around it should support the same idea.","story3Title":"Retail taught me to make decisions quickly and clearly.","story3Body":"Circulation, stock, visibility, furniture and brand language all compete for the same limited space. Good retail design has to organise them without making the result feel complicated.","story4Title":"Working close to production changed my priorities.","story4Body":"I now think earlier about dimensions, materials, purchasing, transport and assembly. My responsibility is to prepare the project and its information so the people leading production and installation can work from a complete, coherent package.","story5Title":"I am looking for the next step in an international team.","story5Body":"Germany and the Netherlands interest me because design, industry and craft often sit close together. I am looking for a role where spatial thinking and technical development are equally valued.","journalLabel":"Notebook","journalTitle":"Notes from project preparation","journalIntro":"Short observations about surveys, reuse, purchasing, drawings and production—the practical decisions that sit behind a finished space.","journalSurveyLabel":"Survey","journalSurveyTitle":"What a useful retail survey needs to communicate","journalReuseLabel":"Reuse","journalReuseTitle":"When existing furniture deserves a second layout","journalInstallationLabel":"Preparation","journalInstallationTitle":"Preparing a project for an overnight retail installation","journalProductionLabel":"Production","journalProductionTitle":"Five checks before a project goes to production","readNote":"Read note","contactTitle":"I am open to thoughtful teams, international projects and work that values both design and technical clarity.","locationFooter":"Gijón, Spain","behanceInteriors":"Behance — Interiors","behanceSocial":"Behance — Visual communication","maisonCaligariLink":"Maison Caligari — Independent project","residentialTitle":"Asturias and Galicia","productionTitle":"Ecoalf and fashion retail","period20152017":"2015 to 2017","period20182020":"2018 to 2020","period20202024":"2020 to 2024","period20252026":"2025 to 2026","stat1":"documented project locations","stat2":"automated retail identities","stat3":"countries connected by the work"},"es":{"navWork":"Proyectos","navMap":"Mapa","navStory":"Trayectoria","navJournal":"Cuaderno","navContact":"Contacto","themeToggle":"Cambiar modo de color","heroEyebrow":"Diseño retail y espacial · desarrollo técnico · preparación para producción","regionIberia":"España y Portugal","regionVenezuela":"Venezuela","mapIndexLabel":"Ubicaciones","mapIndexHint":"Un número sobre un punto indica que varios proyectos comparten esa ubicación: elige uno de la lista para verlo por separado.","heroTitle":"Convierto ideas de diseño en proyectos claros y realizables.","heroBody":"Soy graduado en Arquitectura en Venezuela y vivo en España. Trabajo entre el diseño de interiores retail, la documentación técnica y la preparación de proyectos para producción: desarrollo distribuciones y planos, hago seguimiento de compras y compruebo que los materiales y la información estén listos para quienes se encargan de fabricar y coordinar el montaje.","heroLink":"Ver proyectos seleccionados","positionLabel":"Mi forma de trabajar","positionText":"Un plano funciona cuando cliente, taller y responsable de montaje entienden el mismo proyecto sin tener que completar la información por su cuenta.","selectedWorkLabel":"Proyectos seleccionados","selectedWorkTitle":"Tres formas de conectar el diseño con su ejecución","ecoalfQuestion":"¿Cómo puede adaptarse un mismo sistema retail a espacios muy distintos?","ecoalfLabel":"Desarrollo técnico para retail","ecoalfTitle":"Ecoalf en España y Portugal","ecoalfBody":"Distribuciones, plantas, alzados, inventarios de mobiliario e información preparada para producción en corners permanentes y espacios temporales de El Corte Inglés.","openCase":"Ver proyecto","observationLabel":"Nota de trabajo","observationText":"Reutilizar mobiliario tiene sentido cuando la nueva distribución da a cada pieza una función clara.","ikksQuestion":"¿Qué necesita una tienda temporal antes de que comience el montaje?","ikksLabel":"Preparación de un espacio retail temporal","ikksTitle":"Pop-up de IKKS en San Sebastián de los Reyes","ikksBody":"Un paquete técnico claro para un montaje con tiempo limitado: cotas, alzados, probadores, almacén y zona de caja resueltos antes de la llegada del equipo.","continuousConversation":"El espacio terminado se ve. Todo el trabajo previo, casi nunca.","japonQuestion":"¿Cómo se mantiene reconocible una marca en espacios y formatos diferentes?","japonLabel":"Conectar marca, espacio y comunicación","japonTitle":"Japon Market 24h","japonBody":"Interiorismo, planos técnicos, visualización 3D, packaging, piezas editoriales, redes sociales y contenido web desarrollados dentro de un mismo sistema visual.","builtWorkLabel":"Atlas de proyectos","builtWorkTitle":"Una trayectoria construida entre lugares y formatos","builtWorkIntro":"Desde la delineación arquitectónica en Venezuela hasta el diseño residencial, la identidad retail y el desarrollo técnico en España y Portugal, cada etapa añadió una forma nueva de entender cómo un proyecto se convierte en realidad.","atlasAphorism":"La información clara ahorra tiempo mucho antes de que el proyecto llegue al taller.","stageAll":"Todo","stageFoundations":"Inicios","stageResidential":"Diseño residencial","stageIdentity":"Identidad retail","stageProduction":"Desarrollo técnico retail","mapCountries":"Venezuela, España y Portugal","mapCaption":"Selección de trabajos desarrollados en tres países","close":"Cerrar","closeProject":"Cerrar información del proyecto","selectProject":"Selecciona una ubicación","selectProjectText":"Elige un punto del mapa o un elemento del índice para ver el trabajo relacionado con ese lugar.","period":"Periodo","type":"Tipo","role":"Rol","projectImage":"Imagen del proyecto","drawingDetail":"Plano o detalle","imagesLater":"Aquí se podrán añadir imágenes a medida que avance el portfolio.","location":"Ubicación","work":"Trabajo","stage":"Etapa","storyLabel":"Trayectoria","storyTitle":"Una disciplina me fue llevando a la siguiente","storyIntro":"Mi carrera no siguió una línea recta. La arquitectura me llevó al interiorismo; el interiorismo, a la identidad visual; y el retail, a trabajar mucho más cerca de las compras, los materiales y la producción. Esa mezcla es hoy la parte más sólida de mi perfil.","storyAphorism":"La mejor información de proyecto responde preguntas antes de que se conviertan en problemas.","story1Title":"La arquitectura me enseñó a pensar a través del dibujo.","story1Body":"Empecé en Venezuela trabajando con planos, modelos 3D y visualización arquitectónica. Esa formación me dio una base espacial y técnica que sigue presente en todo lo que hago.","story2Title":"Mudarnos a España amplió mi manera de trabajar.","story2Body":"Pasé por el interiorismo, el diseño gráfico y la comunicación, y entendí que un espacio y la identidad que lo rodea deberían contar la misma historia.","story3Title":"El retail me enseñó a decidir con rapidez y precisión.","story3Body":"Circulación, producto, visibilidad, mobiliario e identidad compiten dentro de un espacio limitado. Diseñar bien consiste en ordenarlo todo sin que el resultado parezca complicado.","story4Title":"Trabajar cerca de producción cambió mis prioridades.","story4Body":"Ahora pienso antes en cotas, materiales, compras, transporte y montaje. Mi responsabilidad es dejar preparado el proyecto y toda su información para que quienes dirigen la fabricación y el montaje reciban un paquete completo y coherente.","story5Title":"Busco el siguiente paso dentro de un equipo internacional.","story5Body":"Me atraen Alemania y Países Bajos porque diseño, industria y oficio suelen trabajar muy cerca. Busco un puesto donde se valore tanto el pensamiento espacial como el desarrollo técnico.","journalLabel":"Cuaderno","journalTitle":"Notas sobre cómo preparo un proyecto","journalIntro":"Observaciones breves sobre levantamientos, reutilización, compras, planos y producción: las decisiones prácticas que hay detrás de un espacio terminado.","journalSurveyLabel":"Levantamiento","journalSurveyTitle":"Qué debe comunicar un buen levantamiento retail","journalReuseLabel":"Reutilización","journalReuseTitle":"Cuándo merece la pena dar una segunda distribución al mobiliario existente","journalInstallationLabel":"Preparación","journalInstallationTitle":"Cómo preparar un proyecto para un montaje retail nocturno","journalProductionLabel":"Producción","journalProductionTitle":"Cinco revisiones antes de enviar un proyecto a producción","readNote":"Leer nota","contactTitle":"Estoy abierto a equipos cuidadosos, proyectos internacionales y trabajos donde el diseño y la claridad técnica tengan el mismo peso.","locationFooter":"Gijón, España","behanceInteriors":"Behance — Interiores","behanceSocial":"Behance — Comunicación visual","maisonCaligariLink":"Maison Caligari — Proyecto independiente","drawerViewProject":"Ver proyecto completo","residentialTitle":"Asturias y Galicia","productionTitle":"Ecoalf y retail de moda","period20152017":"2015 a 2017","period20182020":"2018 a 2020","period20202024":"2020 a 2024","period20252026":"2025 a 2026","stat1":"ubicaciones de proyecto documentadas","stat2":"identidades para tiendas automáticas","stat3":"países conectados por el trabajo"}};
const localizedProjectData = {"es": {"venezuela": {"title": "Venezuela", "summary": "El inicio de mi carrera, centrado en delineación arquitectónica, modelado 3D y visualización.", "period": "2015 a 2017", "type": "Delineación arquitectónica", "role": "Delineación, modelado y visualización"}, "gijon-residential": {"title": "Gijón", "summary": "Tres viviendas unifamiliares privadas desarrolladas durante mi etapa de diseño residencial.", "period": "2018 a 2020", "type": "Residencial privado", "role": "Diseño arquitectónico e interior"}, "oviedo-residential": {"title": "Oviedo", "summary": "Dos viviendas unifamiliares privadas desarrolladas para clientes en Asturias.", "period": "2018 a 2020", "type": "Residencial privado", "role": "Diseño arquitectónico e interior"}, "langreo": {"title": "Langreo", "summary": "Vivienda unifamiliar privada desarrollada durante mi etapa de diseño residencial en Asturias.", "period": "2018 a 2020", "type": "Residencial privado", "role": "Diseño arquitectónico"}, "laviana": {"title": "Pola de Laviana", "summary": "Diseño de una vivienda privada. La fase de ejecución fue gestionada por el equipo de obra.", "period": "2018 a 2020", "type": "Residencial privado", "role": "Desarrollo de diseño"}, "regueras": {"title": "Las Regueras, Tahoces", "summary": "Vivienda unifamiliar privada desarrollada en un contexto rural de Asturias.", "period": "2018 a 2020", "type": "Residencial privado", "role": "Diseño arquitectónico"}, "coruna-commercial": {"title": "A Coruña", "summary": "Proyecto de adecuación comercial desarrollado durante mi etapa en Innova y Mejora.", "period": "2018 a 2020", "type": "Adecuación comercial", "role": "Diseño interior y técnico"}, "automatic-stores": {"title": "España", "summary": "Diseño visual para más de 70 tiendas automáticas, acompañado de trabajos de branding, packaging y comunicación.", "period": "2020 a 2024", "type": "Red de retail automatizado", "role": "Branding, packaging y sistemas visuales"}, "japon-gijon": {"title": "Gijón", "summary": "Diseño de tienda e identidad visual para Japon Market 24h.", "period": "2020 a 2024", "type": "Identidad retail", "role": "Diseño interior, gráfico y de marca"}, "japon-oviedo": {"title": "Oviedo", "summary": "Diseño de tienda e identidad visual para Japon Market 24h.", "period": "2020 a 2024", "type": "Identidad retail", "role": "Diseño interior, gráfico y de marca"}, "japon-aviles": {"title": "Avilés", "summary": "Diseño de tienda e identidad visual para Japon Market 24h.", "period": "2020 a 2024", "type": "Identidad retail", "role": "Diseño interior, gráfico y de marca"}, "japon-lugo": {"title": "Lugo", "summary": "Diseño de tienda e identidad visual para Japon Market 24h.", "period": "2020 a 2024", "type": "Identidad retail", "role": "Diseño interior, gráfico y de marca"}, "japon-madrid": {"title": "Móstoles, Madrid", "summary": "Diseño de tienda e identidad visual para Japon Market 24h.", "period": "2020 a 2024", "type": "Identidad retail", "role": "Diseño interior, gráfico y de marca"}, "japon-las-palmas": {"title": "Las Palmas de Gran Canaria", "summary": "Diseño de tienda e identidad visual para Japon Market 24h.", "period": "2020 a 2024", "type": "Identidad retail", "role": "Diseño interior, gráfico y de marca"}, "japon-tenerife": {"title": "Tenerife", "summary": "Diseño de tienda e identidad visual para Japon Market 24h.", "period": "2020 a 2024", "type": "Identidad retail", "role": "Diseño interior, gráfico y de marca"}, "japon-leon": {"title": "León", "summary": "Diseño de tienda e identidad visual para Japon Market 24h.", "period": "2020 a 2024", "type": "Identidad retail", "role": "Diseño interior, gráfico y de marca"}, "ecoalf-vigo": {"title": "Vigo", "summary": "Ecoalf Man y Woman en El Corte Inglés.", "period": "2025 a 2026", "type": "Retail de moda", "role": "Diseño, desarrollo técnico, compras y preparación para montaje"}, "ecoalf-alicante": {"title": "Alicante", "summary": "Pop up de Ecoalf Woman en El Corte Inglés Alicante.", "period": "2025 a 2026", "type": "Retail de moda", "role": "Diseño, desarrollo técnico, compras y preparación para montaje"}, "ecoalf-zaragoza": {"title": "Zaragoza", "summary": "Ecoalf Man y Woman en El Corte Inglés.", "period": "2025 a 2026", "type": "Retail de moda", "role": "Diseño, desarrollo técnico, compras y preparación para montaje"}, "ecoalf-murcia": {"title": "Murcia", "summary": "Ecoalf Woman en El Corte Inglés Murcia.", "period": "2025 a 2026", "type": "Retail de moda", "role": "Diseño, desarrollo técnico, compras y preparación para montaje"}, "ecoalf-pozuelo": {"title": "Pozuelo, Madrid", "summary": "Ecoalf Man en El Corte Inglés Pozuelo.", "period": "2025 a 2026", "type": "Retail de moda", "role": "Diseño, desarrollo técnico, compras y preparación para montaje"}, "ecoalf-salamanca": {"title": "Salamanca", "summary": "Ecoalf Woman en El Corte Inglés Salamanca.", "period": "2025 a 2026", "type": "Retail de moda", "role": "Diseño, desarrollo técnico, compras y preparación para montaje"}, "ecoalf-burgos": {"title": "Burgos", "summary": "Ecoalf Man y Woman en El Corte Inglés Burgos.", "period": "2025 a 2026", "type": "Retail de moda", "role": "Diseño, desarrollo técnico, compras y preparación para montaje"}, "ecoalf-lisbon": {"title": "Lisboa", "summary": "Ecoalf Man y Woman en El Corte Inglés Lisboa.", "period": "2025 a 2026", "type": "Retail de moda", "role": "Diseño, desarrollo técnico, compras y preparación para montaje"}, "ecoalf-gaia": {"title": "Vila Nova de Gaia", "summary": "Ecoalf Man y Woman en El Corte Inglés Gaia.", "period": "2025 a 2026", "type": "Retail de moda", "role": "Diseño, desarrollo técnico, compras y preparación para montaje"}, "ecoalf-valderas": {"title": "San José de Valderas, Madrid", "summary": "Ecoalf Man en El Corte Inglés San José de Valderas.", "period": "2025 a 2026", "type": "Retail de moda", "role": "Diseño, desarrollo técnico, compras y preparación para montaje"}, "ecoalf-barcelona": {"title": "Barcelona", "summary": "Ecoalf Man en El Corte Inglés Diagonal.", "period": "2025 a 2026", "type": "Retail de moda", "role": "Diseño, desarrollo técnico, compras y preparación para montaje"}, "ecoalf-tarragona": {"title": "Tarragona", "summary": "Ecoalf Man en El Corte Inglés Tarragona.", "period": "2025 a 2026", "type": "Retail de moda", "role": "Diseño, desarrollo técnico, compras y preparación para montaje"}, "ecoalf-sanchinarro": {"title": "Sanchinarro, Madrid", "summary": "Ecoalf Man en El Corte Inglés Sanchinarro.", "period": "2025 a 2026", "type": "Retail de moda", "role": "Diseño, desarrollo técnico, compras y preparación para montaje"}, "ecoalf-marbella": {"title": "Marbella", "summary": "Ecoalf Woman en El Corte Inglés Marbella.", "period": "2025 a 2026", "type": "Retail de moda", "role": "Diseño, desarrollo técnico, compras y preparación para montaje"}}};

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



// Built Work Atlas v8, fully offline and dependency-free
const atlasElement = document.getElementById('project-map');
if(atlasElement){
  const projectData = {"venezuela": {"coords": [10.4806, -66.9036], "stage": "foundations", "number": "I", "title": "Venezuela", "summary": "The beginning of my career, focused on architectural drafting, 3D modelling and visualisation.", "period": "2015 to 2017", "type": "Architectural drafting", "role": "Drafting, modelling and visualisation"}, "gijon-residential": {"coords": [43.5322, -5.6611], "stage": "residential", "number": "II", "title": "Gijón", "summary": "Three private single-family homes developed during my residential design stage.", "period": "2018 to 2020", "type": "Private residential", "role": "Architectural and interior design"}, "oviedo-residential": {"coords": [43.3614, -5.8494], "stage": "residential", "number": "III", "title": "Oviedo", "summary": "Two private single-family homes developed for clients in Asturias.", "period": "2018 to 2020", "type": "Private residential", "role": "Architectural and interior design"}, "langreo": {"coords": [43.3083, -5.6944], "stage": "residential", "number": "IV", "title": "Langreo", "summary": "A private single-family home developed as part of my residential design work in Asturias.", "period": "2018 to 2020", "type": "Private residential", "role": "Architectural design"}, "laviana": {"coords": [43.2456, -5.5627], "stage": "residential", "number": "V", "title": "Pola de Laviana", "summary": "Design work for a private home. The construction phase was handled by the site team.", "period": "2018 to 2020", "type": "Private residential", "role": "Design development"}, "regueras": {"coords": [43.4148, -5.9708], "stage": "residential", "number": "VI", "title": "Las Regueras, Tahoces", "summary": "Private single-family home developed in a rural context in Asturias.", "period": "2018 to 2020", "type": "Private residential", "role": "Architectural design"}, "coruna-commercial": {"coords": [43.3623, -8.4115], "stage": "residential", "number": "VII", "title": "A Coruña", "summary": "Commercial refurbishment project developed during my time at Innova y Mejora.", "period": "2018 to 2020", "type": "Commercial refurbishment", "role": "Interior and technical design"}, "japon-gijon": {"coords": [43.5322, -5.6611], "stage": "identity", "number": "I", "title": "Gijón", "summary": "Store design and visual identity for Japon Market 24h.", "period": "2020 to 2024", "type": "Retail identity", "role": "Interior, graphic and brand design"}, "japon-oviedo": {"coords": [43.3614, -5.8494], "stage": "identity", "number": "II", "title": "Oviedo", "summary": "Store design and visual identity for Japon Market 24h.", "period": "2020 to 2024", "type": "Retail identity", "role": "Interior, graphic and brand design"}, "japon-aviles": {"coords": [43.556, -5.9248], "stage": "identity", "number": "III", "title": "Avilés", "summary": "Store design and visual identity for Japon Market 24h.", "period": "2020 to 2024", "type": "Retail identity", "role": "Interior, graphic and brand design"}, "japon-lugo": {"coords": [43.0121, -7.5559], "stage": "identity", "number": "IV", "title": "Lugo", "summary": "Store design and visual identity for Japon Market 24h.", "period": "2020 to 2024", "type": "Retail identity", "role": "Interior, graphic and brand design"}, "japon-madrid": {"coords": [40.3223, -3.865], "stage": "identity", "number": "V", "title": "Móstoles, Madrid", "summary": "Store design and visual identity for Japon Market 24h.", "period": "2020 to 2024", "type": "Retail identity", "role": "Interior, graphic and brand design"}, "japon-las-palmas": {"coords": [28.1235, -15.4363], "stage": "identity", "number": "VI", "title": "Las Palmas de Gran Canaria", "summary": "Store design and visual identity for Japon Market 24h.", "period": "2020 to 2024", "type": "Retail identity", "role": "Interior, graphic and brand design"}, "japon-tenerife": {"coords": [28.4636, -16.2518], "stage": "identity", "number": "VII", "title": "Tenerife", "summary": "Store design and visual identity for Japon Market 24h.", "period": "2020 to 2024", "type": "Retail identity", "role": "Interior, graphic and brand design"}, "japon-leon": {"coords": [42.5987, -5.5671], "stage": "identity", "number": "VIII", "title": "León", "summary": "Store design and visual identity for Japon Market 24h.", "period": "2020 to 2024", "type": "Retail identity", "role": "Interior, graphic and brand design"}, "automatic-stores": {"coords": [40.15, -3.7], "stage": "identity", "number": "IX", "title": "Across Spain", "summary": "Visual design for more than 70 automated stores, supported by branding, packaging and communication work.", "period": "2020 to 2024", "type": "Automated retail network", "role": "Branding, packaging and visual systems"}, "ecoalf-vigo": {"coords": [42.2406, -8.7207], "stage": "production", "number": "I", "title": "Vigo", "summary": "Ecoalf Man and Woman retail projects inside El Corte Inglés.", "period": "2025 to 2026", "type": "Fashion retail", "role": "Technical development, purchasing follow-up and project preparation"}, "ecoalf-alicante": {"coords": [38.3452, -0.481], "stage": "production", "number": "II", "title": "Alicante", "summary": "Ecoalf Woman pop up inside El Corte Inglés Alicante.", "period": "2025 to 2026", "type": "Fashion retail pop up", "role": "Technical development and production preparation"}, "ecoalf-zaragoza": {"coords": [41.6488, -0.8891], "stage": "production", "number": "III", "title": "Zaragoza", "summary": "Ecoalf Man and Woman retail projects inside El Corte Inglés.", "period": "2025 to 2026", "type": "Fashion retail", "role": "Design, technical development and production coordination"}, "ecoalf-murcia": {"coords": [37.9922, -1.1307], "stage": "production", "number": "IV", "title": "Murcia", "summary": "Ecoalf Woman retail project inside El Corte Inglés Murcia.", "period": "2025 to 2026", "type": "Fashion retail", "role": "Technical development and production preparation"}, "ecoalf-pozuelo": {"coords": [40.4359, -3.8134], "stage": "production", "number": "V", "title": "Pozuelo, Madrid", "summary": "Ecoalf Man retail project inside El Corte Inglés Pozuelo.", "period": "2025 to 2026", "type": "Fashion retail", "role": "Layout development, purchasing follow-up and project preparation"}, "ecoalf-salamanca": {"coords": [40.9701, -5.6635], "stage": "production", "number": "VI", "title": "Salamanca", "summary": "Ecoalf Woman retail project inside El Corte Inglés Salamanca.", "period": "2025 to 2026", "type": "Fashion retail", "role": "Technical development and production preparation"}, "ecoalf-burgos": {"coords": [42.3439, -3.6969], "stage": "production", "number": "VII", "title": "Burgos", "summary": "Ecoalf Man and Woman retail projects inside El Corte Inglés Burgos.", "period": "2025 to 2026", "type": "Fashion retail", "role": "Technical development, purchasing follow-up and material readiness"}, "ecoalf-lisbon": {"coords": [38.7223, -9.1393], "stage": "production", "number": "VIII", "title": "Lisbon", "summary": "Ecoalf Man and Woman projects inside El Corte Inglés Lisbon.", "period": "2025 to 2026", "type": "Fashion retail", "role": "Design, technical development and production coordination"}, "ecoalf-gaia": {"coords": [41.1336, -8.6174], "stage": "production", "number": "IX", "title": "Vila Nova de Gaia", "summary": "Ecoalf Man and Woman projects inside El Corte Inglés Gaia.", "period": "2025 to 2026", "type": "Fashion retail", "role": "Design, technical development and production coordination"}, "ecoalf-valderas": {"coords": [40.3495, -3.8312], "stage": "production", "number": "X", "title": "San José de Valderas, Madrid", "summary": "Ecoalf Man retail project inside El Corte Inglés San José de Valderas.", "period": "2025 to 2026", "type": "Fashion retail", "role": "Technical development and installation preparation"}, "ecoalf-barcelona": {"coords": [41.3888, 2.113], "stage": "production", "number": "XI", "title": "Barcelona", "summary": "Ecoalf Man project inside El Corte Inglés Diagonal.", "period": "2025 to 2026", "type": "Fashion retail", "role": "Technical development and production preparation"}, "ecoalf-tarragona": {"coords": [41.1189, 1.2445], "stage": "production", "number": "XII", "title": "Tarragona", "summary": "Ecoalf Man retail project inside El Corte Inglés Tarragona.", "period": "2025 to 2026", "type": "Fashion retail", "role": "Technical development and production preparation"}, "ecoalf-sanchinarro": {"coords": [40.4928, -3.6558], "stage": "production", "number": "XIII", "title": "Sanchinarro, Madrid", "summary": "Ecoalf Man retail project inside El Corte Inglés Sanchinarro.", "period": "2025 to 2026", "type": "Fashion retail", "role": "Technical development and installation preparation"}, "ecoalf-marbella": {"coords": [36.5101, -4.8825], "stage": "production", "number": "XIV", "title": "Marbella", "summary": "Ecoalf Woman retail project inside El Corte Inglés Marbella.", "period": "2025 to 2026", "type": "Fashion retail", "role": "Layout development, purchasing follow-up and project preparation"}};
  const bounds = {
    iberia:{west:-18.5,east:4.5,south:27.0,north:44.8},
    venezuela:{west:-73.8,east:-59.2,south:0.0,north:13.5}
  };
  const stageLabelsEn={foundations:'Foundations',residential:'Residential design',identity:'Retail identity',production:'Retail production'};
  const stageLabelsEs={foundations:'Inicios',residential:'Diseño residencial',identity:'Identidad retail',production:'Producción retail'};
  const markerContainers={iberia:document.getElementById('iberia-markers'),venezuela:document.getElementById('venezuela-markers')};
  const markerGroups={};
  let activeStage='all';
  let activeProjectKey=null;

  function getProject(key){
    const base=projectData[key];
    if(currentLanguage==='es' && localizedProjectData?.es?.[key]) return {...base,...localizedProjectData.es[key]};
    return base;
  }
  function regionFor(project){ return project.coords[1] < -25 ? 'venezuela':'iberia'; }
  function xy(project,region){
    const b=bounds[region]; const lat=project.coords[0],lon=project.coords[1];
    return {x:(lon-b.west)/(b.east-b.west)*100,y:(b.north-lat)/(b.north-b.south)*100};
  }
  function locationId(project){ return `${regionFor(project)}:${project.coords[0].toFixed(2)}:${project.coords[1].toFixed(2)}`; }
  function buildGroups(stage='all'){
    const groups={};
    Object.entries(projectData).forEach(([key,base])=>{
      if(stage!=='all'&&base.stage!==stage)return;
      const id=locationId(base); if(!groups[id])groups[id]={region:regionFor(base),keys:[],project:base}; groups[id].keys.push(key);
    }); return groups;
  }
  const drawerLists={iberia:document.getElementById('drawer-list-iberia'),venezuela:document.getElementById('drawer-list-venezuela')};
  function renderMarkers(stage='all'){
    Object.values(markerContainers).forEach(c=>c.innerHTML='');
    Object.values(drawerLists).forEach(c=>c&&(c.innerHTML=''));
    Object.keys(markerGroups).forEach(k=>delete markerGroups[k]);
    const groups=buildGroups(stage);
    Object.entries(groups).forEach(([id,g],idx)=>{
      const pos=xy(g.project,g.region); const btn=document.createElement('button');
      btn.type='button';btn.className='atlas-marker';btn.style.left=`${pos.x}%`;btn.style.top=`${pos.y}%`;
      btn.innerHTML=`<span>${getProject(g.keys[0]).number}</span>${g.keys.length>1?`<span class="count">${g.keys.length}</span>`:''}`;
      btn.title=g.keys.map(k=>getProject(k).title+' · '+getProject(k).type).join(' · ');
      btn.addEventListener('click',()=>openProject(g.keys[0],true));
      markerContainers[g.region].appendChild(btn); markerGroups[id]=btn;
    });

    // Side list: one row per individual project (so a shared pin's projects are told apart)
    Object.entries(projectData).forEach(([key,base])=>{
      if(stage!=='all'&&base.stage!==stage)return;
      const p=getProject(key);
      const listBtn=document.createElement('button');
      listBtn.type='button';listBtn.className='drawer-list-row';listBtn.dataset.project=key;
      listBtn.innerHTML=`<span class="drawer-list-title">${p.title}</span><span class="drawer-list-type">${p.type}</span>`;
      listBtn.addEventListener('click',()=>openProject(key,true));
      drawerLists[regionFor(base)]?.appendChild(listBtn);
    });
  }
  const drawer=document.querySelector('.project-drawer');
  const drawerNumber=drawer?.querySelector('.drawer-number'); const drawerStage=drawer?.querySelector('.drawer-stage');
  const drawerTitle=drawer?.querySelector('.drawer-title'); const drawerSummary=drawer?.querySelector('.drawer-summary');
  const drawerPeriod=drawer?.querySelector('.drawer-period'); const drawerType=drawer?.querySelector('.drawer-type'); const drawerRole=drawer?.querySelector('.drawer-role');
  const drawerGallery=drawer?.querySelector('.drawer-gallery');
  const projectImages={
    'ecoalf-lisbon':['images/ecoalf/lisboa-man/interior-render-01.jpg','images/ecoalf/lisboa-woman/interior-render-01.jpg','images/ecoalf/lisboa-man/interior-render-03.jpg','images/ecoalf/lisboa-woman/site-photo-01.jpg'],
    'ecoalf-marbella':['images/ecoalf/marbella/interior-render-02.jpg','images/ecoalf/marbella/interior-render-05.jpg'],
    'ecoalf-vigo':['images/ecoalf/vigo-man/interior-render-04.jpg','images/ecoalf/vigo-man/interior-render-11.jpg','images/ecoalf/vigo-woman/floor-plan-01.jpg','images/ecoalf/vigo-man/detail-render-02.jpg'],
    'japon-aviles':['images/japon-market/aviles/arch-corridor-distant-view.jpg','images/japon-market/aviles/vending-machines-entrance.jpg','images/japon-market/aviles/street-entrance-daytime.jpg'],
    'japon-madrid':['images/japon-market/madrid-mostoles/street-storefront-queue.jpg','images/japon-market/madrid-mostoles/ramen-counter-mural.jpg','images/japon-market/madrid-mostoles/interior-figures-shelving.jpg'],
    'japon-lugo':['images/japon-market/lugo/interior-neon-sign.jpg','images/japon-market/lugo/facade-japan-skyline.jpg','images/japon-market/lugo/entrance-kimono-model.jpg'],
    'japon-las-palmas':['images/japon-market/las-palmas/storefront-opening-balloons.jpg','images/japon-market/las-palmas/interior-mascot-mural.jpg','images/japon-market/las-palmas/branded-delivery-van.jpg'],
    'japon-tenerife':['images/japon-market/tenerife/grand-opening-storefront.jpg','images/japon-market/tenerife/grand-opening-storefront-02.jpg'],
    'japon-leon':['images/japon-market/leon/mall-walkway-signage.jpg','images/japon-market/leon/mall-lounge-mural.jpg','images/japon-market/leon/ramen-ad-portrait.jpg']
  };
  const projectLinks={
    'japon-aviles':'projects/japon-market.html#aviles','japon-madrid':'projects/japon-market.html#madrid-mostoles','japon-lugo':'projects/japon-market.html#lugo',
    'japon-las-palmas':'projects/japon-market.html#las-palmas','japon-tenerife':'projects/japon-market.html#tenerife','japon-leon':'projects/japon-market.html#leon',
    'japon-gijon':'projects/japon-market.html','japon-oviedo':'projects/japon-market.html','automatic-stores':'projects/japon-market.html'
  };
  const drawerLink=drawer?.querySelector('.drawer-link');
  function openProject(key,scrollToMap=false){
    const p=getProject(key); if(!p||!drawer)return; activeProjectKey=key;
    drawerNumber.textContent=p.number; drawerStage.textContent=(currentLanguage==='es'?stageLabelsEs:stageLabelsEn)[p.stage];
    drawerTitle.textContent=p.title; drawerSummary.textContent=p.summary; drawerPeriod.textContent=p.period; drawerType.textContent=p.type; drawerRole.textContent=p.role;
    if(drawerGallery){
      const imgs=projectImages[key]||[];
      drawerGallery.innerHTML=imgs.map(src=>`<div class="drawer-image protected-media" data-lightbox-src="${src}"><img src="${src}" alt="${p.title}" draggable="false"></div>`).join('');
    }
    if(drawerLink){
      const href=projectLinks[key];
      if(href){ drawerLink.href=href; drawerLink.classList.add('visible'); }
      else{ drawerLink.classList.remove('visible'); drawerLink.removeAttribute('href'); }
    }
    drawer.classList.add('active'); document.querySelectorAll('.project-row,.drawer-list-row').forEach(r=>r.classList.toggle('active',r.dataset.project===key));
    document.querySelectorAll('.atlas-marker').forEach(m=>m.classList.remove('active'));
    const id=locationId(projectData[key]); markerGroups[id]?.classList.add('active');
    if(scrollToMap) document.querySelector('.map-frame')?.scrollIntoView({behavior:'smooth',block:'center'});
  }
  document.querySelectorAll('.project-row').forEach(r=>r.addEventListener('click',()=>openProject(r.dataset.project,true)));
  document.querySelector('.drawer-close')?.addEventListener('click',()=>{drawer.classList.remove('active');activeProjectKey=null;document.querySelectorAll('.project-row,.drawer-list-row,.atlas-marker').forEach(e=>e.classList.remove('active'));});
  document.querySelectorAll('.stage-button').forEach(b=>b.addEventListener('click',()=>{
    const stage=b.dataset.stage;
    if(stage==='all'){
      const groups=[...document.querySelectorAll('.project-group')];
      const allOpen=groups.every(g=>g.classList.contains('open'));
      groups.forEach(g=>g.classList.toggle('open',!allOpen));
      document.querySelectorAll('.stage-button[data-stage]:not([data-stage="all"])').forEach(x=>x.classList.toggle('active',!allOpen));
      b.classList.toggle('active',!allOpen);
    } else {
      const group=document.querySelector(`.project-group[data-stage-group="${stage}"]`);
      const nowOpen=group?.classList.toggle('open');
      b.classList.toggle('active',!!nowOpen);
      const allBtn=document.querySelector('.stage-button[data-stage="all"]');
      const groups=[...document.querySelectorAll('.project-group')];
      allBtn?.classList.toggle('active',groups.every(g=>g.classList.contains('open')));
    }
  }));
  window.refreshAtlasLanguage=function(){
    renderMarkers(activeStage);
    if(activeProjectKey)openProject(activeProjectKey,false);
    document.querySelectorAll('.project-row[data-project]').forEach(btn=>{
      const p=getProject(btn.dataset.project); if(!p)return;
      const spans=btn.querySelectorAll('span');
      if(spans[1]) spans[1].textContent=p.type;
      if(spans[2]) spans[2].textContent=p.period;
    });
  };
  renderMarkers('all');
  if(currentLanguage==='es') window.refreshAtlasLanguage();

  // Zoomable / pannable atlas view
  function initZoomableMap(root){
    const layer=root?.querySelector('.atlas-zoom-layer');
    if(!root||!layer)return;
    let scale=1,tx=0,ty=0;const minScale=1,maxScale=4.5;
    let dragging=false,moved=false,startX=0,startY=0,startTx=0,startTy=0;
    const pointers=new Map();
    let pinchStartDist=0,pinchStartScale=1;

    function clamp(){
      const rect=root.getBoundingClientRect();
      if(scale<=1){tx=0;ty=0;return;}
      const minX=rect.width*(1-scale),minY=rect.height*(1-scale);
      tx=Math.min(0,Math.max(minX,tx));
      ty=Math.min(0,Math.max(minY,ty));
    }
    function apply(animate){
      layer.style.transition=animate?'transform .22s cubic-bezier(.2,.8,.2,1)':'none';
      layer.style.transform=`translate(${tx}px,${ty}px) scale(${scale})`;
      root.classList.toggle('is-zoomed',scale>1.001);
    }
    function zoomBy(factor,clientX,clientY){
      const rect=root.getBoundingClientRect();
      const px=clientX!=null?clientX-rect.left:rect.width/2;
      const py=clientY!=null?clientY-rect.top:rect.height/2;
      const prevScale=scale;
      scale=Math.min(maxScale,Math.max(minScale,scale*factor));
      const ratio=scale/prevScale;
      tx=px-(px-tx)*ratio;ty=py-(py-ty)*ratio;
      clamp();apply(true);
    }
    function zoomTo(newScale,clientX,clientY){
      const rect=root.getBoundingClientRect();
      const px=clientX!=null?clientX-rect.left:rect.width/2;
      const py=clientY!=null?clientY-rect.top:rect.height/2;
      const prevScale=scale;
      scale=Math.min(maxScale,Math.max(minScale,newScale));
      const ratio=scale/prevScale;
      tx=px-(px-tx)*ratio;ty=py-(py-ty)*ratio;
      clamp();apply(false);
    }
    root.addEventListener('wheel',e=>{
      e.preventDefault();e.stopPropagation();
      zoomBy(e.deltaY<0?1.18:1/1.18,e.clientX,e.clientY);
    },{passive:false});
    root.addEventListener('pointerdown',e=>{
      pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
      root.setPointerCapture(e.pointerId);
      if(pointers.size===2){
        dragging=false;
        const pts=[...pointers.values()];
        pinchStartDist=Math.hypot(pts[0].x-pts[1].x,pts[0].y-pts[1].y)||1;
        pinchStartScale=scale;
      } else if(pointers.size===1){
        dragging=true;moved=false;
        startX=e.clientX;startY=e.clientY;startTx=tx;startTy=ty;
      }
    });
    root.addEventListener('pointermove',e=>{
      if(!pointers.has(e.pointerId))return;
      pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
      if(pointers.size===2){
        const pts=[...pointers.values()];
        const dist=Math.hypot(pts[0].x-pts[1].x,pts[0].y-pts[1].y)||1;
        const centerX=(pts[0].x+pts[1].x)/2,centerY=(pts[0].y+pts[1].y)/2;
        moved=true;
        zoomTo(pinchStartScale*(dist/pinchStartDist),centerX,centerY);
        return;
      }
      if(!dragging||scale<=1)return;
      const dx=e.clientX-startX,dy=e.clientY-startY;
      if(Math.abs(dx)>3||Math.abs(dy)>3)moved=true;
      tx=startTx+dx;ty=startTy+dy;
      clamp();apply(false);
    });
    function endDrag(e){
      if(e&&pointers.has(e.pointerId))pointers.delete(e.pointerId);
      if(pointers.size<2)pinchStartDist=0;
      if(pointers.size===0)dragging=false;
    }
    root.addEventListener('pointerup',endDrag);
    root.addEventListener('pointercancel',endDrag);
    root.addEventListener('pointerleave',endDrag);
    root.addEventListener('dblclick',e=>{zoomBy(scale>1.5?1/scale:2.2,e.clientX,e.clientY);});
    root.addEventListener('click',e=>{
      if(moved){e.stopPropagation();e.preventDefault();moved=false;}
    },true);
    root.querySelectorAll('.atlas-zoom-btn').forEach(btn=>{
      btn.addEventListener('click',ev=>{
        ev.stopPropagation();
        const action=btn.dataset.zoomAction;
        if(action==='in')zoomBy(1.4);
        else if(action==='out')zoomBy(1/1.4);
        else{scale=1;tx=0;ty=0;apply(true);}
      });
    });
  }
  initZoomableMap(document.querySelector('.atlas-main-map'));
}
