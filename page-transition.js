/* =========================================================
   GLOBAL PAGE TRANSITION
   ========================================================= */

const pageTransition =
  document.querySelector("#page-transition");


/* ---------------------------------------------------------
   SAFETY CHECK
   --------------------------------------------------------- */

if (!pageTransition) {

  console.warn(
    "Page transition element not found."
  );

} else {

  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );


  /* -------------------------------------------------------
     ENTER TRANSITION
     ------------------------------------------------------- */

  function enterPage() {

    if (
      pageTransition.dataset.waitFor3d === "true" &&
      !window.__main3DReady
    ) {
      return;
    }

    pageTransition.classList.remove(
      "is-active"
    );

    pageTransition.setAttribute(
      "aria-hidden",
      "true"
    );
  }


  /* -------------------------------------------------------
     LEAVE TRANSITION
     ------------------------------------------------------- */

  function leavePage(url) {

    pageTransition.classList.add(
      "is-active"
    );

    pageTransition.setAttribute(
      "aria-hidden",
      "false"
    );


    if (reducedMotion.matches) {

      window.location.href = url;

      return;
    }


    setTimeout(() => {

      window.location.href = url;

    }, 480);
  }


  /* -------------------------------------------------------
     NAVIGATION INTERCEPTION
     ------------------------------------------------------- */

  document.addEventListener(
    "click",
    (event) => {

      const link =
        event.target.closest("a[href]");


      if (!link) {
        return;
      }


      /*
       * Ignore modified clicks.
       */
      if (
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey
      ) {

        return;
      }


      /*
       * Ignore external links.
       */
      if (
        link.target === "_blank"
      ) {

        return;
      }


      const href =
        link.getAttribute("href");


      if (!href) {
        return;
      }


      /*
       * Ignore anchors.
       */
      if (
        href.startsWith("#")
      ) {

        return;
      }


      /*
       * Ignore javascript pseudo-links.
       */
      if (
        href.startsWith("javascript:")
      ) {

        return;
      }


      /*
       * Ignore downloads.
       */
      if (
        link.hasAttribute("download")
      ) {

        return;
      }


      /*
       * Ignore mail / tel links.
       */
      if (
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      ) {

        return;
      }


      /*
       * Only transition within our website.
       */
      const destination =
        new URL(
          href,
          window.location.href
        );


      if (
        destination.origin !==
        window.location.origin
      ) {

        return;
      }


      /*
       * Same document.
       */
      if (
        destination.href ===
        window.location.href
      ) {

        return;
      }


      event.preventDefault();


      leavePage(
        destination.href
      );

    }
  );


  if (pageTransition.dataset.waitFor3d === "true") {
    if (window.__main3DReady) {
      enterPage();
    } else {
      window.addEventListener(
        "main3d-ready",
        enterPage,
        { once: true }
      );
    }
  }

  /* -------------------------------------------------------
     INITIAL PAGE ENTRY
     ------------------------------------------------------- */

  window.addEventListener(
    "pageshow",
    () => {

      /*
       * Give the browser one frame to
       * finish the initial render.
       */
      requestAnimationFrame(() => {

        setTimeout(
          enterPage,
          40
        );

      });

    }
  );


  /* -------------------------------------------------------
     BACK / FORWARD CACHE
     ------------------------------------------------------- */

  window.addEventListener(
    "pagehide",
    () => {

      pageTransition.classList.remove(
        "is-active"
      );

    }
  );

}