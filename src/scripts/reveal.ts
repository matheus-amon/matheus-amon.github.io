import { timelineProgress } from '../lib/timeline';

function setupMenu(): void {
  const toggle = document.querySelector<HTMLButtonElement>('.menu-toggle');
  const list = document.getElementById('nav-list');
  if (!toggle || !list) return;

  const setOpen = (open: boolean) => {
    toggle.setAttribute('aria-expanded', String(open));
    list.classList.toggle('is-open', open);
  };

  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  list.addEventListener('click', (event) => {
    if ((event.target as HTMLElement).closest('a')) setOpen(false);
  });
  // Só troca a navegação pelo botão depois que o clique já funciona.
  document.documentElement.classList.add('menu-ready');
}

function setupReveal(): void {
  const items = document.querySelectorAll<HTMLElement>('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
  );
  items.forEach((el) => observer.observe(el));
}

function setupTimeline(): void {
  const timelines = document.querySelectorAll<HTMLElement>('[data-timeline]');
  if (timelines.length === 0) return;

  let scheduled = false;
  const update = () => {
    scheduled = false;
    const anchor = window.innerHeight * 0.6;
    timelines.forEach((timeline) => {
      const rect = timeline.getBoundingClientRect();
      timeline.style.setProperty('--progress', timelineProgress(anchor, rect.top, rect.height).toFixed(3));
      timeline.querySelectorAll<HTMLElement>('.role').forEach((role) => {
        role.classList.toggle('is-lit', role.getBoundingClientRect().top < anchor);
      });
    });
  };
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(update);
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  update();
}

setupMenu();
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  setupReveal();
  setupTimeline();
  // Só esconde os blocos depois que tudo acima rodou: se algo falhar, o conteúdo continua visível.
  document.documentElement.classList.add('motion');
}
