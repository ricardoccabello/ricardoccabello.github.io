const body=document.body;
const loader=document.querySelector('.page-loader');
const themeToggle=document.querySelector('.theme-toggle');
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const safeStorage={get(key){try{return localStorage.getItem(key)}catch{return null}},set(key,value){try{localStorage.setItem(key,value)}catch{}}};
if(safeStorage.get('ricardo-theme')==='light')body.classList.add('theme-light');
window.addEventListener('load',()=>setTimeout(()=>loader?.classList.add('hidden'),reducedMotion?0:220));
function resetLoaderAfterHistory(){if(!loader)return;loader.style.transition='none';loader.classList.add('hidden');loader.style.transform='translateY(-100%)';requestAnimationFrame(()=>requestAnimationFrame(()=>{loader.style.transition='';loader.style.transform=''}))}
window.addEventListener('pageshow',event=>{const nav=performance.getEntriesByType?.('navigation')?.[0];if(event.persisted||nav?.type==='back_forward'){resetLoaderAfterHistory();body.classList.remove('cursor-active','nav-open')}});
themeToggle?.addEventListener('click',()=>{body.classList.toggle('theme-light');safeStorage.set('ricardo-theme',body.classList.contains('theme-light')?'light':'dark')});

const menuToggle=document.querySelector('.menu-toggle');
const primaryNav=document.getElementById('primary-navigation');
function setMenu(open){body.classList.toggle('nav-open',open);menuToggle?.setAttribute('aria-expanded',String(open));if(menuToggle){const label=translations[currentLanguage]?.[open?'closeMenu':'openMenu']||'Menu';menuToggle.setAttribute('aria-label',label);menuToggle.title=label}}
menuToggle?.addEventListener('click',()=>setMenu(!body.classList.contains('nav-open')));
primaryNav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
window.addEventListener('resize',()=>{if(innerWidth>760)setMenu(false)});

const dot=document.querySelector('.cursor-dot'),ring=document.querySelector('.cursor-ring');let mx=-100,my=-100,rx=-100,ry=-100;
if(dot&&ring&&!reducedMotion&&!matchMedia('(pointer:coarse)').matches){addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.transform=`translate(${mx}px,${my}px) translate(-50%,-50%)`});(function loop(){rx+=(mx-rx)*.16;ry+=(my-ry)*.16;ring.style.transform=`translate(${rx}px,${ry}px) translate(-50%,-50%)`;requestAnimationFrame(loop)})()}
document.querySelectorAll('a,button,.featured-project').forEach(el=>{el.addEventListener('mouseenter',()=>body.classList.add('cursor-active'));el.addEventListener('mouseleave',()=>body.classList.remove('cursor-active'))});

const reveals=document.querySelectorAll('.reveal');
if('IntersectionObserver' in window&&!reducedMotion){const observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.1});reveals.forEach(e=>observer.observe(e))}else reveals.forEach(e=>e.classList.add('visible'));
const romans=document.querySelectorAll('.roman-reveal');
if('IntersectionObserver' in window&&!reducedMotion){const observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('roman-visible');observer.unobserve(e.target)}}),{threshold:.2});romans.forEach(e=>observer.observe(e))}else romans.forEach(e=>e.classList.add('roman-visible'));

const themed=document.querySelectorAll('[data-bg]'),themeClasses=['bg-maison','bg-ecoalf','bg-ikks','bg-story','bg-journal'];let activeBackground='';
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(!visible)return;const bg=visible.target.dataset.bg||'';if(bg===activeBackground)return;activeBackground=bg;themeClasses.forEach(c=>body.classList.remove(c));if(['maison','ecoalf','ikks','story','journal'].includes(bg))body.classList.add(`bg-${bg}`)},{rootMargin:'-35% 0px -50% 0px',threshold:[0,.15,.35,.6]});themed.forEach(e=>observer.observe(e))}

document.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',e=>{const sel=link.getAttribute('href');if(sel==='#')return;const target=document.querySelector(sel);if(!target)return;e.preventDefault();target.scrollIntoView({behavior:reducedMotion?'auto':'smooth',block:'start'})}));
document.querySelectorAll('.project-link').forEach(link=>link.addEventListener('click',e=>{if(e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||link.target==='_blank')return;e.preventDefault();loader?.classList.remove('hidden');if(loader)loader.style.transform='translateY(0)';setTimeout(()=>location.href=link.href,reducedMotion?0:420)}));
const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();

document.addEventListener('contextmenu',e=>{if(e.target.closest('.project-image,.full-image,.drawer-image,.protected-media'))e.preventDefault()});document.addEventListener('dragstart',e=>{if(e.target.closest('.project-image,.full-image,.drawer-image,.protected-media'))e.preventDefault()});
const lightbox=document.createElement('div');lightbox.className='image-lightbox';lightbox.setAttribute('role','dialog');lightbox.setAttribute('aria-modal','true');lightbox.innerHTML='<button class="image-lightbox-close" type="button" aria-label="Close">×</button><img class="protected-media" draggable="false" alt="">';document.body.append(lightbox);const lightboxImg=lightbox.querySelector('img');
function openLightbox(src,alt=''){lightboxImg.src=src;lightboxImg.alt=alt;lightbox.classList.add('active');lightbox.querySelector('button').focus()}function closeLightbox(){lightbox.classList.remove('active');lightboxImg.removeAttribute('src')}
document.addEventListener('click',e=>{
  const thumb=e.target.closest('.drawer-image[data-lightbox-src]');
  if(thumb){openLightbox(thumb.dataset.lightboxSrc,thumb.querySelector('img')?.alt||'');return}
  const galleryImg=e.target.closest('.photo-grid img,.project-image .project-media-photo,.hero-render img');
  if(galleryImg&&!galleryImg.closest('a')){e.preventDefault();openLightbox(galleryImg.currentSrc||galleryImg.src,galleryImg.alt||'');return}
  if(e.target===lightbox||e.target.closest('.image-lightbox-close'))closeLightbox();
});

const lineLayer=document.querySelector('.construction-lines'),vignette=document.querySelector('.ambient-vignette');function setAmbientMotion(x,y){const px=Math.max(-1,Math.min(1,x)),py=Math.max(-1,Math.min(1,y));lineLayer?.style.setProperty('--line-x',`${px*3}px`);lineLayer?.style.setProperty('--line-y',`${py*3}px`);if(vignette)vignette.style.transform=`translate3d(${px*.8}px,${py*.8}px,0) scale(1.004)`}
addEventListener('pointermove',e=>{if(matchMedia('(pointer:coarse)').matches||reducedMotion)return;setAmbientMotion((e.clientX/innerWidth-.5)*2,(e.clientY/innerHeight-.5)*2)},{passive:true});

const baseTranslations={"en":{"navWork":"Work","navPractice":"Working with me","navMap":"Atlas","navStory":"Evolution","navJournal":"Journal","navContact":"Contact","themeToggle":"Switch colour mode","openMenu":"Open navigation menu","closeMenu":"Close navigation menu","heroEyebrow":"Retail and spatial design · technical development · furniture","heroTitle":"My work begins long before a space is made and continues long after it has been drawn.","heroBody":"I turn design concepts into clear layouts, technical documents and information that workshops can use. I trained in architecture in Venezuela and now work in Spain on retail, furniture and spatial design.","heroLink":"View selected work","positionLabel":"How I work","positionText":"A drawing is useful when the client, workshop and project lead can read the same decision without having to fill in the gaps.","selectedWorkLabel":"Selected work","selectedWorkTitle":"Projects that connect concept, documentation and production","ecoalfQuestion":"How can one retail system adapt to very different spaces?","ecoalfLabel":"Technical development for retail","ecoalfTitle":"Ecoalf across Spain and Portugal","ecoalfBody":"Layouts, plans, elevations and furniture schedules for permanent corners and temporary spaces inside El Corte Inglés.","openCase":"View case study","observationLabel":"Working note","observationText":"Reusing furniture works when the new layout gives every existing piece a clear reason to remain.","ikksQuestion":"What does a temporary store need before work begins on site?","ikksLabel":"Preparing a temporary retail environment","ikksTitle":"IKKS temporary space in San Sebastián de los Reyes","ikksBody":"A clear technical package for a short installation window: dimensions, elevations, fitting rooms, storage and point of sale resolved before work began on site.","continuousConversation":"The finished space is visible. The preparation behind it usually is not.","japonQuestion":"How can one brand stay recognisable across different spaces and formats?","japonLabel":"Connecting brand, space and communication","japonTitle":"Japon Market 24h","japonBody":"Interior layouts, technical drawings, 3D visualisation, packaging, editorial pieces, social media and web content developed as parts of the same visual system.","practiceLabel":"Working with me","practiceTitle":"What I bring to a project","practiceDesignTitle":"Retail & spatial design","practiceDesignBody":"Layouts, circulation, spaces shaped by the brand and concepts grounded in how a space will be used.","practiceTechnicalTitle":"Technical development","practiceTechnicalBody":"Site surveys, dimensions, plans, elevations, details and the resolution of project constraints.","practiceProductionTitle":"Production preparation","practiceProductionBody":"Procurement tracking, material availability checks and coherent packages prepared for fabrication and handover.","practiceVisualTitle":"Furniture & visual direction","practiceVisualBody":"Furniture concepts, 3D visualisation, brand identity, presentations and digital communication.","practiceToolsLabel":"Selected tools","atlasSearchLabel":"Search projects","atlasSearchPlaceholder":"City, brand or project type","clearSearch":"Clear search","atlasResultLabel":"entries visible","atlasNoResults":"No entries match the current search and career stage filter.","atlasFiltersLabel":"Filter the project atlas by career stage","builtWorkLabel":"Project atlas","builtWorkTitle":"A career mapped through places, roles and project types","builtWorkIntro":"This map brings together the projects I have worked on. Each place shows my role and how my experience has developed through interiors, retail identity and technical work.","atlasAphorism":"Clear information saves time long before a project reaches the workshop.","stageAll":"All work","stageFoundations":"Foundations","stageResidential":"Interiors & residential design","stageIdentity":"Retail identity","stageProduction":"Technical retail development","mapCountries":"Venezuela, Spain and Portugal","mapCaption":"Selected work developed across three countries","regionIberia":"Spain & Portugal","regionVenezuela":"Venezuela","mapIndexLabel":"Project directory","mapIndexHint":"The directory follows the active map region. Projects in the same city are grouped into one location, while work developed throughout Spain remains listed without an artificial pin.","close":"Close","closeProject":"Close project information","drawerViewProject":"View full project","selectProject":"Choose a project location","selectProjectText":"Select a point on the map or a place in the directory to see the work connected to it.","sharedLocationTitle":"Projects at this location","sharedLocationText":"More than one project is connected to this place. Choose the one you want to inspect.","period":"Period","type":"Type","role":"Role","projectImage":"Project image","drawingDetail":"Drawing or detail","imagesLater":"Images can be added here as the portfolio develops.","location":"Location","work":"Work","stage":"Stage","zoomIn":"Zoom in","zoomOut":"Zoom out","resetZoom":"Reset map view","clusterProjects":"projects","storyLabel":"Career evolution","storyTitle":"One discipline kept leading to the next","storyIntro":"Architecture became interiors; interiors expanded into retail and identity; technical development brought the work closer to production. Maison Caligari now brings those strands together through furniture and brand direction.","storyAphorism":"The value of a hybrid profile is not doing everything. It is understanding how each decision affects the next one.","story1Title":"Architecture taught me to think through drawings.","story1Body":"I started in Venezuela with plans, 3D models and architectural visualisation. That training gave me the spatial and technical foundation I still rely on today.","story2Title":"Moving to Spain broadened both my design and organisational skills.","story2Body":"From 2017 to 2022 I moved between interior design, graphic work and administrative support, learning how visual decisions and well organised documentation support the same project.","story3Title":"Retail made every decision immediate.","story3Body":"At Japon Market 24h, circulation, product, visibility, furniture and brand language all competed for the same limited space. The role connected interiors with packaging, communication and digital content.","story4Title":"Working closer to production changed my priorities.","story4Body":"Since 2025, I have worked closer to the production side of projects, considering dimensions, materials, procurement, transport constraints and assembly logic from an early stage. My responsibility is to prepare a complete, coherent package for the people responsible for fabrication and installation.","story5Title":"I am looking for the next step in an international team.","story5Body":"Germany and the Netherlands interest me because design, industry and craft often sit close together. I am looking for a role where spatial thinking and technical development are valued equally.","journalLabel":"Journal","journalTitle":"Notes from project preparation","journalIntro":"Notes on surveys, reuse, procurement, drawings and production. Each one looks at a practical decision behind a finished space.","journalSurveyLabel":"Survey","journalSurveyTitle":"What a useful retail survey needs to communicate","journalReuseLabel":"Reuse","journalReuseTitle":"When existing furniture deserves a second layout","journalInstallationLabel":"Preparation","journalInstallationTitle":"What happens before an overnight retail installation","journalProductionLabel":"Production","journalProductionTitle":"Five checks before a project goes to production","readNote":"Read note","contactTitle":"Open to international opportunities where design and technical clarity belong in the same role.","locationFooter":"Gijón, Spain · Open to relocation","behanceInteriors":"Behance: Interiors","behanceSocial":"Behance: Visual communication","maisonCaligariLink":"Maison Caligari: Brand website","residentialTitle":"Asturias and Galicia","productionTitle":"Fashion retail and technical development","period20152017":"2015 to 2017","period20172021":"2017 to 2021","period20222024":"2022 to 2024","period2025Present":"2025 to present","stat1":"project entries in the atlas","stat2":"automated store applications","stat3":"countries connected by the work","pageTitle":"Ricardo Cabello | Retail & Spatial Designer","pageDescription":"Portfolio of Ricardo Cabello, a retail and spatial designer connecting concept, technical documentation, furniture and production preparation.","skipContent":"Skip to content","ariaEcoalf":"Open the Ecoalf case study","ariaIkks":"Open the IKKS case study","ariaJapon":"Open the Japon Market 24h case study","careerStagesLabel":"Filter the atlas by career stage","stageAllPeriod":"2015 to present","atlasReset":"Reset filters","atlasActiveAll":"All career stages are visible.","atlasSearchFor":"Search","atlasFilteredBy":"Filtered by","regionTabsLabel":"Choose the map region","regionPeninsula":"Iberian Peninsula","regionCanary":"Canary Islands","regionNationwide":"Nationwide work","mapAltPeninsula":"Detailed map of mainland Spain and Portugal","mapAltCanary":"Detailed map of the Canary Islands","mapAltVenezuela":"Detailed map of Venezuela","atlasMapHint":"On mobile, pinch with two fingers to zoom and drag when the map is enlarged. You can also use the zoom controls.","atlasKeyboardHint":"Map focused. Use plus and minus to zoom, arrow keys to move, and zero to reset.","atlasZoomLevel":"Zoom","atlasMapNoLocations":"No mapped locations are visible in this region with the current filters.","atlasNationwideOnly":"This result represents work across Spain rather than one artificial map point. Open it from the project directory.","atlasSwitchRegion":"Open region","atlasProjectsInArea":"Projects in this area","atlasLocations":"locations","atlasLocation":"location","atlasProjects":"projects","atlasProject":"project","atlasBackIndex":"Back to project directory","atlasDirectoryCount":"project entries across","atlasDirectoryLocations":"mapped locations","atlasEntryVisible":"entry visible","atlasEntriesVisible":"entries visible","fitResults":"Fit visible locations","fitResultsShort":"Fit","atlasPlace":"location","atlasPlaces":"locations","atlasRegionCount":"mapped locations","atlasLegendLocation":"One location","atlasLegendShared":"Several projects in one location","atlasLegendCluster":"Nearby locations grouped at this zoom","atlasFitStatus":"Map fitted to the visible locations.","atlasClusterStatus":"Map zoomed to separate nearby locations.","atlasRegionStatus":"Map region changed to","atlasDirectoryNationwide":"plus one nationwide network","atlasAreaText":"Several nearby locations are still grouped at this zoom. Choose the project you want to inspect.","atlasProjectEntry":"project entry","atlasProjectEntries":"project entries","atlasMappedLocation":"mapped location","atlasMappedLocations":"mapped locations","atlasToolbarLabel":"Search the atlas and control the current view","atlasNationwideNetwork":"one nationwide network","expandAtlas":"Expand project atlas","collapseAtlas":"Close expanded atlas","atlasExpandedStatus":"The project atlas is expanded. Press Escape or the close control to return to the page.","atlasCollapsedStatus":"The project atlas has returned to the page.","maisonQuestion":"How can gothic architecture become a contemporary furniture language?","maisonLabel":"Independent furniture, brand and visual direction","maisonTitle":"Maison Caligari","maisonBody":"An independent project joining furniture design, product development, brand identity, art direction, 3D visualisation and digital communication in one coherent gothic design system.","ariaMaison":"Open the Maison Caligari case study","maisonProjectLink":"Maison Caligari: Furniture case study","featuredProject":"Featured project","practiceDocumentationTitle":"Project documentation","practiceDocumentationBody":"Clear, consistent information that allows clients, purchasing, workshops and project leads to read the same decisions.","metricYears":"years across design and technical development","metricCountries":"countries connected by the work","metricEntries":"mapped project entries","metricApplications":"automated store applications","atlasStageSelectLabel":"Career stage","timeline1Title":"Architectural design","timeline1Body":"Plans, 3D modelling and visualisation established the spatial and technical foundation of my work.","timeline2Title":"Interior design","timeline2Body":"Residential and commercial projects broadened my understanding of use, materials and project documentation.","timeline3Title":"Retail & brand identity","timeline3Body":"Store interiors, packaging and digital communication became parts of one recognisable customer experience.","timeline4Title":"Technical development","timeline4Body":"My work moved closer to procurement, materials and production preparation for retail projects across Spain and Portugal.","timeline5Title":"Furniture & brand direction","timeline5Body":"Maison Caligari became a laboratory for product design, visualisation, identity, web and editorial direction.","timeline6Title":"International practice","timeline6Body":"I am looking for a European team where spatial thinking, technical clarity and design culture are valued equally.","opportunityCities":"Berlin · Leipzig · Amsterdam · Rotterdam · Copenhagen","contactSignoff":"Let’s build something meaningful.","browseLocations":"Browse project locations"},"es":{"navWork":"Proyectos","navPractice":"Cómo puedo ayudarte","navMap":"Atlas","navStory":"Evolución","navJournal":"Notas","navContact":"Contacto","themeToggle":"Cambiar el modo de color","openMenu":"Abrir menú de navegación","closeMenu":"Cerrar menú de navegación","heroEyebrow":"Diseño retail y espacial · desarrollo técnico · mobiliario","heroTitle":"Mi trabajo comienza mucho antes de fabricar un espacio y termina mucho después de dibujarlo.","heroBody":"Convierto conceptos de diseño en distribuciones claras, documentación técnica e información lista para producción. Soy Ricardo, graduado en Arquitectura en Venezuela y trabajo desde España en retail, mobiliario y diseño espacial.","heroLink":"Ver proyectos seleccionados","positionLabel":"Mi forma de trabajar","positionText":"Un plano es útil cuando el cliente, el taller y la persona responsable del proyecto pueden leer la misma decisión sin tener que completar los vacíos.","selectedWorkLabel":"Proyectos seleccionados","selectedWorkTitle":"Proyectos que conectan concepto, documentación y ejecución","ecoalfQuestion":"¿Cómo puede adaptarse un mismo sistema retail a espacios muy distintos?","ecoalfLabel":"Desarrollo técnico para retail","ecoalfTitle":"Ecoalf en España y Portugal","ecoalfBody":"Distribuciones, plantas, alzados, inventarios de mobiliario e información preparada para producción en corners permanentes y espacios temporales de El Corte Inglés.","openCase":"Ver proyecto","observationLabel":"Nota de trabajo","observationText":"Reutilizar mobiliario funciona cuando la nueva distribución da a cada pieza una razón clara para permanecer.","ikksQuestion":"¿Qué necesita una tienda temporal antes de empezar los trabajos en el espacio?","ikksLabel":"Preparación de un espacio retail temporal","ikksTitle":"Espacio temporal de IKKS en San Sebastián de los Reyes","ikksBody":"Un paquete técnico claro para una ventana de montaje breve: cotas, alzados, probadores, almacén y zona de caja resueltos antes de comenzar los trabajos en el espacio.","continuousConversation":"El espacio terminado se ve. Todo el trabajo previo, casi nunca.","japonQuestion":"¿Cómo se mantiene reconocible una marca en espacios y formatos diferentes?","japonLabel":"Conectar marca, espacio y comunicación","japonTitle":"Japon Market 24h","japonBody":"Distribuciones interiores, planos técnicos, visualización 3D, packaging, piezas editoriales, redes sociales y contenido web desarrollados dentro de un mismo sistema visual.","practiceLabel":"Cómo puedo ayudarte","practiceTitle":"Lo que aporto a un proyecto","practiceDesignTitle":"Diseño retail y espacial","practiceDesignBody":"Distribuciones, circulación, espacios vinculados a la marca y conceptos pensados desde el uso real.","practiceTechnicalTitle":"Desarrollo técnico","practiceTechnicalBody":"Levantamientos, cotas, planos, alzados, detalles y resolución de las condiciones del proyecto.","practiceProductionTitle":"Preparación para producción","practiceProductionBody":"Seguimiento de compras, comprobación de materiales y paquetes coherentes preparados para fabricación y entrega.","practiceVisualTitle":"Mobiliario y dirección visual","practiceVisualBody":"Conceptos de mobiliario, visualización 3D, identidad, presentaciones y comunicación digital.","practiceToolsLabel":"Herramientas seleccionadas","atlasSearchLabel":"Buscar proyectos","atlasSearchPlaceholder":"Ciudad, marca o tipo de proyecto","clearSearch":"Borrar búsqueda","atlasResultLabel":"entradas visibles","atlasNoResults":"Ninguna entrada coincide con la búsqueda y la etapa profesional seleccionadas.","atlasFiltersLabel":"Filtrar el atlas de proyectos por etapa profesional","builtWorkLabel":"Atlas de proyectos","builtWorkTitle":"Una trayectoria cartografiada por lugares, funciones y tipos de proyecto","builtWorkIntro":"Este mapa reúne los proyectos en los que he trabajado. Cada lugar muestra cuál fue mi papel y cómo ha evolucionado mi experiencia en interiores, identidad retail y desarrollo técnico.","atlasAphorism":"La información clara ahorra tiempo mucho antes de que el proyecto llegue al taller.","stageAll":"Todo","stageFoundations":"Inicios","stageResidential":"Interiorismo y diseño residencial","stageIdentity":"Identidad retail","stageProduction":"Desarrollo técnico retail","mapCountries":"Venezuela, España y Portugal","mapCaption":"Selección de trabajos desarrollados en tres países","regionIberia":"España y Portugal","regionVenezuela":"Venezuela","mapIndexLabel":"Directorio de proyectos","mapIndexHint":"El directorio sigue la región activa del mapa. Los proyectos de una misma ciudad se agrupan en una sola ubicación, mientras que el trabajo de alcance nacional aparece sin inventar un punto geográfico.","close":"Cerrar","closeProject":"Cerrar información del proyecto","drawerViewProject":"Ver proyecto completo","selectProject":"Elige una ubicación","selectProjectText":"Selecciona un punto del mapa o un lugar del directorio para ver el trabajo relacionado.","sharedLocationTitle":"Proyectos en esta ubicación","sharedLocationText":"Hay más de un proyecto relacionado con este lugar. Elige cuál quieres consultar.","period":"Periodo","type":"Tipo","role":"Rol","projectImage":"Imagen del proyecto","drawingDetail":"Plano o detalle","imagesLater":"Aquí se podrán añadir imágenes a medida que avance el portfolio.","location":"Ubicación","work":"Trabajo","stage":"Etapa","zoomIn":"Acercar mapa","zoomOut":"Alejar mapa","resetZoom":"Restablecer vista del mapa","clusterProjects":"proyectos","storyLabel":"Evolución profesional","storyTitle":"Una disciplina fue conduciendo a la siguiente","storyIntro":"La arquitectura se convirtió en interiorismo; el interiorismo se amplió hacia el retail y la identidad; y el desarrollo técnico acercó mi trabajo a la producción. Maison Caligari reúne ahora esas líneas mediante mobiliario y dirección de marca.","storyAphorism":"El valor de un perfil híbrido no está en hacerlo todo, sino en entender cómo cada decisión afecta a la siguiente.","story1Title":"La arquitectura me enseñó a pensar a través del dibujo.","story1Body":"Empecé en Venezuela trabajando con planos, modelos 3D y visualización arquitectónica. Esa formación me dio la base espacial y técnica que sigue presente en todo lo que hago.","story2Title":"Vivir y trabajar en España amplió mis capacidades de diseño y organización.","story2Body":"Entre 2017 y 2022 pasé por el interiorismo, el diseño gráfico y el apoyo administrativo, y aprendí que las decisiones visuales y una documentación bien organizada sostienen el mismo proyecto.","story3Title":"El retail hizo que cada decisión fuera inmediata.","story3Body":"En Japon Market 24h, circulación, producto, visibilidad, mobiliario e identidad competían dentro de un espacio limitado. El puesto conectó el interiorismo con el packaging, la comunicación y el contenido digital.","story4Title":"Trabajar más cerca de producción cambió mis prioridades.","story4Body":"Desde 2025 trabajo más cerca de la fase de producción, teniendo en cuenta desde el inicio las dimensiones, los materiales, las compras, las limitaciones de transporte y la lógica de ensamblaje. Mi responsabilidad es preparar un paquete completo y coherente para las personas responsables de fabricación y montaje.","story5Title":"Busco el siguiente paso dentro de un equipo internacional.","story5Body":"Me atraen Alemania y Países Bajos porque diseño, industria y oficio suelen trabajar muy cerca. Busco un puesto donde se valore por igual el pensamiento espacial y el desarrollo técnico.","journalLabel":"Notas","journalTitle":"Notas sobre cómo preparo un proyecto","journalIntro":"Notas sobre levantamientos, reutilización, compras, planos y producción. Cada una se centra en una decisión práctica detrás de un espacio terminado.","journalSurveyLabel":"Levantamiento","journalSurveyTitle":"Qué debe comunicar un buen levantamiento retail","journalReuseLabel":"Reutilización","journalReuseTitle":"Cuándo merece la pena replantear el mobiliario existente","journalInstallationLabel":"Preparación","journalInstallationTitle":"Qué ocurre antes de un montaje retail nocturno","journalProductionLabel":"Producción","journalProductionTitle":"Cinco revisiones antes de enviar un proyecto a producción","readNote":"Leer nota","contactTitle":"Abierto a oportunidades internacionales donde el diseño y la claridad técnica formen parte del mismo puesto.","locationFooter":"Gijón, España · Disponible para reubicación","behanceInteriors":"Behance: Interiores","behanceSocial":"Behance: Comunicación visual","maisonCaligariLink":"Maison Caligari: Web de la marca","residentialTitle":"Asturias y Galicia","productionTitle":"Retail de moda y desarrollo técnico","period20152017":"2015 a 2017","period20172021":"2017 a 2021","period20222024":"2022 a 2024","period2025Present":"2025 a actualidad","stat1":"proyectos incluidos en el atlas","stat2":"aplicaciones para tiendas automáticas","stat3":"países conectados por el trabajo","pageTitle":"Ricardo Cabello | Diseñador retail y espacial","pageDescription":"Portfolio de Ricardo Cabello, diseñador retail y espacial que conecta concepto, documentación técnica, mobiliario y preparación para producción.","skipContent":"Saltar al contenido","ariaEcoalf":"Abrir el proyecto de Ecoalf","ariaIkks":"Abrir el proyecto de IKKS","ariaJapon":"Abrir el proyecto de Japon Market 24h","careerStagesLabel":"Filtrar el atlas por etapa profesional","stageAllPeriod":"2015 a actualidad","atlasReset":"Restablecer filtros","atlasActiveAll":"Todas las etapas profesionales están visibles.","atlasSearchFor":"Búsqueda","atlasFilteredBy":"Filtrado por","regionTabsLabel":"Elegir la región del mapa","regionPeninsula":"Península ibérica","regionCanary":"Islas Canarias","regionNationwide":"Trabajo de alcance nacional","mapAltPeninsula":"Mapa detallado de la España peninsular y Portugal","mapAltCanary":"Mapa detallado de las Islas Canarias","mapAltVenezuela":"Mapa detallado de Venezuela","atlasMapHint":"En móvil, pellizca con dos dedos para ampliar y arrastra cuando el mapa esté acercado. También puedes usar los controles de zoom.","atlasKeyboardHint":"Mapa enfocado. Usa más y menos para ampliar, las flechas para desplazarte y cero para restablecer.","atlasZoomLevel":"Zoom","atlasMapNoLocations":"No hay ubicaciones visibles en esta región con los filtros actuales.","atlasNationwideOnly":"Este resultado representa trabajo desarrollado en distintos puntos de España, no una ubicación concreta. Puedes abrirlo desde el directorio de proyectos.","atlasSwitchRegion":"Abrir región","atlasProjectsInArea":"Proyectos en esta zona","atlasLocations":"ubicaciones","atlasLocation":"ubicación","atlasProjects":"proyectos","atlasProject":"proyecto","atlasBackIndex":"Volver al directorio de proyectos","atlasDirectoryCount":"proyectos distribuidos en","atlasDirectoryLocations":"ubicaciones cartografiadas","atlasEntryVisible":"entrada visible","atlasEntriesVisible":"entradas visibles","fitResults":"Encajar ubicaciones visibles","fitResultsShort":"Encajar","atlasPlace":"ubicación","atlasPlaces":"ubicaciones","atlasRegionCount":"ubicaciones en el mapa","atlasLegendLocation":"Una ubicación","atlasLegendShared":"Varios proyectos en una ubicación","atlasLegendCluster":"Ubicaciones cercanas agrupadas con este zoom","atlasFitStatus":"El mapa se ha ajustado a las ubicaciones visibles.","atlasClusterStatus":"El mapa se ha acercado para separar ubicaciones próximas.","atlasRegionStatus":"La región del mapa ha cambiado a","atlasDirectoryNationwide":"más una red de alcance nacional","atlasAreaText":"Varias ubicaciones cercanas siguen agrupadas con este nivel de zoom. Elige el proyecto que quieres consultar.","atlasProjectEntry":"proyecto","atlasProjectEntries":"proyectos","atlasMappedLocation":"ubicación cartografiada","atlasMappedLocations":"ubicaciones cartografiadas","atlasToolbarLabel":"Buscar en el atlas y controlar la vista actual","atlasNationwideNetwork":"una red de alcance nacional","expandAtlas":"Ampliar atlas de proyectos","collapseAtlas":"Cerrar atlas ampliado","atlasExpandedStatus":"El atlas de proyectos está ampliado. Pulsa Escape o el control de cierre para volver a la página.","atlasCollapsedStatus":"El atlas de proyectos ha vuelto a la página.","maisonQuestion":"¿Cómo puede la arquitectura gótica convertirse en un lenguaje de mobiliario contemporáneo?","maisonLabel":"Proyecto independiente de mobiliario, marca y dirección visual","maisonTitle":"Maison Caligari","maisonBody":"Un proyecto independiente que reúne diseño de mobiliario, desarrollo de producto, identidad de marca, dirección artística, visualización 3D y comunicación digital dentro de un mismo sistema de diseño gótico.","ariaMaison":"Abrir el proyecto de Maison Caligari","maisonProjectLink":"Maison Caligari: Proyecto de mobiliario","featuredProject":"Proyecto destacado","practiceDocumentationTitle":"Documentación de proyecto","practiceDocumentationBody":"Información clara y coherente para que cliente, compras, taller y responsables del proyecto lean las mismas decisiones.","metricYears":"años entre diseño y desarrollo técnico","metricCountries":"países conectados por el trabajo","metricEntries":"entradas de proyecto en el atlas","metricApplications":"aplicaciones para tiendas automáticas","atlasStageSelectLabel":"Etapa profesional","timeline1Title":"Diseño arquitectónico","timeline1Body":"Los planos, el modelado 3D y la visualización establecieron la base espacial y técnica de mi trabajo.","timeline2Title":"Diseño de interiores","timeline2Body":"Los proyectos residenciales y comerciales ampliaron mi comprensión del uso, los materiales y la documentación.","timeline3Title":"Retail e identidad de marca","timeline3Body":"El interior de las tiendas, el packaging y la comunicación digital pasaron a formar una misma experiencia reconocible.","timeline4Title":"Desarrollo técnico","timeline4Body":"Mi trabajo se acercó a compras, materiales y preparación para producción en proyectos retail de España y Portugal.","timeline5Title":"Mobiliario y dirección de marca","timeline5Body":"Maison Caligari se convirtió en un laboratorio de producto, visualización, identidad, web y dirección editorial.","timeline6Title":"Práctica internacional","timeline6Body":"Busco un equipo europeo donde el pensamiento espacial, la claridad técnica y la cultura de diseño se valoren por igual.","opportunityCities":"Berlín · Leipzig · Ámsterdam · Róterdam · Copenhague","contactSignoff":"Construyamos algo con sentido.","browseLocations":"Explorar ubicaciones de proyectos"}};
const translations={en:{...baseTranslations.en,...(window.pageTranslations?.en||{})},es:{...baseTranslations.es,...(window.pageTranslations?.es||{})}};
let currentLanguage=['en','es'].includes(safeStorage.get('ricardo-language'))?safeStorage.get('ricardo-language'):'en';
function applyLanguage(language){currentLanguage=language;document.documentElement.lang=language;safeStorage.set('ricardo-language',language);document.querySelectorAll('[data-i18n]').forEach(el=>{const value=translations[language]?.[el.dataset.i18n];if(value!==undefined)el.textContent=value});document.querySelectorAll('[data-i18n-aria]').forEach(el=>{const value=translations[language]?.[el.dataset.i18nAria];if(value!==undefined){el.setAttribute('aria-label',value);el.title=value}});document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{const value=translations[language]?.[el.dataset.i18nPlaceholder];if(value!==undefined)el.setAttribute('placeholder',value)});document.querySelectorAll('.language-button').forEach(b=>{const on=b.dataset.language===language;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on))});document.title=translations[language]?.pageTitle||document.title;const meta=document.querySelector('meta[name="description"]');if(meta&&translations[language]?.pageDescription)meta.content=translations[language].pageDescription;setMenu(false);window.refreshAtlasLanguage?.()}
document.querySelectorAll('.language-button').forEach(b=>b.addEventListener('click',()=>applyLanguage(b.dataset.language)));

const localizedProjectData={"es":{"venezuela":{"title":"Caracas, Venezuela","summary":"El inicio de mi trayectoria, centrado en delineación arquitectónica, modelado 3D y visualización para proyectos de arquitectura e interiorismo.","period":"2015 a 2017","type":"Delineación arquitectónica","role":"Delineación arquitectónica, modelado 3D y visualización"},"gijon-residential":{"title":"Gijón","summary":"Tres viviendas unifamiliares privadas desarrolladas durante mi etapa de diseño residencial.","period":"2017 a 2021","type":"Residencial privado","role":"Diseño residencial e interior"},"oviedo-residential":{"title":"Oviedo","summary":"Dos viviendas unifamiliares privadas desarrolladas para clientes en Asturias.","period":"2017 a 2021","type":"Residencial privado","role":"Diseño residencial e interior"},"langreo":{"title":"Langreo","summary":"Vivienda unifamiliar privada desarrollada durante mi etapa de diseño residencial en Asturias.","period":"2017 a 2021","type":"Residencial privado","role":"Diseño residencial y dibujo técnico"},"laviana":{"title":"Pola de Laviana","summary":"Diseño de una vivienda privada. La fase de ejecución fue gestionada por el equipo de obra.","period":"2017 a 2021","type":"Residencial privado","role":"Desarrollo de diseño"},"regueras":{"title":"Las Regueras, Tahoces","summary":"Vivienda unifamiliar privada desarrollada en un contexto rural de Asturias.","period":"2017 a 2021","type":"Residencial privado","role":"Diseño residencial y dibujo técnico"},"coruna-commercial":{"title":"A Coruña","summary":"Proyecto de adecuación comercial desarrollado durante mi etapa en Innova y Mejora.","period":"2017 a 2021","type":"Adecuación comercial","role":"Diseño interior y técnico"},"automatic-stores":{"title":"Red en toda España","summary":"Sistemas visuales, packaging y comunicación aplicados en más de 70 tiendas automáticas distribuidas por España.","period":"2022 a 2024","type":"Red de retail automatizado","role":"Branding, packaging y sistemas visuales"},"japon-gijon":{"title":"Gijón","summary":"Diseño de tienda e identidad visual para Japon Market 24h.","period":"2022 a 2024","type":"Identidad retail","role":"Diseño interior, gráfico y de marca"},"japon-oviedo":{"title":"Oviedo","summary":"Diseño de tienda e identidad visual para Japon Market 24h.","period":"2022 a 2024","type":"Identidad retail","role":"Diseño interior, gráfico y de marca"},"japon-aviles":{"title":"Avilés","summary":"Diseño de tienda e identidad visual para Japon Market 24h.","period":"2022 a 2024","type":"Identidad retail","role":"Diseño interior, gráfico y de marca"},"japon-lugo":{"title":"Lugo","summary":"Diseño de tienda e identidad visual para Japon Market 24h.","period":"2022 a 2024","type":"Identidad retail","role":"Diseño interior, gráfico y de marca"},"japon-madrid":{"title":"Móstoles, Madrid","summary":"Diseño de tienda e identidad visual para Japon Market 24h.","period":"2022 a 2024","type":"Identidad retail","role":"Diseño interior, gráfico y de marca"},"japon-las-palmas":{"title":"Las Palmas de Gran Canaria","summary":"Diseño de tienda e identidad visual para Japon Market 24h.","period":"2022 a 2024","type":"Identidad retail","role":"Diseño interior, gráfico y de marca"},"japon-tenerife":{"title":"Tenerife","summary":"Diseño de tienda e identidad visual para Japon Market 24h.","period":"2022 a 2024","type":"Identidad retail","role":"Diseño interior, gráfico y de marca"},"japon-leon":{"title":"León","summary":"Diseño de tienda e identidad visual para Japon Market 24h.","period":"2022 a 2024","type":"Identidad retail","role":"Diseño interior, gráfico y de marca"},"ecoalf-vigo":{"title":"Vigo","summary":"Ecoalf Man y Woman en El Corte Inglés.","period":"2025 a actualidad","type":"Retail de moda","role":"Desarrollo técnico, seguimiento de compras y preparación para producción"},"ecoalf-alicante":{"title":"Alicante","summary":"Espacio temporal de Ecoalf Woman en El Corte Inglés Alicante.","period":"2025 a actualidad","type":"Retail de moda","role":"Desarrollo técnico, seguimiento de compras y preparación para producción"},"ecoalf-zaragoza":{"title":"Zaragoza","summary":"Ecoalf Man y Woman en El Corte Inglés.","period":"2025 a actualidad","type":"Retail de moda","role":"Desarrollo técnico, seguimiento de compras y preparación para producción"},"ecoalf-murcia":{"title":"Murcia","summary":"Ecoalf Woman en El Corte Inglés Murcia.","period":"2025 a actualidad","type":"Retail de moda","role":"Desarrollo técnico, seguimiento de compras y preparación para producción"},"ecoalf-pozuelo":{"title":"Pozuelo, Madrid","summary":"Ecoalf Man en El Corte Inglés Pozuelo.","period":"2025 a actualidad","type":"Retail de moda","role":"Desarrollo técnico, seguimiento de compras y preparación para producción"},"ecoalf-salamanca":{"title":"Salamanca","summary":"Ecoalf Woman en El Corte Inglés Salamanca.","period":"2025 a actualidad","type":"Retail de moda","role":"Desarrollo técnico, seguimiento de compras y preparación para producción"},"ecoalf-burgos":{"title":"Burgos","summary":"Ecoalf Man y Woman en El Corte Inglés Burgos.","period":"2025 a actualidad","type":"Retail de moda","role":"Desarrollo técnico, seguimiento de compras y preparación para producción"},"ecoalf-lisbon":{"title":"Lisboa","summary":"Ecoalf Man y Woman en El Corte Inglés Lisboa.","period":"2025 a actualidad","type":"Retail de moda","role":"Desarrollo técnico, seguimiento de compras y preparación para producción"},"ecoalf-gaia":{"title":"Vila Nova de Gaia","summary":"Ecoalf Man y Woman en El Corte Inglés Gaia.","period":"2025 a actualidad","type":"Retail de moda","role":"Desarrollo técnico, seguimiento de compras y preparación para producción"},"ecoalf-valderas":{"title":"San José de Valderas, Madrid","summary":"Ecoalf Man en El Corte Inglés San José de Valderas.","period":"2025 a actualidad","type":"Retail de moda","role":"Desarrollo técnico, seguimiento de compras y preparación para producción"},"ecoalf-barcelona":{"title":"Barcelona","summary":"Ecoalf Man en El Corte Inglés Diagonal.","period":"2025 a actualidad","type":"Retail de moda","role":"Desarrollo técnico, seguimiento de compras y preparación para producción"},"ecoalf-tarragona":{"title":"Tarragona","summary":"Ecoalf Man en El Corte Inglés Tarragona.","period":"2025 a actualidad","type":"Retail de moda","role":"Desarrollo técnico, seguimiento de compras y preparación para producción"},"ecoalf-sanchinarro":{"title":"Sanchinarro, Madrid","summary":"Ecoalf Man en El Corte Inglés Sanchinarro.","period":"2025 a actualidad","type":"Retail de moda","role":"Desarrollo técnico, seguimiento de compras y preparación para producción"},"ecoalf-marbella":{"title":"Marbella","summary":"Ecoalf Woman en El Corte Inglés Marbella.","period":"2025 a actualidad","type":"Retail de moda","role":"Desarrollo técnico, seguimiento de compras y preparación para producción"},"save-the-duck-santander":{"title":"Santander","summary":"Proyecto retail temporal de Save The Duck en El Corte Inglés Santander.","period":"2025 a actualidad","type":"Espacio temporal de moda","role":"Planos técnicos, seguimiento de materiales y preparación del proyecto"},"ikks-san-sebastian-reyes":{"title":"San Sebastián de los Reyes, Madrid","summary":"Espacio temporal de IKKS preparado para una ventana de montaje breve dentro de un centro comercial en funcionamiento.","period":"2025 a actualidad","type":"Espacio temporal de moda","role":"Distribución, planos acotados, alzados y documentación técnica"},"ikks-coruna":{"title":"A Coruña","summary":"Desarrollo técnico de rótulos luminosos y elementos expositivos para IKKS.","period":"2025 a actualidad","type":"Mobiliario y rotulación retail","role":"Planos técnicos y documentación para producción"},"baymo-goya":{"title":"Goya, Madrid","summary":"Desarrollo de un corner retail para Baymo en El Corte Inglés Goya.","period":"2025 a actualidad","type":"Retail de moda","role":"Desarrollo técnico y documentación de proyecto"},"baymo-sanchinarro":{"title":"Sanchinarro, Madrid","summary":"Desarrollo de un corner retail para Baymo en El Corte Inglés Sanchinarro.","period":"2025 a actualidad","type":"Retail de moda","role":"Desarrollo técnico y documentación de proyecto"},"stamuli-marbella":{"title":"Marbella","summary":"Desarrollo técnico de un corner retail de 30 m² para Stamuli.","period":"2025 a actualidad","type":"Retail de moda","role":"Información de levantamiento, planos técnicos y preparación de proyecto"},"ecoalf-coruna":{"title":"A Coruña","summary":"Desarrollo retail para Ecoalf en El Corte Inglés A Coruña.","period":"2025 a actualidad","type":"Retail de moda","role":"Desarrollo técnico, seguimiento de compras y preparación para producción"}}};
const projectData={"venezuela":{"coords":[10.4806,-66.9036],"stage":"foundations","number":"I","title":"Caracas, Venezuela","summary":"The beginning of my career, focused on architectural drafting, 3D modelling and visualisation for architecture and interior projects.","period":"2015 to 2017","type":"Architectural drafting","role":"Architectural drafting, 3D modelling and visualisation","company":"ARBIMCON","brand":"ARBIMCON","region":"venezuela"},"gijon-residential":{"coords":[43.5322,-5.6611],"stage":"residential","number":"II","title":"Gijón","summary":"Three private detached homes developed during my residential design stage.","period":"2017 to 2021","type":"Private residential","role":"Residential and interior design","company":"Innova y Mejora / Decisión Estratégica","brand":"Innova y Mejora / Decisión Estratégica","region":"peninsula"},"oviedo-residential":{"coords":[43.3614,-5.8494],"stage":"residential","number":"III","title":"Oviedo","summary":"Two private detached homes developed for clients in Asturias.","period":"2017 to 2021","type":"Private residential","role":"Residential and interior design","company":"Innova y Mejora / Decisión Estratégica","brand":"Innova y Mejora / Decisión Estratégica","region":"peninsula"},"langreo":{"coords":[43.3083,-5.6944],"stage":"residential","number":"IV","title":"Langreo","summary":"A private detached home developed as part of my residential design work in Asturias.","period":"2017 to 2021","type":"Private residential","role":"Residential design and technical drawing","company":"Innova y Mejora / Decisión Estratégica","brand":"Innova y Mejora / Decisión Estratégica","region":"peninsula"},"laviana":{"coords":[43.2456,-5.5627],"stage":"residential","number":"V","title":"Pola de Laviana","summary":"Design work for a private home. The construction phase was handled by the site team.","period":"2017 to 2021","type":"Private residential","role":"Design development","company":"Innova y Mejora / Decisión Estratégica","brand":"Innova y Mejora / Decisión Estratégica","region":"peninsula"},"regueras":{"coords":[43.4148,-5.9708],"stage":"residential","number":"VI","title":"Las Regueras, Tahoces","summary":"Private detached home developed in a rural context in Asturias.","period":"2017 to 2021","type":"Private residential","role":"Residential design and technical drawing","company":"Innova y Mejora / Decisión Estratégica","brand":"Innova y Mejora / Decisión Estratégica","region":"peninsula"},"coruna-commercial":{"coords":[43.3623,-8.4115],"stage":"residential","number":"VII","title":"A Coruña","summary":"Commercial refurbishment project developed during my time at Innova y Mejora.","period":"2017 to 2021","type":"Commercial refurbishment","role":"Interior and technical design","company":"Innova y Mejora / Decisión Estratégica","brand":"Innova y Mejora / Decisión Estratégica","region":"peninsula"},"japon-gijon":{"coords":[43.5322,-5.6611],"stage":"identity","number":"I","title":"Gijón","summary":"Store design and visual identity for Japon Market 24h.","period":"2022 to 2024","type":"Retail identity","role":"Interior, graphic and brand design","company":"Japon Market 24h","brand":"Japon Market 24h","region":"peninsula"},"japon-oviedo":{"coords":[43.3614,-5.8494],"stage":"identity","number":"II","title":"Oviedo","summary":"Store design and visual identity for Japon Market 24h.","period":"2022 to 2024","type":"Retail identity","role":"Interior, graphic and brand design","company":"Japon Market 24h","brand":"Japon Market 24h","region":"peninsula"},"japon-aviles":{"coords":[43.556,-5.9248],"stage":"identity","number":"III","title":"Avilés","summary":"Store design and visual identity for Japon Market 24h.","period":"2022 to 2024","type":"Retail identity","role":"Interior, graphic and brand design","company":"Japon Market 24h","brand":"Japon Market 24h","region":"peninsula"},"japon-lugo":{"coords":[43.0121,-7.5559],"stage":"identity","number":"IV","title":"Lugo","summary":"Store design and visual identity for Japon Market 24h.","period":"2022 to 2024","type":"Retail identity","role":"Interior, graphic and brand design","company":"Japon Market 24h","brand":"Japon Market 24h","region":"peninsula"},"japon-madrid":{"coords":[40.3223,-3.865],"stage":"identity","number":"V","title":"Móstoles, Madrid","summary":"Store design and visual identity for Japon Market 24h.","period":"2022 to 2024","type":"Retail identity","role":"Interior, graphic and brand design","company":"Japon Market 24h","brand":"Japon Market 24h","region":"peninsula"},"japon-las-palmas":{"coords":[28.1235,-15.4363],"stage":"identity","number":"VI","title":"Las Palmas de Gran Canaria","summary":"Store design and visual identity for Japon Market 24h.","period":"2022 to 2024","type":"Retail identity","role":"Interior, graphic and brand design","company":"Japon Market 24h","brand":"Japon Market 24h","region":"canary"},"japon-tenerife":{"coords":[28.4636,-16.2518],"stage":"identity","number":"VII","title":"Tenerife","summary":"Store design and visual identity for Japon Market 24h.","period":"2022 to 2024","type":"Retail identity","role":"Interior, graphic and brand design","company":"Japon Market 24h","brand":"Japon Market 24h","region":"canary"},"japon-leon":{"coords":[42.5987,-5.5671],"stage":"identity","number":"VIII","title":"León","summary":"Store design and visual identity for Japon Market 24h.","period":"2022 to 2024","type":"Retail identity","role":"Interior, graphic and brand design","company":"Japon Market 24h","brand":"Japon Market 24h","region":"peninsula"},"automatic-stores":{"coords":[40.15,-3.7],"stage":"identity","number":"IX","title":"throughout Spain network","summary":"Visual systems, packaging and communication applied across more than 70 automated retail locations in Spain.","period":"2022 to 2024","type":"Automated retail network","role":"Branding, packaging and visual systems","map":false,"company":"Japon Market 24h","brand":"Japon Market 24h","region":"nationwide"},"ecoalf-vigo":{"coords":[42.2406,-8.7207],"stage":"production","number":"I","title":"Vigo","summary":"Ecoalf Man and Woman retail projects inside El Corte Inglés.","period":"2025 to present","type":"Fashion retail","role":"Technical development, procurement tracking and production preparation","company":"Montajes e Instalaciones Castiello","brand":"ECOALF","region":"peninsula"},"ecoalf-alicante":{"coords":[38.3452,-0.481],"stage":"production","number":"II","title":"Alicante","summary":"Ecoalf Woman temporary space inside El Corte Inglés Alicante.","period":"2025 to present","type":"Temporary fashion retail space","role":"Technical development, procurement tracking and production preparation","company":"Montajes e Instalaciones Castiello","brand":"ECOALF","region":"peninsula"},"ecoalf-zaragoza":{"coords":[41.6488,-0.8891],"stage":"production","number":"III","title":"Zaragoza","summary":"Ecoalf Man and Woman retail projects inside El Corte Inglés.","period":"2025 to present","type":"Fashion retail","role":"Technical development, procurement tracking and production preparation","company":"Montajes e Instalaciones Castiello","brand":"ECOALF","region":"peninsula"},"ecoalf-murcia":{"coords":[37.9922,-1.1307],"stage":"production","number":"IV","title":"Murcia","summary":"Ecoalf Woman retail project inside El Corte Inglés Murcia.","period":"2025 to present","type":"Fashion retail","role":"Technical development, procurement tracking and production preparation","company":"Montajes e Instalaciones Castiello","brand":"ECOALF","region":"peninsula"},"ecoalf-pozuelo":{"coords":[40.4359,-3.8134],"stage":"production","number":"V","title":"Pozuelo, Madrid","summary":"Ecoalf Man retail project inside El Corte Inglés Pozuelo.","period":"2025 to present","type":"Fashion retail","role":"Technical development, procurement tracking and production preparation","company":"Montajes e Instalaciones Castiello","brand":"ECOALF","region":"peninsula"},"ecoalf-salamanca":{"coords":[40.9701,-5.6635],"stage":"production","number":"VI","title":"Salamanca","summary":"Ecoalf Woman retail project inside El Corte Inglés Salamanca.","period":"2025 to present","type":"Fashion retail","role":"Technical development, procurement tracking and production preparation","company":"Montajes e Instalaciones Castiello","brand":"ECOALF","region":"peninsula"},"ecoalf-burgos":{"coords":[42.3439,-3.6969],"stage":"production","number":"VII","title":"Burgos","summary":"Ecoalf Man and Woman retail projects inside El Corte Inglés Burgos.","period":"2025 to present","type":"Fashion retail","role":"Technical development, procurement tracking and production preparation","company":"Montajes e Instalaciones Castiello","brand":"ECOALF","region":"peninsula"},"ecoalf-lisbon":{"coords":[38.7223,-9.1393],"stage":"production","number":"VIII","title":"Lisbon","summary":"Ecoalf Man and Woman projects inside El Corte Inglés Lisbon.","period":"2025 to present","type":"Fashion retail","role":"Technical development, procurement tracking and production preparation","company":"Montajes e Instalaciones Castiello","brand":"ECOALF","region":"peninsula"},"ecoalf-gaia":{"coords":[41.1336,-8.6174],"stage":"production","number":"IX","title":"Vila Nova de Gaia","summary":"Ecoalf Man and Woman projects inside El Corte Inglés Gaia.","period":"2025 to present","type":"Fashion retail","role":"Technical development, procurement tracking and production preparation","company":"Montajes e Instalaciones Castiello","brand":"ECOALF","region":"peninsula"},"ecoalf-valderas":{"coords":[40.3495,-3.8312],"stage":"production","number":"X","title":"San José de Valderas, Madrid","summary":"Ecoalf Man retail project inside El Corte Inglés San José de Valderas.","period":"2025 to present","type":"Fashion retail","role":"Technical development, procurement tracking and production preparation","company":"Montajes e Instalaciones Castiello","brand":"ECOALF","region":"peninsula"},"ecoalf-barcelona":{"coords":[41.3888,2.113],"stage":"production","number":"XI","title":"Barcelona","summary":"Ecoalf Man project inside El Corte Inglés Diagonal.","period":"2025 to present","type":"Fashion retail","role":"Technical development, procurement tracking and production preparation","company":"Montajes e Instalaciones Castiello","brand":"ECOALF","region":"peninsula"},"ecoalf-tarragona":{"coords":[41.1189,1.2445],"stage":"production","number":"XII","title":"Tarragona","summary":"Ecoalf Man retail project inside El Corte Inglés Tarragona.","period":"2025 to present","type":"Fashion retail","role":"Technical development, procurement tracking and production preparation","company":"Montajes e Instalaciones Castiello","brand":"ECOALF","region":"peninsula"},"ecoalf-sanchinarro":{"coords":[40.4928,-3.6558],"stage":"production","number":"XIII","title":"Sanchinarro, Madrid","summary":"Ecoalf Man retail project inside El Corte Inglés Sanchinarro.","period":"2025 to present","type":"Fashion retail","role":"Technical development, procurement tracking and production preparation","company":"Montajes e Instalaciones Castiello","brand":"ECOALF","region":"peninsula"},"ecoalf-marbella":{"coords":[36.5101,-4.8825],"stage":"production","number":"XIV","title":"Marbella","summary":"Ecoalf Woman retail project inside El Corte Inglés Marbella.","period":"2025 to present","type":"Fashion retail","role":"Technical development, procurement tracking and production preparation","company":"Montajes e Instalaciones Castiello","brand":"ECOALF","region":"peninsula"},"save-the-duck-santander":{"coords":[43.4623,-3.8099],"stage":"production","number":"XV","title":"Santander","summary":"Save The Duck temporary retail project inside El Corte Inglés Santander.","period":"2025 to present","type":"Temporary fashion retail space","role":"Technical drawings, material tracking and project preparation","company":"Montajes e Instalaciones Castiello","brand":"Save The Duck","region":"peninsula"},"ikks-san-sebastian-reyes":{"coords":[40.5475,-3.6269],"stage":"production","number":"XVI","title":"San Sebastián de los Reyes, Madrid","summary":"IKKS temporary space prepared for a short installation window inside an operating shopping centre.","period":"2025 to present","type":"Temporary fashion retail space","role":"Layout, dimensioned drawings, elevations and technical documentation","company":"Montajes e Instalaciones Castiello","brand":"IKKS","region":"peninsula"},"ikks-coruna":{"coords":[43.3623,-8.4115],"stage":"production","number":"XVII","title":"A Coruña","summary":"Technical development for illuminated signage and display elements for IKKS.","period":"2025 to present","type":"Retail fixtures and signage","role":"Technical drawings and production documentation","company":"Montajes e Instalaciones Castiello","brand":"IKKS","region":"peninsula"},"baymo-goya":{"coords":[40.424,-3.676],"stage":"production","number":"XVIII","title":"Goya, Madrid","summary":"Retail corner development for Baymo inside El Corte Inglés Goya.","period":"2025 to present","type":"Fashion retail","role":"Technical development and project documentation","company":"Montajes e Instalaciones Castiello","brand":"Baymo","region":"peninsula"},"baymo-sanchinarro":{"coords":[40.4928,-3.6558],"stage":"production","number":"XIX","title":"Sanchinarro, Madrid","summary":"Retail corner development for Baymo inside El Corte Inglés Sanchinarro.","period":"2025 to present","type":"Fashion retail","role":"Technical development and project documentation","company":"Montajes e Instalaciones Castiello","brand":"Baymo","region":"peninsula"},"stamuli-marbella":{"coords":[36.5101,-4.8825],"stage":"production","number":"XX","title":"Marbella","summary":"Technical project development for a 30 m² retail corner for Stamuli.","period":"2025 to present","type":"Fashion retail","role":"Survey information, technical drawings and project preparation","company":"Montajes e Instalaciones Castiello","brand":"Stamuli","region":"peninsula"},"ecoalf-coruna":{"coords":[43.3685,-8.401],"stage":"production","number":"XXI","title":"A Coruña","summary":"Ecoalf retail development inside El Corte Inglés A Coruña.","period":"2025 to present","type":"Fashion retail","role":"Technical development, procurement tracking and production preparation","company":"Montajes e Instalaciones Castiello","brand":"ECOALF","region":"peninsula"}};
const atlasElement=document.getElementById('project-map');
if(atlasElement){
  const regions={
    peninsula:{bounds:{west:-10.4085312225,east:4.5,south:34.6863636364,north:44.8},image:'images/map-peninsula-v9.png',labelKey:'regionPeninsula',altKey:'mapAltPeninsula'},
    canary:{bounds:{west:-18.5,east:-11.2176781003,south:27,north:32.8659090909},image:'images/map-canary-v9.png',labelKey:'regionCanary',altKey:'mapAltCanary'},
    venezuela:{bounds:{west:-73.8,east:-59.2,south:0,north:13.5},image:'images/map-venezuela-v8.png',labelKey:'regionVenezuela',altKey:'mapAltVenezuela'}
  };
  const stageKeys={foundations:'stageFoundations',residential:'stageResidential',identity:'stageIdentity',production:'stageProduction'};
  const projectImages={"ecoalf-lisbon":["images/ecoalf/lisboa-man/interior-render-01.webp","images/ecoalf/lisboa-woman/interior-render-01.webp","images/ecoalf/lisboa-man/interior-render-03.webp","images/ecoalf/lisboa-woman/site-photo-01.webp"],"ecoalf-marbella":["images/ecoalf/marbella/interior-render-02.webp","images/ecoalf/marbella/interior-render-05.webp"],"ecoalf-vigo":["images/ecoalf/vigo-man/ecoalf-man-vigo-built-exterior-cover.webp","images/ecoalf/vigo-man/ecoalf-man-vigo-built-interior-01.webp","images/ecoalf/vigo-man/ecoalf-man-vigo-built-interior-02.webp","images/ecoalf/vigo-man/ecoalf-man-vigo-built-interior-03.webp","images/ecoalf/vigo-man/ecoalf-man-vigo-built-interior-04.webp","images/ecoalf/vigo-man/ecoalf-man-vigo-built-interior-05.webp","images/ecoalf/vigo-man/ecoalf-man-vigo-built-interior-06.webp","images/ecoalf/vigo-man/ecoalf-man-vigo-built-interior-07.webp","images/ecoalf/vigo-woman/ecoalf-woman-vigo-built-corner-01.webp","images/ecoalf/vigo-woman/ecoalf-woman-vigo-built-corner-02.webp","images/ecoalf/vigo-man/ecoalf-man-vigo-corner-before.webp","images/ecoalf/vigo-man/interior-render-04.webp","images/ecoalf/vigo-man/interior-render-11.webp","images/ecoalf/vigo-woman/floor-plan-01.webp","images/ecoalf/vigo-man/detail-render-02.webp"],"ecoalf-coruna":["images/ecoalf/vigo-man/detail-render-01.webp"],"ikks-san-sebastian-reyes":["images/ikks/detailed-render-01.webp","images/ikks/detailed-render-05.webp","images/ikks/schematic-render-01.webp"],"ikks-coruna":["images/ikks/elevation-plan.webp"],"japon-aviles":["images/japon-market/aviles/arch-corridor-distant-view.jpg","images/japon-market/aviles/vending-machines-entrance.jpg","images/japon-market/aviles/street-entrance-daytime.jpg"],"japon-madrid":["images/japon-market/madrid-mostoles/street-storefront-queue.jpg","images/japon-market/madrid-mostoles/ramen-counter-mural.jpg","images/japon-market/madrid-mostoles/interior-figures-shelving.jpg"],"japon-lugo":["images/japon-market/lugo/interior-neon-sign.webp","images/japon-market/lugo/facade-japan-skyline.jpg","images/japon-market/lugo/entrance-kimono-model.jpg"],"japon-las-palmas":["images/japon-market/las-palmas/storefront-opening-balloons.jpg","images/japon-market/las-palmas/interior-mascot-mural.jpg","images/japon-market/las-palmas/branded-delivery-van.jpg"],"japon-tenerife":["images/japon-market/tenerife/grand-opening-storefront.webp","images/japon-market/tenerife/grand-opening-storefront-02.webp"],"japon-leon":["images/japon-market/leon/mall-walkway-signage.jpg","images/japon-market/leon/mall-lounge-mural.jpg","images/japon-market/leon/ramen-ad-portrait.jpg"],"ecoalf-alicante":["images/ecoalf/alicante-woman-popup/ecoalf-woman-popup-alicante-retail-render-01.webp","images/ecoalf/alicante-woman-popup/ecoalf-woman-popup-alicante-retail-render-02.webp"],"ecoalf-zaragoza":["images/ecoalf/zaragoza-man/ecoalf-man-zaragoza-retail-render-01.webp","images/ecoalf/zaragoza-man/ecoalf-man-zaragoza-retail-render-02.webp","images/ecoalf/zaragoza-woman/ecoalf-woman-zaragoza-retail-render-01.webp","images/ecoalf/zaragoza-woman/ecoalf-woman-zaragoza-retail-render-02.webp"],"ecoalf-murcia":["images/ecoalf/murcia-woman/ecoalf-woman-murcia-retail-render-01.webp","images/ecoalf/murcia-woman/ecoalf-woman-murcia-retail-render-02.webp","images/ecoalf/murcia-woman/ecoalf-woman-murcia-retail-render-03.webp","images/ecoalf/murcia-woman/ecoalf-woman-murcia-retail-render-04.webp","images/ecoalf/murcia-woman/ecoalf-woman-murcia-furniture-installation-01.webp","images/ecoalf/murcia-woman/ecoalf-woman-murcia-furniture-installation-02.webp"],"ecoalf-pozuelo":["images/ecoalf/pozuelo-man/ecoalf-man-pozuelo-madrid-built-corner-01.webp","images/ecoalf/pozuelo-man/ecoalf-man-pozuelo-madrid-built-corner-02.webp","images/ecoalf/pozuelo-man/ecoalf-man-pozuelo-madrid-retail-render-01.webp","images/ecoalf/pozuelo-man/ecoalf-man-pozuelo-madrid-retail-render-02.webp","images/ecoalf/pozuelo-man/ecoalf-man-pozuelo-madrid-retail-render-03.webp","images/ecoalf/pozuelo-man/ecoalf-man-pozuelo-madrid-retail-render-04.webp"],"ecoalf-salamanca":["images/ecoalf/salamanca-woman/ecoalf-woman-salamanca-retail-render-01.webp","images/ecoalf/salamanca-woman/ecoalf-woman-salamanca-retail-render-02.webp","images/ecoalf/salamanca-woman/ecoalf-woman-salamanca-retail-render-03.webp"],"ecoalf-burgos":["images/ecoalf/burgos-man/ecoalf-man-burgos-retail-render-01.webp","images/ecoalf/burgos-man/ecoalf-man-burgos-retail-render-02.webp","images/ecoalf/burgos-man/ecoalf-man-burgos-retail-render-03.webp","images/ecoalf/burgos-woman/ecoalf-woman-burgos-retail-render-01.webp","images/ecoalf/burgos-woman/ecoalf-woman-burgos-retail-render-02.webp","images/ecoalf/burgos-woman/ecoalf-woman-burgos-retail-render-03.webp"],"ecoalf-tarragona":["images/ecoalf/tarragona-man/ecoalf-man-tarragona-retail-render-01.webp","images/ecoalf/tarragona-man/ecoalf-man-tarragona-retail-render-02.webp","images/ecoalf/tarragona-man/ecoalf-man-tarragona-retail-render-03.webp"],"ecoalf-sanchinarro":["images/ecoalf/sanchinarro-man/ecoalf-man-sanchinarro-retail-render-01.webp","images/ecoalf/sanchinarro-man/ecoalf-man-sanchinarro-retail-render-02.webp","images/ecoalf/sanchinarro-man/ecoalf-man-sanchinarro-retail-render-03.webp","images/ecoalf/sanchinarro-man/ecoalf-man-sanchinarro-retail-render-04.webp","images/ecoalf/sanchinarro-man/ecoalf-man-sanchinarro-retail-render-05.webp"]};
  const projectLinks={"ecoalf-lisbon":"projects/ecoalf.html","ecoalf-marbella":"projects/ecoalf.html","ecoalf-vigo":"projects/ecoalf.html","ecoalf-coruna":"projects/ecoalf.html","ikks-san-sebastian-reyes":"projects/ikks.html","japon-aviles":"projects/japon-market.html#aviles","japon-madrid":"projects/japon-market.html#madrid-mostoles","japon-lugo":"projects/japon-market.html#lugo","japon-las-palmas":"projects/japon-market.html#las-palmas","japon-tenerife":"projects/japon-market.html#tenerife","japon-leon":"projects/japon-market.html#leon","japon-gijon":"projects/japon-market.html","japon-oviedo":"projects/japon-market.html","automatic-stores":"projects/japon-market.html"};
  const normalize=value=>(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
  const getProject=key=>{const base=projectData[key];return currentLanguage==='es'&&localizedProjectData.es[key]?{...base,...localizedProjectData.es[key]}:base};
  const projectRegion=project=>project.region||(project.map===false?'nationwide':project.coords[1]<-25?'venezuela':project.coords[0]<33?'canary':'peninsula');
  const projectSearchText=(key,project)=>{const item=getProject(key);return normalize([item.title,item.summary,item.type,item.role,item.period,project.company,project.brand,translations[currentLanguage]?.[stageKeys[project.stage]]].join(' '))};

  let activeStage='all';
  let activeQuery='';
  let activeRegion='peninsula';
  let activeProjectKey=null;
  let activeLocationId=null;
  let lastDrawerTrigger=null;
  let renderFrame=0;

  const atlasLayout=atlasElement.closest('.built-work-layout');
  const expandButton=document.getElementById('atlas-expand');
  const mapImage=document.getElementById('atlas-map-image');
  const markerLayer=document.getElementById('atlas-markers');
  const regionLabel=document.getElementById('atlas-region-label');
  const mapStatus=document.getElementById('atlas-map-status');
  const mapEmpty=document.getElementById('atlas-map-empty');
  const mapEmptyText=mapEmpty?.querySelector('p');
  const zoomReadout=document.getElementById('atlas-zoom-readout');
  const drawer=document.querySelector('.project-drawer');
  const drawerTitle=drawer?.querySelector('.drawer-title');
  const drawerNumber=drawer?.querySelector('.drawer-number');
  const drawerStage=drawer?.querySelector('.drawer-stage');
  const drawerSummary=drawer?.querySelector('.drawer-summary');
  const drawerPeriod=drawer?.querySelector('.drawer-period');
  const drawerType=drawer?.querySelector('.drawer-type');
  const drawerRole=drawer?.querySelector('.drawer-role');
  const drawerGallery=drawer?.querySelector('.drawer-gallery');
  const drawerChoices=drawer?.querySelector('.drawer-project-choices');
  const drawerMeta=drawer?.querySelector('.drawer-meta');
  const drawerLink=drawer?.querySelector('.drawer-link');
  const drawerClose=drawer?.querySelector('.drawer-close');
  const search=document.getElementById('atlas-search');
  const clearSearch=document.querySelector('.atlas-search-clear');
  const resetFilters=document.getElementById('atlas-reset');
  const activeSummary=document.getElementById('atlas-active-summary');
  const resultNumber=document.getElementById('atlas-result-number');
  const emptyState=document.getElementById('atlas-empty-state');
  const directorySummary=document.getElementById('drawer-directory-summary');
  const drawerMobileToggle=document.querySelector('.drawer-mobile-toggle'),drawerMobileCount=document.querySelector('.drawer-mobile-count');
  const indexContainers={peninsula:document.getElementById('drawer-list-peninsula'),canary:document.getElementById('drawer-list-canary'),venezuela:document.getElementById('drawer-list-venezuela'),nationwide:document.getElementById('drawer-list-nationwide')};

  const mobileAtlasQuery=window.matchMedia('(max-width:760px)');
  const isMobileAtlas=()=>mobileAtlasQuery.matches;
  let atlasScrollY=0;
  function updateExpandControl(expanded=false){
    if(!expandButton)return;
    const mobile=isMobileAtlas();
    const key=mobile?'resetZoom':(expanded?'collapseAtlas':'expandAtlas');
    expandButton.classList.toggle('is-mobile-reset',mobile);
    expandButton.dataset.i18nAria=key;
    expandButton.setAttribute('aria-label',translations[currentLanguage]?.[key]||'');
    expandButton.title=translations[currentLanguage]?.[key]||'';
    expandButton.setAttribute('aria-expanded',String(!mobile&&expanded));
    if(mobile)expandButton.disabled=viewState?.[activeRegion]?.scale<=1.001;
    else expandButton.disabled=false;
  }
  function setAtlasExpanded(expanded,announce=true){
    if(!atlasLayout||!expandButton)return;
    if(isMobileAtlas()&&expanded){
      resetView(true);
      updateExpandControl(false);
      if(announce&&mapStatus)mapStatus.textContent=translations[currentLanguage]?.resetZoom||'';
      return;
    }
    if(expanded)atlasScrollY=window.scrollY;
    atlasLayout.classList.toggle('atlas-expanded',expanded);
    body.classList.toggle('atlas-expanded',expanded);
    document.documentElement.classList.toggle('atlas-expanded',expanded);
    window.syncPortfolioViewport?.();
    updateExpandControl(expanded);
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      clampState(activeRegion);
      updateMapTransform(false);
      if(expanded)atlasElement.focus({preventScroll:true});
      if(!expanded)window.scrollTo({top:atlasScrollY,left:0,behavior:'auto'});
    }));
    if(!expanded)setTimeout(()=>expandButton.focus({preventScroll:true}),80);
    if(announce&&mapStatus)mapStatus.textContent=translations[currentLanguage]?.[expanded?'atlasExpandedStatus':'atlasCollapsedStatus']||'';
  }

  const viewState={
    peninsula:{scale:1,tx:0,ty:0},
    canary:{scale:1,tx:0,ty:0},
    venezuela:{scale:1,tx:0,ty:0}
  };
  const maxScale=()=>isMobileAtlas()?3.2:7;

  function matches(key,project){
    if(activeStage!=='all'&&project.stage!==activeStage)return false;
    return !activeQuery||projectSearchText(key,project).includes(normalize(activeQuery));
  }
  const filteredEntries=()=>Object.entries(projectData).filter(([key,project])=>matches(key,project));
  const mapEntries=region=>filteredEntries().filter(([,project])=>project.map!==false&&projectRegion(project)===region);
  const locationId=project=>project.locationKey||`${projectRegion(project)}:${normalize(project.title)}`;

  function groupLocations(entries){
    const groups=new Map();
    entries.forEach(([key,project])=>{
      const id=locationId(project);
      if(!groups.has(id))groups.set(id,{id,region:projectRegion(project),coords:[0,0],keys:[]});
      const group=groups.get(id);group.keys.push(key);group.coords[0]+=project.coords[0];group.coords[1]+=project.coords[1];
    });
    return [...groups.values()].map(group=>({...group,coords:[group.coords[0]/group.keys.length,group.coords[1]/group.keys.length]}));
  }

  function plural(count,singularKey,pluralKey){return translations[currentLanguage]?.[count===1?singularKey:pluralKey]||''}
  function labelForLocation(group){
    const first=getProject(group.keys[0]);
    return group.keys.length===1?first.title:`${first.title} · ${group.keys.length} ${plural(group.keys.length,'atlasProject','atlasProjects')}`;
  }

  function setDrawerDetailVisible(visible){
    drawer?.classList.toggle('active',visible);
    if(!visible){activeProjectKey=null;activeLocationId=null;document.querySelectorAll('.drawer-location-row,.atlas-marker').forEach(el=>el.classList.remove('active'))}
  }
  function resetDrawerSections(){
    if(drawerChoices)drawerChoices.innerHTML='';
    drawerChoices?.classList.remove('visible');
    drawerGallery?.classList.remove('hidden');
    drawerMeta?.classList.remove('hidden');
  }
  function showDrawer(trigger){
    lastDrawerTrigger=trigger||document.activeElement;
    setDrawerDetailVisible(true);
    drawerTitle?.focus({preventScroll:true});
  }
  function highlightLocation(id,key=null){
    activeLocationId=id;
    document.querySelectorAll('.drawer-location-row').forEach(row=>row.classList.toggle('active',row.dataset.location===id));
    document.querySelectorAll('.atlas-marker').forEach(marker=>marker.classList.toggle('active',marker.dataset.locations?.split('|').includes(id)));
    if(key)document.querySelectorAll('[data-project]').forEach(row=>row.classList.toggle('active',row.dataset.project===key));
  }
  function openProject(key,trigger=null,scroll=false){
    const item=getProject(key),base=projectData[key];
    if(!item||!drawer)return;
    activeProjectKey=key;
    resetDrawerSections();
    drawerNumber.textContent=item.number;
    drawerStage.textContent=translations[currentLanguage]?.[stageKeys[base.stage]]||base.stage;
    drawerTitle.textContent=item.title;
    drawerSummary.textContent=item.summary;
    drawerPeriod.textContent=item.period;
    drawerType.textContent=item.type;
    drawerRole.textContent=item.role;
    const images=projectImages[key]||[];
    drawerGallery.innerHTML=images.map((src,index)=>`<button type="button" class="drawer-image protected-media" data-lightbox-src="${escapeHtml(src)}"><img src="${escapeHtml(src)}" alt="${escapeHtml(item.title)} · ${index+1}" loading="lazy" decoding="async" draggable="false"></button>`).join('');
    drawerGallery.classList.toggle('hidden',images.length===0);
    const href=projectLinks[key];
    if(href){drawerLink.href=href;drawerLink.classList.add('visible')}else{drawerLink.classList.remove('visible');drawerLink.removeAttribute('href')}
    showDrawer(trigger);
    highlightLocation(locationId(base),key);
    if(scroll)document.querySelector('.built-work-layout')?.scrollIntoView({behavior:reducedMotion?'auto':'smooth',block:'start'});
  }
  function openChoiceList(keys,title,summary,trigger=null,location=null){
    if(!keys.length||!drawer)return;
    if(keys.length===1)return openProject(keys[0],trigger,false);
    activeProjectKey=null;
    resetDrawerSections();
    drawerNumber.textContent=String(keys.length);
    drawerStage.textContent=translations[currentLanguage]?.sharedLocationTitle||'';
    drawerTitle.textContent=title;
    drawerSummary.textContent=summary;
    drawerGallery.classList.add('hidden');
    drawerMeta.classList.add('hidden');
    drawerLink.classList.remove('visible');
    drawerChoices.classList.add('visible');
    drawerChoices.innerHTML=keys.map(key=>{const item=getProject(key),base=projectData[key];return`<button type="button" data-project="${escapeHtml(key)}"><small>${escapeHtml(base.brand||base.company||'')}</small><strong>${escapeHtml(item.title)} · ${escapeHtml(item.type)}</strong><span>${escapeHtml(item.summary)}</span></button>`}).join('');
    showDrawer(trigger);
    if(location)highlightLocation(location);
  }
  function openLocation(group,trigger=null,scroll=false){
    const first=getProject(group.keys[0]);
    openChoiceList(group.keys,first.title,translations[currentLanguage]?.sharedLocationText||'',trigger,group.id);
    if(scroll)document.querySelector('.built-work-layout')?.scrollIntoView({behavior:reducedMotion?'auto':'smooth',block:'start'});
  }
  function openArea(keys,trigger=null){
    openChoiceList(keys,translations[currentLanguage]?.atlasProjectsInArea||'',translations[currentLanguage]?.atlasAreaText||'',trigger,null);
  }
  drawerChoices?.addEventListener('click',event=>{const button=event.target.closest('button[data-project]');if(button)openProject(button.dataset.project,button,false)});
  drawerClose?.addEventListener('click',()=>{setDrawerDetailVisible(false);lastDrawerTrigger?.focus?.({preventScroll:true})});

  function projectPoint(source,region,width,height){
    const coords=Array.isArray(source)?source:source.coords;
    const bounds=regions[region].bounds;
    return{x:(coords[1]-bounds.west)/(bounds.east-bounds.west)*width,y:(bounds.north-coords[0])/(bounds.north-bounds.south)*height};
  }
  function clampState(region){
    const state=viewState[region],rect=atlasElement.getBoundingClientRect();
    if(state.scale<=1){state.scale=1;state.tx=0;state.ty=0;return}
    state.tx=Math.min(0,Math.max(rect.width*(1-state.scale),state.tx));
    state.ty=Math.min(0,Math.max(rect.height*(1-state.scale),state.ty));
  }
  function updateMapTransform(animate=false){
    const state=viewState[activeRegion];
    clampState(activeRegion);
    if(mapImage){mapImage.style.transition=animate?'transform .24s cubic-bezier(.2,.8,.2,1)':'none';mapImage.style.transform=`translate3d(${state.tx}px,${state.ty}px,0) scale(${state.scale})`}
    atlasElement.classList.toggle('is-zoomed',state.scale>1.001);
    atlasElement.classList.toggle('show-labels',state.scale>=1.85);
    if(zoomReadout)zoomReadout.textContent=`${Math.round(state.scale*100)}%`;
    if(isMobileAtlas())updateExpandControl(false);
    scheduleMarkerRender();
  }
  function zoomAt(factor,clientX=null,clientY=null,animate=true){
    const state=viewState[activeRegion],rect=atlasElement.getBoundingClientRect();
    const px=clientX==null?rect.width/2:clientX-rect.left,py=clientY==null?rect.height/2:clientY-rect.top;
    const previous=state.scale;
    state.scale=Math.min(maxScale(),Math.max(1,state.scale*factor));
    const ratio=state.scale/previous;
    state.tx=px-(px-state.tx)*ratio;
    state.ty=py-(py-state.ty)*ratio;
    updateMapTransform(animate);
  }
  function panBy(dx,dy){const state=viewState[activeRegion];if(state.scale<=1)return;state.tx+=dx;state.ty+=dy;updateMapTransform(false)}
  function resetView(animate=true){viewState[activeRegion]={scale:1,tx:0,ty:0};updateMapTransform(animate)}
  function fitVisibleLocations(){
    const groups=groupLocations(mapEntries(activeRegion));
    if(!groups.length)return;
    focusGroups(groups,'fit');
    if(mapStatus)mapStatus.textContent=translations[currentLanguage]?.atlasFitStatus||'';
    setTimeout(()=>atlasElement.focus({preventScroll:true}),260);
  }
  function updateDirectoryVisibility(){
    document.querySelectorAll('[data-index-region]').forEach(section=>{
      const region=section.dataset.indexRegion;
      const hasEntries=section.dataset.hasEntries==='true';
      section.hidden=!hasEntries||(region!=='nationwide'&&region!==activeRegion);
    });
  }
  function focusGroups(groups,mode='focus'){
    const rect=atlasElement.getBoundingClientRect();if(!rect.width||!groups.length)return;
    const points=groups.map(group=>projectPoint(group.coords,activeRegion,rect.width,rect.height));
    const minX=Math.min(...points.map(p=>p.x)),maxX=Math.max(...points.map(p=>p.x));
    const minY=Math.min(...points.map(p=>p.y)),maxY=Math.max(...points.map(p=>p.y));
    const padding=120;
    const calculated=Math.min(rect.width/Math.max(80,maxX-minX+padding),rect.height/Math.max(80,maxY-minY+padding));
    const target=Math.min(maxScale(),mode==='fit'?Math.max(1,calculated):Math.max(viewState[activeRegion].scale*1.65,calculated));
    const cx=(minX+maxX)/2,cy=(minY+maxY)/2;
    viewState[activeRegion].scale=target;
    viewState[activeRegion].tx=rect.width/2-cx*target;
    viewState[activeRegion].ty=rect.height/2-cy*target;
    updateMapTransform(true);
  }

  function clusterGroups(groups){
    const rect=atlasElement.getBoundingClientRect(),state=viewState[activeRegion];
    if(!rect.width||!rect.height)return[];
    const points=groups.map(group=>{const base=projectPoint(group.coords,activeRegion,rect.width,rect.height);return{group,x:base.x*state.scale+state.tx,y:base.y*state.scale+state.ty}});
    const threshold=window.innerWidth<=760?54:46;
    const parent=points.map((_,index)=>index);
    const find=index=>parent[index]===index?index:(parent[index]=find(parent[index]));
    const unite=(a,b)=>{a=find(a);b=find(b);if(a!==b)parent[b]=a};
    for(let i=0;i<points.length;i++)for(let j=i+1;j<points.length;j++)if(Math.hypot(points[i].x-points[j].x,points[i].y-points[j].y)<threshold)unite(i,j);
    const buckets=new Map();
    points.forEach((point,index)=>{const root=find(index);if(!buckets.has(root))buckets.set(root,[]);buckets.get(root).push(point)});
    return[...buckets.values()].map(bucket=>({points:bucket,x:bucket.reduce((sum,p)=>sum+p.x,0)/bucket.length,y:bucket.reduce((sum,p)=>sum+p.y,0)/bucket.length,keys:bucket.flatMap(p=>p.group.keys),groups:bucket.map(p=>p.group)}));
  }
  function scheduleMarkerRender(){cancelAnimationFrame(renderFrame);renderFrame=requestAnimationFrame(renderMarkers)}
  function renderMarkers(){
    if(!markerLayer)return;
    markerLayer.innerHTML='';
    const groups=groupLocations(mapEntries(activeRegion));
    const clusters=clusterGroups(groups);
    clusters.forEach(cluster=>{
      const marker=document.createElement('button');
      marker.type='button';
      marker.className='atlas-marker';
      const exactLocation=cluster.groups.length===1;
      if(!exactLocation)marker.classList.add('is-cluster');
      else if(cluster.keys.length>1)marker.classList.add('is-shared');
      marker.style.left=`${cluster.x}px`;marker.style.top=`${cluster.y}px`;
      marker.dataset.locations=cluster.groups.map(group=>group.id).join('|');
      const first=getProject(cluster.keys[0]);
      const label=!exactLocation?`${cluster.keys.length} ${plural(cluster.keys.length,'atlasProject','atlasProjects')} · ${cluster.groups.length} ${plural(cluster.groups.length,'atlasLocation','atlasLocations')}`:labelForLocation(cluster.groups[0]);
      marker.dataset.label=label;
      marker.setAttribute('aria-label',label);
      marker.title=label;
      const markerName=exactLocation?first.title:label;
      marker.innerHTML=`<span aria-hidden="true" class="atlas-marker-core"></span>${cluster.keys.length>1?`<span aria-hidden="true" class="atlas-marker-count">${cluster.keys.length}</span>`:''}<span aria-hidden="true" class="atlas-marker-name">${escapeHtml(markerName)}</span>`;
      if(activeLocationId&&cluster.groups.some(group=>group.id===activeLocationId))marker.classList.add('active');
      marker.addEventListener('click',event=>{
        if(!exactLocation&&viewState[activeRegion].scale<maxScale()*.82){focusGroups(cluster.groups);if(mapStatus)mapStatus.textContent=translations[currentLanguage]?.atlasClusterStatus||'';setTimeout(()=>atlasElement.focus({preventScroll:true}),260)}
        else if(!exactLocation)openArea(cluster.keys,marker);
        else openLocation(cluster.groups[0],marker,true);
      });
      markerLayer.appendChild(marker);
    });
    const mapped=groups.length;
    document.querySelectorAll('[data-zoom-action="fit"]').forEach(button=>{button.disabled=mapped===0;button.setAttribute('aria-disabled',String(mapped===0))});
    const total=filteredEntries().length;
    const nationwide=filteredEntries().filter(([,project])=>project.map===false).length;
    if(mapEmpty){
      const show=mapped===0;
      mapEmpty.hidden=!show;
      if(show&&mapEmptyText)mapEmptyText.textContent=nationwide===total&&total>0?(translations[currentLanguage]?.atlasNationwideOnly||''):(translations[currentLanguage]?.atlasMapNoLocations||'');
    }
  }

  function setRegion(region,focus=false){
    if(!regions[region])return;
    activeRegion=region;
    const config=regions[region];
    mapImage.src=config.image;
    mapImage.alt=translations[currentLanguage]?.[config.altKey]||'';
    regionLabel.textContent=translations[currentLanguage]?.[config.labelKey]||region;
    document.querySelectorAll('[data-atlas-region]').forEach(button=>{const selected=button.dataset.atlasRegion===region;button.classList.toggle('active',selected);button.setAttribute('aria-pressed',String(selected))});
    updateDirectoryVisibility();
    updateMapTransform(false);
    renderMarkers();
    if(mapStatus)mapStatus.textContent=`${translations[currentLanguage]?.atlasRegionStatus||''} ${translations[currentLanguage]?.[config.labelKey]||region}.`;
    if(focus)atlasElement.focus({preventScroll:true});
  }

  function regionStats(entries){
    const stats={peninsula:{projects:0,locations:0},canary:{projects:0,locations:0},venezuela:{projects:0,locations:0},nationwide:{projects:0,locations:0}};
    entries.forEach(([,project])=>stats[projectRegion(project)].projects++);
    groupLocations(entries.filter(([,project])=>project.map!==false)).forEach(group=>stats[group.region].locations++);
    stats.nationwide.locations=stats.nationwide.projects;
    return stats;
  }
  function updateRegionTabs(entries){
    const stats=regionStats(entries);
    document.querySelectorAll('[data-atlas-region]').forEach(button=>{const region=button.dataset.atlasRegion,info=stats[region]||{projects:0,locations:0};const count=button.querySelector('[data-region-count]');if(count)count.textContent=`${info.locations} ${plural(info.locations,'atlasPlace','atlasPlaces')}`;button.disabled=info.projects===0;button.setAttribute('aria-disabled',String(info.projects===0))});
    const mappedRegions=['peninsula','canary','venezuela'];
    if((stats[activeRegion]?.projects||0)===0){const next=mappedRegions.find(region=>stats[region].projects>0);if(next)setRegion(next,false)}
  }

  function renderDirectory(entries){
    Object.values(indexContainers).forEach(container=>{if(container)container.innerHTML=''});
    const grouped=groupLocations(entries.filter(([,project])=>project.map!==false));
    grouped.sort((a,b)=>getProject(a.keys[0]).title.localeCompare(getProject(b.keys[0]).title,currentLanguage));
    grouped.forEach(group=>{
      const first=getProject(group.keys[0]);
      const brands=[...new Set(group.keys.map(key=>projectData[key].brand))];
      const button=document.createElement('button');
      button.type='button';button.className='drawer-location-row';button.dataset.location=group.id;
      button.innerHTML=`<span class="drawer-location-title">${escapeHtml(first.title)}</span><span class="drawer-location-meta">${group.keys.length} ${plural(group.keys.length,'atlasProject','atlasProjects')} · ${escapeHtml(brands.join(' · '))}</span>`;
      if(activeLocationId===group.id)button.classList.add('active');
      button.addEventListener('click',()=>{if(activeRegion!==group.region)setRegion(group.region,false);focusGroups([group]);openLocation(group,button,true)});
      indexContainers[group.region]?.appendChild(button);
    });
    entries.filter(([,project])=>project.map===false).forEach(([key])=>{
      const item=getProject(key),base=projectData[key],button=document.createElement('button');
      button.type='button';button.className='drawer-location-row';button.dataset.project=key;
      button.innerHTML=`<span class="drawer-location-title">${escapeHtml(item.title)}</span><span class="drawer-location-meta">${escapeHtml(base.brand)} · ${escapeHtml(item.type)}</span>`;
      button.addEventListener('click',()=>openProject(key,button,true));
      indexContainers.nationwide?.appendChild(button);
    });
    document.querySelectorAll('[data-index-region]').forEach(section=>{const container=indexContainers[section.dataset.indexRegion];const count=container?.children.length||0;section.dataset.hasEntries=String(count>0);section.querySelector('[data-index-count]').textContent=count});
    updateDirectoryVisibility();
    const nationwideCount=entries.filter(([,project])=>project.map===false).length;
    if(drawerMobileCount)drawerMobileCount.textContent=String(grouped.length+nationwideCount);
    if(directorySummary){const parts=[`${entries.length} ${plural(entries.length,'atlasProjectEntry','atlasProjectEntries')}`];if(grouped.length)parts.push(`${grouped.length} ${plural(grouped.length,'atlasMappedLocation','atlasMappedLocations')}`);if(nationwideCount)parts.push(translations[currentLanguage]?.atlasNationwideNetwork||'');directorySummary.textContent=`${parts.join(' · ')}.`}
  }

  function updateStageCounts(){
    const queryOnly=Object.entries(projectData).filter(([key,project])=>!activeQuery||projectSearchText(key,project).includes(normalize(activeQuery)));
    document.querySelectorAll('[data-stage-count]').forEach(el=>{const stage=el.dataset.stageCount;el.textContent=stage==='all'?queryOnly.length:queryOnly.filter(([,project])=>project.stage===stage).length});
  }
  function updateFilterUI(entries){
    document.querySelectorAll('[data-atlas-stage],.stage-button[data-stage]').forEach(button=>{const stage=button.dataset.atlasStage||button.dataset.stage,selected=stage===activeStage;button.classList.toggle('active',selected);button.setAttribute('aria-pressed',String(selected))});
    const stageSelect=document.getElementById('atlas-stage-select');if(stageSelect)stageSelect.value=activeStage;
    resultNumber.textContent=entries.length;
    const resultLabel=document.getElementById('atlas-result-label');if(resultLabel)resultLabel.textContent=translations[currentLanguage]?.[entries.length===1?'atlasEntryVisible':'atlasEntriesVisible']||'';
    emptyState.hidden=entries.length!==0;
    clearSearch?.classList.toggle('visible',Boolean(activeQuery));
    resetFilters?.classList.toggle('visible',activeStage!=='all'||Boolean(activeQuery));
    if(activeSummary){
      const parts=[];
      if(activeStage!=='all')parts.push(`${translations[currentLanguage]?.atlasFilteredBy||''}: ${translations[currentLanguage]?.[stageKeys[activeStage]]||activeStage}`);
      if(activeQuery)parts.push(`${translations[currentLanguage]?.atlasSearchFor||''}: “${activeQuery}”`);
      activeSummary.textContent=parts.length?parts.join(' · '):(translations[currentLanguage]?.atlasActiveAll||'');
    }
    updateStageCounts();
    updateRegionTabs(entries);
  }
  function applyAtlasFilters(){
    const entries=filteredEntries();
    updateFilterUI(entries);
    renderDirectory(entries);
    scheduleMarkerRender();
    if(activeProjectKey&&!matches(activeProjectKey,projectData[activeProjectKey]))setDrawerDetailVisible(false);
    if(activeLocationId&&!groupLocations(entries.filter(([,project])=>project.map!==false)).some(group=>group.id===activeLocationId))setDrawerDetailVisible(false);
  }

  const stageSelect=document.getElementById('atlas-stage-select');
  document.querySelectorAll('[data-atlas-stage],.stage-button[data-stage]').forEach(button=>button.addEventListener('click',()=>{activeStage=button.dataset.atlasStage||button.dataset.stage;if(stageSelect)stageSelect.value=activeStage;applyAtlasFilters()}));
  stageSelect?.addEventListener('change',()=>{activeStage=stageSelect.value;applyAtlasFilters()});
  search?.addEventListener('input',()=>{activeQuery=search.value.trim();applyAtlasFilters()});
  search?.addEventListener('keydown',event=>{if(event.key==='Escape'){search.value='';activeQuery='';applyAtlasFilters()}});
  clearSearch?.addEventListener('click',()=>{search.value='';activeQuery='';search.focus();applyAtlasFilters()});
  resetFilters?.addEventListener('click',()=>{activeStage='all';activeQuery='';if(search)search.value='';applyAtlasFilters();search?.focus()});
  document.querySelectorAll('[data-atlas-region]').forEach(button=>{
    button.addEventListener('click',()=>setRegion(button.dataset.atlasRegion,true));
    button.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight'].includes(event.key))return;event.preventDefault();const enabled=[...document.querySelectorAll('[data-atlas-region]:not(:disabled)')],index=enabled.indexOf(button),direction=event.key==='ArrowRight'?1:-1,next=enabled[(index+direction+enabled.length)%enabled.length];if(next){next.focus();next.click()}})
  });

  drawerMobileToggle?.addEventListener('click',()=>{const open=!drawer.classList.contains('mobile-directory-open');drawer.classList.toggle('mobile-directory-open',open);drawerMobileToggle.setAttribute('aria-expanded',String(open))});
  window.addEventListener('portfolio:viewportchange',()=>{
    if(!atlasLayout?.classList.contains('atlas-expanded'))return;
    requestAnimationFrame(()=>{clampState(activeRegion);updateMapTransform(false)});
  });
  expandButton?.addEventListener('click',()=>{
    if(isMobileAtlas()){
      resetView(true);
      atlasElement.focus({preventScroll:true});
      if(mapStatus)mapStatus.textContent=translations[currentLanguage]?.resetZoom||'';
      return;
    }
    setAtlasExpanded(!atlasLayout.classList.contains('atlas-expanded'));
  });
  const handleAtlasBreakpoint=()=>{
    if(isMobileAtlas()&&atlasLayout?.classList.contains('atlas-expanded'))setAtlasExpanded(false,false);
    updateExpandControl(atlasLayout?.classList.contains('atlas-expanded'));
    clampState(activeRegion);
    updateMapTransform(false);
  };
  if(mobileAtlasQuery.addEventListener)mobileAtlasQuery.addEventListener('change',handleAtlasBreakpoint);
  else mobileAtlasQuery.addListener(handleAtlasBreakpoint);
  addEventListener('keydown',event=>{
    if(event.key!=='Escape'||!atlasLayout?.classList.contains('atlas-expanded'))return;
    if(document.querySelector('.image-lightbox.active')||document.querySelector('.project-drawer.active'))return;
    setAtlasExpanded(false);
  });

  atlasElement.addEventListener('keydown',event=>{
    const amount=48;
    if(['+','='].includes(event.key)){event.preventDefault();zoomAt(1.35)}
    else if(event.key==='-'){event.preventDefault();zoomAt(1/1.35)}
    else if(event.key==='0'){event.preventDefault();resetView()}
    else if(event.key==='ArrowLeft'){event.preventDefault();panBy(amount,0)}
    else if(event.key==='ArrowRight'){event.preventDefault();panBy(-amount,0)}
    else if(event.key==='ArrowUp'){event.preventDefault();panBy(0,amount)}
    else if(event.key==='ArrowDown'){event.preventDefault();panBy(0,-amount)}
  });
  atlasElement.addEventListener('focus',()=>{if(mapStatus)mapStatus.textContent=translations[currentLanguage]?.atlasKeyboardHint||''});
  atlasElement.addEventListener('wheel',event=>{if(!event.ctrlKey&&!event.metaKey)return;event.preventDefault();zoomAt(event.deltaY<0?1.14:1/1.14,event.clientX,event.clientY,false)},{passive:false});
  atlasElement.addEventListener('dblclick',event=>{if(!event.target.closest('button'))zoomAt(viewState[activeRegion].scale>2?1/viewState[activeRegion].scale:2,event.clientX,event.clientY)});

  const pointers=new Map();
  let gestureMode='idle';
  let suppressClick=false;
  let panStart={x:0,y:0,tx:0,ty:0};
  let pinchStart={distance:1,scale:1,tx:0,ty:0,worldX:0,worldY:0};
  const pointerValues=()=>[...pointers.values()];
  const pointerMidpoint=points=>({x:(points[0].x+points[1].x)/2,y:(points[0].y+points[1].y)/2});
  const pointerDistance=points=>Math.hypot(points[0].x-points[1].x,points[0].y-points[1].y)||1;
  const capturePointer=id=>{try{atlasElement.setPointerCapture(id)}catch(error){}}
  const releasePointer=id=>{try{if(atlasElement.hasPointerCapture(id))atlasElement.releasePointerCapture(id)}catch(error){}}
  function beginPinch(){
    const points=pointerValues();if(points.length<2)return;
    const state=viewState[activeRegion],rect=atlasElement.getBoundingClientRect(),mid=pointerMidpoint(points);
    const localX=mid.x-rect.left,localY=mid.y-rect.top;
    pinchStart={distance:pointerDistance(points),scale:state.scale,tx:state.tx,ty:state.ty,worldX:(localX-state.tx)/state.scale,worldY:(localY-state.ty)/state.scale};
    gestureMode='pinch';suppressClick=true;atlasElement.classList.add('is-interacting');
    pointers.forEach((_,id)=>capturePointer(id));
  }
  let touchPanStart={x:0,y:0,tx:0,ty:0};
  let touchPinchStart={distance:1,scale:1,worldX:0,worldY:0};
  const touchPoints=touches=>Array.from(touches).map(touch=>({x:touch.clientX,y:touch.clientY}));
  function beginTouchPinch(touches){
    const points=touchPoints(touches);if(points.length<2)return;
    const state=viewState[activeRegion],rect=atlasElement.getBoundingClientRect(),mid=pointerMidpoint(points);
    const localX=mid.x-rect.left,localY=mid.y-rect.top;
    touchPinchStart={distance:pointerDistance(points),scale:state.scale,worldX:(localX-state.tx)/state.scale,worldY:(localY-state.ty)/state.scale};
    gestureMode='touch-pinch';suppressClick=true;atlasElement.classList.add('is-interacting');
  }
  atlasElement.addEventListener('touchstart',event=>{
    if(event.touches.length>=2){event.preventDefault();beginTouchPinch(event.touches);return}
    if(event.touches.length!==1||event.target.closest('button'))return;
    const state=viewState[activeRegion];
    if(state.scale>1.001){
      event.preventDefault();
      const touch=event.touches[0];
      gestureMode='touch-pan';
      touchPanStart={x:touch.clientX,y:touch.clientY,tx:state.tx,ty:state.ty};
      atlasElement.classList.add('is-interacting');
    }
  },{passive:false});
  atlasElement.addEventListener('touchmove',event=>{
    if(event.touches.length>=2){
      event.preventDefault();
      if(gestureMode!=='touch-pinch')beginTouchPinch(event.touches);
      const points=touchPoints(event.touches).slice(0,2),rect=atlasElement.getBoundingClientRect(),mid=pointerMidpoint(points);
      const state=viewState[activeRegion];
      state.scale=Math.min(maxScale(),Math.max(1,touchPinchStart.scale*pointerDistance(points)/touchPinchStart.distance));
      state.tx=mid.x-rect.left-touchPinchStart.worldX*state.scale;
      state.ty=mid.y-rect.top-touchPinchStart.worldY*state.scale;
      updateMapTransform(false);
      return;
    }
    if(event.touches.length!==1||gestureMode!=='touch-pan'||viewState[activeRegion].scale<=1.001)return;
    event.preventDefault();
    const touch=event.touches[0],dx=touch.clientX-touchPanStart.x,dy=touch.clientY-touchPanStart.y;
    if(Math.abs(dx)>3||Math.abs(dy)>3)suppressClick=true;
    viewState[activeRegion].tx=touchPanStart.tx+dx;
    viewState[activeRegion].ty=touchPanStart.ty+dy;
    updateMapTransform(false);
  },{passive:false});
  function endTouch(event){
    if(gestureMode==='touch-pinch'&&event.touches.length===1&&viewState[activeRegion].scale>1.001){
      const touch=event.touches[0];
      gestureMode='touch-pan';
      touchPanStart={x:touch.clientX,y:touch.clientY,tx:viewState[activeRegion].tx,ty:viewState[activeRegion].ty};
      return;
    }
    if(event.touches.length===0){gestureMode='idle';atlasElement.classList.remove('is-interacting')}
  }
  atlasElement.addEventListener('touchend',endTouch,{passive:true});
  atlasElement.addEventListener('touchcancel',endTouch,{passive:true});

  atlasElement.addEventListener('pointerdown',event=>{
    if(event.pointerType==='touch'||event.target.closest('button'))return;
    pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
    if(pointers.size>=2){event.preventDefault();beginPinch();return}
    const state=viewState[activeRegion];
    if(state.scale>1.001){
      gestureMode='pan';
      panStart={x:event.clientX,y:event.clientY,tx:state.tx,ty:state.ty};
      capturePointer(event.pointerId);
      atlasElement.classList.add('is-interacting');
    }
  });
  atlasElement.addEventListener('pointermove',event=>{
    if(event.pointerType==='touch'||!pointers.has(event.pointerId))return;
    pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
    if(pointers.size>=2){
      event.preventDefault();
      if(gestureMode!=='pinch')beginPinch();
      const points=pointerValues().slice(0,2),rect=atlasElement.getBoundingClientRect(),mid=pointerMidpoint(points);
      const state=viewState[activeRegion];
      state.scale=Math.min(maxScale(),Math.max(1,pinchStart.scale*pointerDistance(points)/pinchStart.distance));
      state.tx=mid.x-rect.left-pinchStart.worldX*state.scale;
      state.ty=mid.y-rect.top-pinchStart.worldY*state.scale;
      updateMapTransform(false);
      return;
    }
    if(gestureMode!=='pan'||viewState[activeRegion].scale<=1.001)return;
    event.preventDefault();
    const dx=event.clientX-panStart.x,dy=event.clientY-panStart.y;
    if(Math.abs(dx)>3||Math.abs(dy)>3)suppressClick=true;
    viewState[activeRegion].tx=panStart.tx+dx;
    viewState[activeRegion].ty=panStart.ty+dy;
    updateMapTransform(false);
  });
  function endPointer(event){
    if(event.pointerType==='touch')return;
    pointers.delete(event.pointerId);releasePointer(event.pointerId);
    if(gestureMode==='pinch'&&pointers.size===1&&viewState[activeRegion].scale>1.001){
      const [remaining]=pointerValues();
      gestureMode='pan';
      panStart={x:remaining.x,y:remaining.y,tx:viewState[activeRegion].tx,ty:viewState[activeRegion].ty};
      return;
    }
    if(!pointers.size){gestureMode='idle';atlasElement.classList.remove('is-interacting')}
  }
  atlasElement.addEventListener('pointerup',endPointer);
  atlasElement.addEventListener('pointercancel',endPointer);
  atlasElement.addEventListener('lostpointercapture',event=>{if(pointers.has(event.pointerId))endPointer(event)});
  atlasElement.addEventListener('click',event=>{if(!suppressClick)return;suppressClick=false;if(event.target.closest('button'))return;event.preventDefault();event.stopPropagation()},true);
  document.querySelectorAll('[data-zoom-action]').forEach(button=>button.addEventListener('click',event=>{event.stopPropagation();const action=button.dataset.zoomAction;if(action==='in')zoomAt(1.4);else if(action==='out')zoomAt(1/1.4);else if(action==='fit')fitVisibleLocations();else resetView()}));
  if('ResizeObserver'in window)new ResizeObserver(()=>{clampState(activeRegion);updateMapTransform(false)}).observe(atlasElement);else window.addEventListener('resize',()=>updateMapTransform(false));
  mapImage?.addEventListener('load',()=>updateMapTransform(false));

  window.refreshAtlasLanguage=()=>{
    updateExpandControl(atlasLayout?.classList.contains('atlas-expanded'));
    const config=regions[activeRegion];
    if(mapImage)mapImage.alt=translations[currentLanguage]?.[config.altKey]||'';
    if(regionLabel)regionLabel.textContent=translations[currentLanguage]?.[config.labelKey]||activeRegion;
    applyAtlasFilters();
    if(activeProjectKey)openProject(activeProjectKey,null,false);
    const entryStat=document.getElementById('atlas-entry-stat');if(entryStat)entryStat.textContent=Object.keys(projectData).length;
  };

  setRegion(activeRegion,false);
  applyAtlasFilters();
  const entryStat=document.getElementById('atlas-entry-stat');if(entryStat)entryStat.textContent=Object.keys(projectData).length;
}
applyLanguage(currentLanguage);
addEventListener('keydown',e=>{if(e.key==='Escape'){closeLightbox();setMenu(false);if(document.querySelector('.project-drawer.active'))document.querySelector('.drawer-close')?.click()}});

/* Canonical mobile viewport handling */
(()=>{
  const root=document.documentElement;
  const resetTransientUI=()=>{
    root.classList.remove('page-leaving','atlas-expanded');
    document.body.classList.remove('page-leaving','nav-open','atlas-expanded');
    document.querySelector('.page-transition')?.classList.remove('active');
    document.querySelector('.page-loader')?.classList.add('hidden');
  };
  let frame=0;
  const syncViewport=()=>{
    cancelAnimationFrame(frame);
    frame=requestAnimationFrame(()=>{
      const viewport=window.visualViewport;
      const height=Math.round(viewport?.height||window.innerHeight);
      const top=Math.round(viewport?.offsetTop||0);
      root.style.setProperty('--portfolio-viewport-height',`${height}px`);
      root.style.setProperty('--portfolio-viewport-top',`${top}px`);
      root.style.setProperty('--mobile-vh',`${height*.01}px`);
      window.dispatchEvent(new Event('portfolio:viewportchange'));
    });
  };
  window.syncPortfolioViewport=syncViewport;
  window.addEventListener('pageshow',event=>{
    resetTransientUI();
    syncViewport();
    if(event.persisted)requestAnimationFrame(()=>window.dispatchEvent(new Event('resize')));
  });
  window.addEventListener('pagehide',()=>{
    root.classList.remove('atlas-expanded');
    document.body.classList.remove('nav-open','atlas-expanded');
  });
  window.visualViewport?.addEventListener('resize',syncViewport,{passive:true});
  window.visualViewport?.addEventListener('scroll',syncViewport,{passive:true});
  window.addEventListener('resize',syncViewport,{passive:true});
  window.addEventListener('orientationchange',()=>setTimeout(syncViewport,180));
  syncViewport();
})();
