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
    PILLARS.forEach(function (pillar, index) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "pillar-tab" + (index === 0 ? " is-active" : "");
      btn.textContent = pillar.name;
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", index === 0 ? "true" : "false");
      btn.addEventListener("click", function () {
        tabsEl.querySelectorAll(".pillar-tab").forEach(function (t) {
          t.classList.remove("is-active");
          t.setAttribute("aria-selected", "false");
        });
        btn.classList.add("is-active");
        btn.setAttribute("aria-selected", "true");
        renderPillar(pillar);
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

    renderPillar(PILLARS[0]);
  }
})();
