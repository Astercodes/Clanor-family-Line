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

  /* ---- Twelve Pillars interactive panel ---- */
  var PILLARS = [
    {
      name: "Spiritual",
      create: "Prayer culture, prophetic identity",
      nourish: "Intercession, Word, worship",
      sustain: "Covering in every season",
      build: "Spiritual systems for the household"
    },
    {
      name: "Soul / Emotional",
      create: "Safe environments",
      nourish: "Consistent affirmation and listening",
      sustain: "Walking through grief and pain",
      build: "Emotional intelligence across the family"
    },
    {
      name: "Mental / Intellectual",
      create: "Learning cultures",
      nourish: "Wisdom transfer, mentorship",
      sustain: "Protecting the mind from destructive input",
      build: "Educational legacy and knowledge systems"
    },
    {
      name: "Physical",
      create: "Healthy home rhythms",
      nourish: "Food, health, rest, shelter",
      sustain: "Sabbath and physical restoration",
      build: "Systems of health and provision"
    },
    {
      name: "Financial / Resources",
      create: "First wealth, first assets",
      nourish: "Teaching stewardship and generosity",
      sustain: "Maintaining and protecting what is built",
      build: "Generational wealth and inheritance systems"
    },
    {
      name: "Legacy / Generational",
      create: "New family narrative",
      nourish: "Testimonies, stories, memory",
      sustain: "Passing the baton with intention",
      build: "Documented legacy and family covenant"
    },
    {
      name: "Healing / Restoration",
      create: "Safe space to be broken",
      nourish: "Walking the healing journey",
      sustain: "Staying in it until it is complete",
      build: "Freedom systems: deliverance, counselling, accountability"
    },
    {
      name: "Community / Connection",
      create: "Gathering rhythms and culture",
      nourish: "Presence, celebration, honour",
      sustain: "Maintaining bonds across seasons",
      build: "Relational infrastructure across the family line"
    },
    {
      name: "Career / Vocation",
      create: "Identifying and naming gifts",
      nourish: "Mentorship, access, opportunity",
      sustain: "Walking through pivots and setbacks",
      build: "Career pipelines, entrepreneurship, vocational legacy"
    },
    {
      name: "Marriage",
      create: "Covenant culture",
      nourish: "Investing in marriages consistently",
      sustain: "Fighting for marriages in hard seasons",
      build: "Marriage discipleship systems for the family"
    },
    {
      name: "Dating / Courtship",
      create: "Wisdom culture before covenant",
      nourish: "Teaching discernment and identity",
      sustain: "Guarding purity through long seasons of waiting",
      build: "Courtship frameworks passed to the next generation"
    },
    {
      name: "Nation Building",
      create: "Kingdom presence in society",
      nourish: "Voice, advocacy, community investment",
      sustain: "Showing up in public life consistently",
      build: "Institutions, businesses, platforms that shape the nation"
    }
  ];

  var tabsEl = document.getElementById("pillarTabs");
  var detailEl = document.getElementById("pillarDetail");

  if (tabsEl && detailEl) {
    tabsEl.classList.add("reveal", "stagger");

    PILLARS.forEach(function (pillar, index) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "pillar-tab" + (index === 0 ? " is-active" : "");
      btn.textContent = pillar.name;
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", index === 0 ? "true" : "false");
      btn.addEventListener("click", function () {
        if (btn.classList.contains("is-active")) return;
        tabsEl.querySelectorAll(".pillar-tab").forEach(function (t) {
          t.classList.remove("is-active");
          t.setAttribute("aria-selected", "false");
        });
        btn.classList.add("is-active");
        btn.setAttribute("aria-selected", "true");
        switchPillar(pillar);
      });
      tabsEl.appendChild(btn);
    });

    function renderPillar(pillar) {
      detailEl.innerHTML =
        '<h3>' + pillar.name + '</h3>' +
        '<div class="pillar-detail-grid">' +
          '<div class="pillar-detail-cell"><span>Create</span><p>' + pillar.create + '</p></div>' +
          '<div class="pillar-detail-cell"><span>Nourish</span><p>' + pillar.nourish + '</p></div>' +
          '<div class="pillar-detail-cell"><span>Sustain</span><p>' + pillar.sustain + '</p></div>' +
          '<div class="pillar-detail-cell"><span>Build</span><p>' + pillar.build + '</p></div>' +
        '</div>';
    }

    function switchPillar(pillar) {
      var grid = detailEl.querySelector(".pillar-detail-grid");
      if (!grid) { renderPillar(pillar); return; }
      grid.classList.add("is-switching");
      window.setTimeout(function () {
        renderPillar(pillar);
      }, 180);
    }

    renderPillar(PILLARS[0]);
  }

  /* ---- Scroll reveal (runs last so dynamically-added .reveal elements, like the pillar tabs, are included) ---- */
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
