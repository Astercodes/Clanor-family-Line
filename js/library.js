(function () {
  "use strict";

  if (typeof RESOURCES === "undefined" || typeof PILLAR_LIST === "undefined") return;

  var PHASES = [
    { key: "create", label: "Create" },
    { key: "nourish", label: "Nourish" },
    { key: "sustain", label: "Sustain" },
    { key: "build", label: "Build" }
  ];

  var AUDIENCES = [
    { key: "individual", label: "Individual" },
    { key: "couple", label: "Couple" },
    { key: "parent", label: "Parent" },
    { key: "single", label: "Single" },
    { key: "child", label: "Child" }
  ];

  var AGE_GROUPS = [
    { key: "toddler", label: "Toddler" },
    { key: "tween", label: "Tween" },
    { key: "teen", label: "Teens" },
    { key: "youth", label: "Youth" }
  ];

  var state = { pillar: "all", phase: "all", audience: "all", ageGroup: "all" };

  var pillarFiltersEl = document.getElementById("pillarFilters");
  var phaseFiltersEl = document.getElementById("phaseFilters");
  var audienceFiltersEl = document.getElementById("audienceFilters");
  var ageGroupSectionEl = document.getElementById("ageGroupFilterGroup");
  var ageGroupFiltersEl = document.getElementById("ageGroupFilters");
  var gridEl = document.getElementById("resourceGrid");
  var countEl = document.getElementById("resourceCount");
  var emptyEl = document.getElementById("emptyState");

  function buildPills(container, items, stateKey, onChange) {
    var allBtn = document.createElement("button");
    allBtn.type = "button";
    allBtn.className = "filter-pill is-active";
    allBtn.textContent = "All";
    allBtn.dataset.value = "all";
    container.appendChild(allBtn);

    items.forEach(function (item) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "filter-pill";
      btn.textContent = item.label;
      btn.dataset.value = item.value;
      container.appendChild(btn);
    });

    container.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter-pill");
      if (!btn) return;
      container.querySelectorAll(".filter-pill").forEach(function (b) {
        b.classList.remove("is-active");
      });
      btn.classList.add("is-active");
      state[stateKey] = btn.dataset.value;
      if (onChange) onChange(state[stateKey]);
      render();
    });
  }

  buildPills(
    pillarFiltersEl,
    PILLAR_LIST.map(function (p) { return { label: p.name, value: p.slug }; }),
    "pillar"
  );
  buildPills(
    phaseFiltersEl,
    PHASES.map(function (p) { return { label: p.label, value: p.key }; }),
    "phase"
  );
  buildPills(
    audienceFiltersEl,
    AUDIENCES.map(function (a) { return { label: a.label, value: a.key }; }),
    "audience",
    function (value) {
      state.ageGroup = "all";
      if (ageGroupFiltersEl) {
        ageGroupFiltersEl.querySelectorAll(".filter-pill").forEach(function (b) {
          b.classList.toggle("is-active", b.dataset.value === "all");
        });
      }
      if (ageGroupSectionEl) ageGroupSectionEl.hidden = value !== "child";
    }
  );
  if (ageGroupFiltersEl) {
    buildPills(
      ageGroupFiltersEl,
      AGE_GROUPS.map(function (a) { return { label: a.label, value: a.key }; }),
      "ageGroup"
    );
  }

  function matches(resource) {
    if (state.pillar !== "all" && resource.pillarSlug !== state.pillar) return false;
    if (state.phase !== "all" && resource.phase !== state.phase) return false;
    if (state.audience !== "all" && resource.audience.indexOf(state.audience) === -1) return false;
    if (state.audience === "child" && state.ageGroup !== "all") {
      var ageGroups = resource.ageGroups || [];
      if (ageGroups.indexOf(state.ageGroup) === -1) return false;
    }
    return true;
  }

  function cardHTML(resource) {
    var audienceTags = resource.audience
      .map(function (a) { return '<span class="resource-tag resource-tag-audience">' + a + "</span>"; })
      .join("");
    var ageTags = (resource.ageGroups || [])
      .map(function (a) { return '<span class="resource-tag resource-tag-age">' + a + "</span>"; })
      .join("");
    return (
      '<div class="subcategory-card resource-card">' +
      '<div class="resource-tags">' +
      '<span class="resource-tag resource-tag-pillar">' + resource.pillarName + "</span>" +
      '<span class="resource-tag resource-tag-phase resource-tag-phase-' + resource.phase + '">' + resource.phase + "</span>" +
      audienceTags +
      ageTags +
      "</div>" +
      "<h4>" + resource.name + "</h4>" +
      "<p>" + resource.description + "</p>" +
      '<div class="download-options">' +
      '<span class="download-btn download-btn-soon"><span class="download-btn-label">App</span><span class="download-btn-status">Coming Soon</span></span>' +
      '<span class="download-btn download-btn-soon"><span class="download-btn-label">Digital PDF</span><span class="download-btn-status">Coming Soon</span></span>' +
      "</div>" +
      '<a href="' + resource.link + '" class="back-link back-link-light resource-view-link">View on the ' + resource.pillarName + " pillar &rarr;</a>" +
      "</div>"
    );
  }

  function render() {
    var filtered = RESOURCES.filter(matches);
    gridEl.innerHTML = filtered.map(cardHTML).join("");
    countEl.textContent =
      "Showing " + filtered.length + " of " + RESOURCES.length + (RESOURCES.length === 1 ? " resource" : " resources");
    emptyEl.hidden = filtered.length !== 0;
    gridEl.hidden = filtered.length === 0;

    if ("IntersectionObserver" in window && gridEl.classList.contains("stagger")) {
      gridEl.classList.remove("is-visible");
      void gridEl.offsetWidth;
      gridEl.classList.add("is-visible");
    }
  }

  render();
})();
