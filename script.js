document.querySelector('#events')?.remove();
document.querySelector('#admissions .notice')?.remove();
document.querySelector('#school .lead').insertAdjacentText('beforeend', ' The current principal is Mrs. Florence Gustave-Denis.');
const clubsGrid = document.querySelector('#clubs .clubs-grid');
const additionalClubs = [
  ['Red Cross', 'Service, first aid awareness, and community care.'],
  ['Environment Club', 'Environmental responsibility, conservation, and action.'],
  ['Arts and Crafts', 'Making, design, creativity, and practical expression.'],
  ['French Club', 'French language, culture, and communication.'],
  ['Spanish Club', 'Spanish language, culture, and conversation.'],
  ['Fusion Steel Orchestra', 'Music, rhythm, performance, and teamwork.'],
  ['Dukers', 'School spirit, participation, and student connection.'],
  ['Chef Helpers', 'Food preparation, hospitality, and practical skills.'],
  ['Dance Club', 'Movement, performance, confidence, and coordination.'],
  ['Cultural Club', 'Heritage, traditions, creativity, and celebration.']
];
additionalClubs.forEach(([name, description]) => {
  const club = document.createElement('div');
  club.className = 'club';
  club.innerHTML = `<h3>${name}</h3><p>${description}</p>`;
  clubsGrid.appendChild(club);
});
const clubCategories = {
  'Service & leadership': ['Cadets', 'Red Cross', 'Environment Club', 'Student Council', 'Dukers'],
  'Arts & culture': ['Literary', 'Photography', 'Arts and Crafts', 'Fusion Steel Orchestra', 'Dance Club', 'Cultural Club'],
  'Academics & tech': ['Science', 'IT', 'Debate', 'Chess Club', 'French Club', 'Spanish Club'],
  'Student wellbeing': ['Drug Free', 'Peer Helper', 'Boys Legacy', 'Girls Moving Forward', 'Chef Helpers']
};
const clubsByName = new Map([...clubsGrid.children].map(club => [club.querySelector('h3').textContent, club]));
clubsGrid.innerHTML = '';
const clubFilterBar = document.createElement('div');
clubFilterBar.className = 'club-filters';
clubFilterBar.setAttribute('aria-label', 'Filter clubs by category');
clubFilterBar.innerHTML = '<button class="club-filter is-selected" type="button" data-filter="all">All clubs</button>';
Object.entries(clubCategories).forEach(([category, names]) => {
  const filter = document.createElement('button');
  filter.className = 'club-filter';
  filter.type = 'button';
  filter.dataset.filter = category;
  filter.textContent = category;
  clubFilterBar.appendChild(filter);
  const group = document.createElement('div');
  group.className = 'club-category';
  group.dataset.category = category;
  group.innerHTML = `<h3>${category}</h3><div class="category-clubs"></div>`;
  const categoryClubs = group.querySelector('.category-clubs');
  names.forEach(name => {
    if (clubsByName.has(name)) categoryClubs.appendChild(clubsByName.get(name));
  });
  clubsGrid.appendChild(group);
});
clubsGrid.before(clubFilterBar);
clubFilterBar.addEventListener('click', event => {
  const filter = event.target.closest('.club-filter');
  if (!filter) return;
  clubFilterBar.querySelectorAll('.club-filter').forEach(button => button.classList.toggle('is-selected', button === filter));
  clubsGrid.querySelectorAll('.club-category').forEach(group => {
    group.hidden = filter.dataset.filter !== 'all' && group.dataset.category !== filter.dataset.filter;
  });
});
const houseNames = ['Jesse', 'Ellis', 'Bourne', 'Leon'];
document.querySelectorAll('#school-activities .house p').forEach((label, index) => {
  label.textContent = houseNames[index];
});
const pastStudentPhotos = [
  ['assets/julian-alfred.jpg', 'Julian Alfred'],
  ['assets/johnson-charles.jpg', 'Johnson Charles'],
  ['assets/kenson-casimier.jpg', 'Kenson Casimier'],
  ['assets/menissa-rambally.jpg', 'Menissa Rambally']
];
document.querySelectorAll('#past-student-profiles .past-student img').forEach((image, index) => {
  if (pastStudentPhotos[index]) {
    image.src = pastStudentPhotos[index][0];
    image.alt = pastStudentPhotos[index][1];
  }
});
// Keep every slideshow strictly inside its own activity card.
// Each card gets its own image list, active slide, indicators, and timer.
const activityCards = [...document.querySelectorAll('#school-activities .event-card')];
// Stagger slide changes from right to left, moving down through each row.
const rightToLeftOrder = [...activityCards].sort((a, b) => {
  const aRect = a.getBoundingClientRect();
  const bRect = b.getBoundingClientRect();
  if (Math.abs(aRect.top - bRect.top) > 20) return aRect.top - bRect.top;
  return bRect.left - aRect.left;
});
activityCards.forEach(card => {
  const staggerIndex = rightToLeftOrder.indexOf(card);
  const gallery = card.querySelector(':scope > .photo-strip');
  if (!gallery) return;
  const images = [...gallery.querySelectorAll(':scope > img')];
  if (images.length < 2) return;

  gallery.classList.add('is-auto-slideshow');
  const indicators = document.createElement('div');
  indicators.className = 'slideshow-indicators';
  indicators.setAttribute('role', 'group');
  indicators.setAttribute('aria-label', `Choose ${card.querySelector('.event-copy h3')?.textContent || 'activity'} photo`);

  let activeIndex = 0;
  let timer = null;
  let startDelay = null;

  const dots = images.map((image, index) => {
    const dot = document.createElement('button');
    dot.className = 'slideshow-dot';
    dot.type = 'button';
    dot.setAttribute('aria-label', `Show photo ${index + 1}`);
    dot.setAttribute('aria-pressed', 'false');
    dot.addEventListener('click', () => {
      showSlide(index);
      startTimer();
    });
    indicators.appendChild(dot);
    return dot;
  });

  function showSlide(index) {
    images.forEach((image, imageIndex) => {
      const active = imageIndex === index;
      image.classList.toggle('is-active', active);
      image.setAttribute('aria-hidden', String(!active));
    });
    dots.forEach((dot, dotIndex) => {
      const active = dotIndex === index;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-pressed', String(active));
    });
    activeIndex = index;
  }

  function startTimer() {
    window.clearTimeout(startDelay);
    window.clearInterval(timer);
    // Each card starts 500 ms after the card to its right; the cadence
    // remains staggered on every cycle instead of switching in unison.
    startDelay = window.setTimeout(() => {
      timer = window.setInterval(() => {
        showSlide((activeIndex + 1) % images.length);
      }, 3500);
    }, staggerIndex * 500);
  }

  showSlide(0);
  gallery.after(indicators);
  startTimer();
});
const activities = document.querySelector('#school-activities');
if (activities) {
  const lightbox = document.createElement('dialog');
  lightbox.className = 'gallery-lightbox';
  lightbox.innerHTML = '<button class="lightbox-close" type="button" aria-label="Close image">Close</button><img alt="">';
  document.body.appendChild(lightbox);
  const lightboxImage = lightbox.querySelector('img');
  const closeLightbox = () => lightbox.close();
  activities.addEventListener('click', event => {
    const image = event.target.closest('.photo-strip img');
    if (!image) return;
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    lightbox.showModal();
  });
  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', event => {
    if (event.target === lightbox) closeLightbox();
  });
}
const navLinks = [...document.querySelectorAll('.nav-links a')];
const navSections = navLinks.map(link => document.querySelector(link.hash)).filter(Boolean);
const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => link.classList.toggle('is-active', link.hash === `#${entry.target.id}`));
  });
}, { rootMargin: '-25% 0px -65% 0px' });
navSections.forEach(section => navObserver.observe(section));
const contact = document.querySelector('#contact .contact');
if (contact) {
  const map = document.createElement('iframe');
  map.className = 'map-frame';
  map.title = 'Map showing Leon Hess Comprehensive Secondary School';
  map.loading = 'lazy';
  map.src = 'https://www.google.com/maps?q=Leon+Hess+Comprehensive+Secondary+School+Saint+Lucia&output=embed';
  contact.appendChild(map);
}
const backToTop = document.createElement('a');
backToTop.className = 'back-to-top';
backToTop.href = '#top';
backToTop.setAttribute('aria-label', 'Back to top');
backToTop.textContent = '↑';
document.body.appendChild(backToTop);
const updateBackToTop = () => backToTop.classList.toggle('is-visible', window.scrollY > 500);
window.addEventListener('scroll', updateBackToTop, { passive: true });
updateBackToTop();
