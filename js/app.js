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
const bgObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(!entry.isIntersecting) return;
    themeClasses.forEach(cls => body.classList.remove(cls));
    const bg = entry.target.dataset.bg;
    if(['ecoalf','ikks','story','journal'].includes(bg)) body.classList.add(`bg-${bg}`);
  });
},{rootMargin:'-38% 0px -48% 0px'});
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
