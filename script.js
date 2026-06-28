const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

$("#year").textContent = new Date().getFullYear();

// Mobile nav
const navToggle = $("#navToggle");
const navLinks = $("#navLinks");

navToggle?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});
$$('#navLinks a').forEach(a => {
  a.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

// Typing animation - Power BI first
const typingEl = $("#typing");
const words = ["Power BI", "DAX", "SQL", "Power Query", "Data Modelling", "KPI Analysis", "Excel"];
let w = 0, c = 0, deleting = false;

function typeLoop(){
  const current = words[w];
  if (!deleting) {
    c++;
    typingEl.textContent = current.slice(0, c);
    if (c === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1100);
      return;
    }
  } else {
    c--;
    typingEl.textContent = current.slice(0, c);
    if (c === 0) {
      deleting = false;
      w = (w + 1) % words.length;
    }
  }
  setTimeout(typeLoop, deleting ? 45 : 75);
}
typeLoop();

// Theme buttons
const lightBtn = $("#lightBtn");
const darkBtn = $("#darkBtn");

function setTheme(theme){
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  lightBtn.classList.toggle("active", theme === "light");
  darkBtn.classList.toggle("active", theme === "dark");
}
setTheme(localStorage.getItem("theme") || "dark");
lightBtn?.addEventListener("click", () => setTheme("light"));
darkBtn?.addEventListener("click", () => setTheme("dark"));

// Scroll reveal
const revealEls = $$(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));

// Project filtering
const chips = $$(".chip");
const cards = $$(".pCard");

chips.forEach(chip => {
  chip.addEventListener("click", () => {
    chips.forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    const filter = chip.dataset.filter;
    cards.forEach(card => {
      const tags = (card.dataset.tags || "").split(",").map(t => t.trim());
      const show = filter === "all" || tags.includes(filter);
      card.style.display = show ? "block" : "none";
    });
  });
});

// Lightbox
const lightbox = $("#lightbox");
const lightboxImg = $("#lightboxImg");
const lightboxClose = $("#lightboxClose");

const placeholderSvg = encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect width="800" height="500" fill="#1a2a4a"/><text x="400" y="250" font-size="32" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-family="Arial">Dashboard Preview</text></svg>');

$$(".pThumb").forEach(img => {
  img.addEventListener("error", () => {
    img.src = 'data:image/svg+xml,' + placeholderSvg;
  });
  img.addEventListener("click", () => {
    lightboxImg.src = img.src;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  });
});

function closeLightbox(){
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImg.src = "";
}

lightboxClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});

// Form submit
function fakeSubmit(e) {
  e.preventDefault();
  $("#formMsg").textContent = "Thanks! To receive messages, connect this form to Formspree or Netlify Forms.";
  return false;
}
window.fakeSubmit = fakeSubmit;
