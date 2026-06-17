// ui-enhancements.js
//
// Cursor-tilt on cards and scroll-triggered reveals for static sections.
// This is pure progressive enhancement: it adds classes to elements that
// already exist instead of changing markup, and content is only ever
// hidden-then-revealed if this script successfully runs in a browser that
// prefers motion. Dynamically rebuilt content (feature bars, similar-case
// cards, the model table) is intentionally left alone so it never flickers
// while the predictor is in use.

document.documentElement.classList.add("js-ready");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

// The input panel is excluded from tilt: it holds the live form, and
// rotating it while someone is filling it in does more harm than good.
document.querySelectorAll(".panel:not(.input-panel), .metrics-strip article").forEach((el) => {
  el.classList.add("tilt-card");
});

document
  .querySelectorAll(".metrics-strip article, .section-heading, .panel, .pipeline-panel li")
  .forEach((el) => {
    el.classList.add("reveal");
  });

if (!prefersReducedMotion && hasFinePointer) {
  document.querySelectorAll(".tilt-card").forEach(enableTilt);
}

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

function enableTilt(card) {
  const maxTiltDegrees = 5;

  function handleMove(event) {
    const rect = card.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    const rotateX = (0.5 - py) * maxTiltDegrees;
    const rotateY = (px - 0.5) * maxTiltDegrees;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    card.style.setProperty("--mx", `${px * 100}%`);
    card.style.setProperty("--my", `${py * 100}%`);
  }

  function reset() {
    card.style.transform = "";
  }

  card.addEventListener("mousemove", handleMove);
  card.addEventListener("mouseleave", reset);
}
