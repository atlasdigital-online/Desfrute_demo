const header = document.querySelector('[data-header]');
const navToggle = document.querySelector('[data-nav-toggle]');
const navLinks = document.querySelector('[data-nav-links]');
const filters = [...document.querySelectorAll('[data-filter]')];
const dishes = [...document.querySelectorAll('[data-category]')];
const orderButtons = [...document.querySelectorAll('[data-order]')];
const bookingForm = document.querySelector('[data-booking-form]');
const toast = document.querySelector('[data-toast]');
const lightbox = document.querySelector('[data-lightbox-dialog]');
const lightboxImage = document.querySelector('[data-lightbox-image]');
const lightboxCaption = document.querySelector('[data-lightbox-caption]');
const lightboxClose = document.querySelector('[data-lightbox-close]');

const PHONE = '258840606391';

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 3600);
}

function setMenu(open) {
  if (!navToggle || !navLinks) return;
  navLinks.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  document.body.classList.toggle('menu-open', open);
}

navToggle?.addEventListener('click', () => {
  setMenu(navToggle.getAttribute('aria-expanded') !== 'true');
});

navLinks?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenu(false));
});

window.addEventListener('scroll', () => {
  header?.classList.toggle('scrolled', window.scrollY > 18);
}, { passive: true });

filters.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filters.forEach((item) => {
      const selected = item === button;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    dishes.forEach((dish) => {
      const categories = dish.dataset.category.split(' ');
      dish.classList.toggle('is-hidden', filter !== 'all' && !categories.includes(filter));
    });
  });
});

orderButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const dish = button.dataset.order;
    const message = `Olá Desfrute, gostaria de saber se o prato “${dish}” está disponível e qual é o preço.`;
    window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
  });
});

function updateOpenStatus() {
  const status = document.querySelector('[data-open-status]');
  const dot = document.querySelector('.status-dot');
  if (!status) return;
  try {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Africa/Maputo', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false
    }).formatToParts(new Date());
    const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
    const minutes = Number(values.hour) * 60 + Number(values.minute);
    const close = values.weekday === 'Sun' ? 22 * 60 : 23 * 60;
    const open = minutes >= 10 * 60 && minutes < close;
    status.textContent = open ? 'Aberto agora' : 'Fechado agora';
    dot?.classList.toggle('closed', !open);
  } catch {
    status.textContent = 'Aberto todos os dias';
  }
}

updateOpenStatus();
document.querySelector('[data-year]').textContent = new Date().getFullYear();

bookingForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(bookingForm);
  const message = [
    'Olá Desfrute, gostaria de solicitar uma reserva.',
    '',
    `Nome: ${data.get('nome')}`,
    `Data: ${data.get('data')}`,
    `Hora: ${data.get('hora')}`,
    `Número de pessoas: ${data.get('pessoas')}`,
    `Telefone: ${data.get('telefone')}`,
    data.get('nota') ? `Observação: ${data.get('nota')}` : '',
    '',
    'Por favor, confirmem a disponibilidade. Obrigado.'
  ].filter(Boolean).join('\n');
  showToast('A abrir o WhatsApp para concluir o pedido…');
  window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
});

document.querySelectorAll('[data-lightbox]').forEach((item) => {
  item.addEventListener('click', () => {
    if (!lightbox || !lightboxImage || !lightboxCaption) return;
    lightboxImage.src = item.dataset.lightbox;
    lightboxImage.alt = item.dataset.caption;
    lightboxCaption.textContent = item.dataset.caption;
    lightbox.showModal();
    document.body.classList.add('lightbox-open');
  });
});

function closeLightbox() {
  lightbox?.close();
  document.body.classList.remove('lightbox-open');
}

lightboxClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});
lightbox?.addEventListener('close', () => document.body.classList.remove('lightbox-open'));

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if ('IntersectionObserver' in window && !reducedMotion) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -24px' });
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('visible'));
}
