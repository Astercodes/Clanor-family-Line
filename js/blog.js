(function () {
  "use strict";

  if (typeof BLOG_POSTS === "undefined") return;

  var typeFiltersEl = document.getElementById("typeFilters");
  var pillarFiltersEl = document.getElementById("pillarFilters");
  var gridEl = document.getElementById("postGrid");
  var countEl = document.getElementById("postCount");
  var emptyEl = document.getElementById("emptyState");

  if (!gridEl) return;

  var TYPES = [];
  BLOG_POSTS.forEach(function (post) {
    if (TYPES.indexOf(post.type) === -1) TYPES.push(post.type);
  });

  var PILLARS_WITH_POSTS = [];
  var seen = {};
  BLOG_POSTS.forEach(function (post) {
    if (!seen[post.pillarName]) {
      seen[post.pillarName] = true;
      PILLARS_WITH_POSTS.push(post.pillarName);
    }
  });

  var state = { type: "all", pillar: "all" };

  function buildPills(container, values, stateKey) {
    var allBtn = document.createElement("button");
    allBtn.type = "button";
    allBtn.className = "filter-pill is-active";
    allBtn.textContent = "All";
    allBtn.dataset.value = "all";
    container.appendChild(allBtn);

    values.forEach(function (value) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "filter-pill";
      btn.textContent = value;
      btn.dataset.value = value;
      container.appendChild(btn);
    });

    container.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter-pill");
      if (!btn) return;
      container.querySelectorAll(".filter-pill").forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      state[stateKey] = btn.dataset.value;
      render();
    });
  }

  buildPills(typeFiltersEl, TYPES, "type");
  buildPills(pillarFiltersEl, PILLARS_WITH_POSTS, "pillar");

  var TYPE_KEY = { "Deep Dive": "deep-dive", "Reflection": "reflection", "Family Case Study": "case-study" };

  function matches(post) {
    if (state.type !== "all" && post.type !== state.type) return false;
    if (state.pillar !== "all" && post.pillarName !== state.pillar) return false;
    return true;
  }

  function cardHTML(post) {
    return (
      '<a class="subcategory-card resource-card post-card" href="' + post.link + '">' +
      '<div class="resource-tags">' +
      '<span class="post-type post-type-' + TYPE_KEY[post.type] + '">' + post.type + "</span>" +
      '<span class="resource-tag resource-tag-pillar">' + post.pillarName + "</span>" +
      '<span class="resource-tag resource-tag-audience">' + post.readMins + " min read</span>" +
      "</div>" +
      "<h4>" + post.title + "</h4>" +
      "<p>" + post.excerpt + "</p>" +
      '<span class="back-link back-link-light">Read the post &rarr;</span>' +
      "</a>"
    );
  }

  function render() {
    var filtered = BLOG_POSTS.filter(matches);
    gridEl.innerHTML = filtered.map(cardHTML).join("");
    countEl.textContent =
      "Showing " + filtered.length + " of " + BLOG_POSTS.length + (BLOG_POSTS.length === 1 ? " post" : " posts");
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
