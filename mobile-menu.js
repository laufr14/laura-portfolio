const menuToggle = document.querySelector(".mobile-menu-toggle");
const mobileMenu = document.querySelector("#mobile-menu");
const closeButtons = document.querySelectorAll("[data-menu-close]");
const menuLinks = document.querySelectorAll(".mobile-menu__link");
const menuCv = document.querySelector(".mobile-menu__cv");

if (!menuToggle || !mobileMenu) {
  console.warn("Mobile menu elements not found.");
} else {
  const body = document.body;

  let lastFocusedElement = null;

  function openMenu() {
    lastFocusedElement = document.activeElement;

    mobileMenu.classList.add("is-open");
    mobileMenu.setAttribute("aria-hidden", "false");

    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation menu");

    body.classList.add("mobile-menu-open");

    requestAnimationFrame(() => {
      const firstFocusableElement = mobileMenu.querySelector(
        ".mobile-menu__close"
      );

      firstFocusableElement?.focus();
    });
  }

  function closeMenu() {
    mobileMenu.classList.remove("is-open");
    mobileMenu.setAttribute("aria-hidden", "true");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");

    body.classList.remove("mobile-menu-open");

    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  function toggleMenu() {
    const isOpen = mobileMenu.classList.contains("is-open");

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  // Open / close menu
  menuToggle.addEventListener("click", toggleMenu);

  // Close buttons + backdrop
  closeButtons.forEach((button) => {
    button.addEventListener("click", closeMenu);
  });

  // Close when selecting a navigation option
  menuLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Close when selecting CV
  menuCv?.addEventListener("click", closeMenu);

  // Close with ESC
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mobileMenu.classList.contains("is-open")) {
      closeMenu();
    }
  });

  // Prevent the menu from remaining open if the viewport
  // becomes larger than the mobile breakpoint.
  window.addEventListener("resize", () => {
    if (
      window.innerWidth > 560 &&
      mobileMenu.classList.contains("is-open")
    ) {
      closeMenu();
    }
  });

  // Respect reduced motion preferences
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  if (reducedMotion.matches) {
    mobileMenu.classList.add("reduced-motion");
  }

  reducedMotion.addEventListener("change", (event) => {
    mobileMenu.classList.toggle(
      "reduced-motion",
      event.matches
    );
  });
}