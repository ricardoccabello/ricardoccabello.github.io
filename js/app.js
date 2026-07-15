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

themeToggle.addEventListener('click', () => {
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
