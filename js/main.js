(function () {
  "use strict";

  /* ---- Mobile nav toggle ---- */
  var navToggle = document.getElementById("navToggle");
  var siteNav = document.getElementById("siteNav");

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = siteNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    siteNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        siteNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---- Scroll progress bar + sticky header state ---- */
  var scrollProgress = document.getElementById("scrollProgress");
  var siteHeader = document.querySelector(".site-header");
  var ticking = false;

  function updateOnScroll() {
    var doc = document.documentElement;
    var scrollTop = window.scrollY || doc.scrollTop;
    var max = doc.scrollHeight - doc.clientHeight;
    if (scrollProgress && max > 0) {
      scrollProgress.style.width = Math.min(100, (scrollTop / max) * 100) + "%";
    }
    if (siteHeader) {
      siteHeader.classList.toggle("is-scrolled", scrollTop > 12);
    }
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        window.requestAnimationFrame(updateOnScroll);
        ticking = true;
      }
    },
    { passive: true }
  );
  updateOnScroll();

  /* ---- Active nav link highlighting ---- */
  var navLinks = document.querySelectorAll(".site-nav a");
  var navSections = [];
  navLinks.forEach(function (link) {
    var id = link.getAttribute("href");
    if (id && id.charAt(0) === "#") {
      var target = document.querySelector(id);
      if (target) navSections.push({ link: link, el: target });
    }
  });

  if (navSections.length && "IntersectionObserver" in window) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var match = navSections.filter(function (s) { return s.el === entry.target; })[0];
          if (!match) return;
          if (entry.isIntersecting) {
            navLinks.forEach(function (l) { l.classList.remove("is-active"); });
            match.link.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    navSections.forEach(function (s) { navObserver.observe(s.el); });
  }

  /* ---- Hero cursor spotlight + portrait tilt/parallax ---- */
  var heroSection = document.getElementById("heroSection");
  var heroPortrait = document.getElementById("heroPortrait");
  var supportsHover = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var tiltX = 0, tiltY = 0, portraitScrollOffset = 0;

  function applyPortraitTransform() {
    if (!heroPortrait) return;
    heroPortrait.style.transform =
      "translate3d(0, " + portraitScrollOffset + "px, 0) rotateX(" + tiltX + "deg) rotateY(" + tiltY + "deg)";
  }

  if (heroSection && supportsHover) {
    heroSection.addEventListener("mousemove", function (e) {
      var rect = heroSection.getBoundingClientRect();
      var px = ((e.clientX - rect.left) / rect.width) * 100;
      var py = ((e.clientY - rect.top) / rect.height) * 100;
      heroSection.style.setProperty("--mx", px + "%");
      heroSection.style.setProperty("--my", py + "%");
      if (heroPortrait) {
        tiltX = ((py - 50) / 50) * -6;
        tiltY = ((px - 50) / 50) * 6;
        applyPortraitTransform();
      }
    });
    heroSection.addEventListener("mouseleave", function () {
      tiltX = 0; tiltY = 0;
      applyPortraitTransform();
    });
  }

  if (heroPortrait) {
    window.addEventListener(
      "scroll",
      function () {
        window.requestAnimationFrame(function () {
          var rect = heroPortrait.getBoundingClientRect();
          var viewportCenter = window.innerHeight / 2;
          var elCenter = rect.top + rect.height / 2;
          portraitScrollOffset = (viewportCenter - elCenter) * 0.06;
          applyPortraitTransform();
        });
      },
      { passive: true }
    );
  }

  /* ---- Scroll reveal ---- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }
})();
