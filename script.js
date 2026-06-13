const menuToggle = document.querySelector("#menuToggle");
const navLinks = document.querySelector("#navLinks");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion) {
  document.documentElement.classList.add("motion-ready");

  const scrollProgress = document.createElement("div");
  scrollProgress.className = "scroll-progress";
  scrollProgress.setAttribute("aria-hidden", "true");
  document.body.prepend(scrollProgress);

  let scrollTicking = false;

  const updateScrollProgress = () => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
    scrollProgress.style.setProperty("--scroll-progress", String(Math.min(Math.max(progress, 0), 1)));
    scrollTicking = false;
  };

  window.addEventListener("scroll", () => {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(updateScrollProgress);
  }, { passive: true });

  updateScrollProgress();
}

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  menuToggle.classList.toggle("is-active", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    navLinks.classList.remove("is-open");
    menuToggle.classList.remove("is-active");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

document.querySelectorAll(".accordion__item button").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".accordion__item");
    const isOpen = item.classList.contains("is-open");

    document.querySelectorAll(".accordion__item").forEach((accordionItem) => {
      accordionItem.classList.remove("is-open");
      accordionItem.querySelector("button").setAttribute("aria-expanded", "false");
    });

    if (!isOpen) {
      item.classList.add("is-open");
      button.setAttribute("aria-expanded", "true");
    }
  });
});

document.querySelectorAll(".step").forEach((step) => {
  step.addEventListener("click", () => {
    document.querySelectorAll(".step").forEach((item) => item.classList.toggle("is-active", item === step));
  });
});

if (!prefersReducedMotion) {
  const revealGroups = [
    [".trust-strip__inner", ""],
    [".section-heading", ""],
    [".feature-card", ""],
    [".property-card", ""],
    [".process__copy", "reveal--left"],
    [".subscribe__card", ""],
    [".faq__layout > div:first-child", "reveal--left"],
    [".accordion__item", "reveal--right"],
    [".footer .container", ""],
  ];

  const revealElements = [];

  revealGroups.forEach(([selector, modifier]) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      element.classList.add("reveal");
      if (modifier) element.classList.add(modifier);
      element.style.setProperty("--reveal-delay", `${Math.min(index * 85, 255)}ms`);
      revealElements.push(element);
    });
  });

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, {
      rootMargin: "0px 0px -8% 0px",
      threshold: 0.12,
    });

    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  }

  const hero = document.querySelector(".hero");
  const heroVisual = document.querySelector(".hero__visual");

  hero.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") return;
    const bounds = hero.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    heroVisual.style.setProperty("--photo-x", `${x * 14}px`);
    heroVisual.style.setProperty("--photo-y", `${y * 10}px`);
    heroVisual.style.setProperty("--mascot-x", `${x * -18}px`);
    heroVisual.style.setProperty("--mascot-y", `${y * -14}px`);
  });

  hero.addEventListener("pointerleave", () => {
    heroVisual.style.setProperty("--photo-x", "0px");
    heroVisual.style.setProperty("--photo-y", "0px");
    heroVisual.style.setProperty("--mascot-x", "0px");
    heroVisual.style.setProperty("--mascot-y", "0px");
  });

  document.querySelectorAll(".feature-card, .property-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch") return;
      const bounds = card.getBoundingClientRect();
      card.style.setProperty("--spot-x", `${event.clientX - bounds.left}px`);
      card.style.setProperty("--spot-y", `${event.clientY - bounds.top}px`);
    });
  });
}
