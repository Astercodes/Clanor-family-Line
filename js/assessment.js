(function () {
  "use strict";

  if (typeof PILLAR_LIST === "undefined") return;

  var appEl = document.getElementById("assessmentCard");
  if (!appEl) return;

  var LEVELS = [
    { value: 1, key: "starving", label: "Starving" },
    { value: 2, key: "struggling", label: "Struggling" },
    { value: 3, key: "growing", label: "Growing" },
    { value: 4, key: "thriving", label: "Thriving" }
  ];

  var QUESTIONS = [
    {
      slug: "spiritual",
      name: "Spiritual",
      question: "How would you describe your family's spiritual life right now?",
      options: [
        "There is little to no shared prayer or spiritual practice.",
        "We pray or engage the Word occasionally, but it is inconsistent.",
        "We have a spiritual rhythm, but it is not fully embedded yet.",
        "Prayer, worship and spiritual identity are woven into daily life."
      ]
    },
    {
      slug: "soul-emotional",
      name: "Soul / Emotional",
      question: "How safe is it for people in your family to be fully known?",
      options: [
        "Feelings are rarely discussed or acknowledged.",
        "Some conversations happen, but many things stay hidden.",
        "Most people feel safe to open up, most of the time.",
        "Everyone in the family has space to be fully known and affirmed."
      ]
    },
    {
      slug: "mental-intellectual",
      name: "Mental / Intellectual",
      question: "How intentional is your family about learning and wisdom?",
      options: [
        "Learning is left entirely to school or chance.",
        "We value it, but there is no real structure around it.",
        "We have some learning rhythms in place.",
        "Wisdom and learning are actively cultivated across generations."
      ]
    },
    {
      slug: "physical",
      name: "Physical",
      question: "How would you rate your family's physical health rhythms?",
      options: [
        "Rest, food and health are an afterthought.",
        "We try, but consistency is a real struggle.",
        "We have decent rhythms most of the time.",
        "Health, rest and provision are consistently well cared for."
      ]
    },
    {
      slug: "financial-resources",
      name: "Financial / Resources",
      question: "Where is your family financially?",
      options: [
        "There is no plan, and resources are a constant source of stress.",
        "We are managing, but there is no real stewardship system.",
        "We are building toward stability and intentional giving.",
        "We steward, multiply and give with real intention."
      ]
    },
    {
      slug: "legacy-generational",
      name: "Legacy / Generational",
      question: "How well is your family's story being passed down?",
      options: [
        "Almost nothing is documented or told.",
        "Stories exist but are rarely shared intentionally.",
        "We are starting to document and pass things down.",
        "Our story, testimonies and legacy are actively preserved."
      ]
    },
    {
      slug: "healing-restoration",
      name: "Healing / Restoration",
      question: "How does your family handle brokenness and pain?",
      options: [
        "Pain is buried or ignored until it becomes a crisis.",
        "We acknowledge it but rarely walk through it fully.",
        "We are actively working through healing, even if slowly.",
        "There is real freedom, and healing is walked all the way through."
      ]
    },
    {
      slug: "community-connection",
      name: "Community / Connection",
      question: "How connected is your family across distance and season?",
      options: [
        "We rarely gather or stay in touch.",
        "We connect occasionally, but it takes real effort.",
        "We have some regular rhythms of gathering and presence.",
        "Presence and connection are a consistent, joyful rhythm."
      ]
    },
    {
      slug: "career-vocation",
      name: "Career / Vocation",
      question: "How clear is your family on calling and vocation?",
      options: [
        "Careers feel random, just a means of income.",
        "Some clarity exists, but little mentorship or support.",
        "People are discovering their gifts with some support.",
        "Vocation is actively discerned, mentored and celebrated."
      ]
    },
    {
      slug: "marriage",
      name: "Marriage",
      question: "If applicable, how would you describe the marriages in your family?",
      options: [
        "Marriages are surviving, not thriving, with little real investment.",
        "There is love, but little consistent investment.",
        "Marriages are being intentionally invested in.",
        "Marriages are covenant partnerships, warring together well."
      ]
    },
    {
      slug: "relationships",
      name: "Relationships",
      question: "How is dating, courtship or the wider social circle being approached?",
      options: [
        "This is navigated with little wisdom or guidance.",
        "There is some awareness, but not much structure.",
        "There is growing discernment and intentionality.",
        "Dating, courtship and friendships are approached with real wisdom."
      ]
    },
    {
      slug: "nation-building",
      name: "Nation Building",
      question: "How is your family engaging the wider world?",
      options: [
        "There is little to no outward influence or engagement.",
        "There is a desire, but little actual involvement.",
        "The family is starting to show up in public life and service.",
        "The family is actively shaping institutions and society."
      ]
    }
  ];

  var state = { step: "intro", index: 0, answers: {} };

  function pillarLookup(slug) {
    for (var i = 0; i < PILLAR_LIST.length; i++) {
      if (PILLAR_LIST[i].slug === slug) return PILLAR_LIST[i];
    }
    return null;
  }

  function render() {
    if (state.step === "intro") renderIntro();
    else if (state.step === "quiz") renderQuiz();
    else renderResults();
  }

  function renderIntro() {
    appEl.innerHTML =
      '<div class="assessment-intro">' +
      '<p class="assessment-meta">Twelve questions. About three minutes. Results appear instantly, right here.</p>' +
      '<button type="button" class="btn btn-primary" id="startBtn"><span>Start the Assessment</span></button>' +
      "</div>";
    document.getElementById("startBtn").addEventListener("click", function () {
      state.step = "quiz";
      state.index = 0;
      render();
    });
  }

  function renderQuiz() {
    var q = QUESTIONS[state.index];
    var progressPct = Math.round((state.index / QUESTIONS.length) * 100);
    var selected = state.answers[q.slug];

    var optionsHTML = q.options
      .map(function (text, i) {
        var value = i + 1;
        var isSelected = selected === value;
        return (
          '<button type="button" class="assessment-option' +
          (isSelected ? " is-selected" : "") +
          '" data-value="' +
          value +
          '">' +
          '<span class="assessment-option-level">' + LEVELS[i].label + "</span>" +
          '<span class="assessment-option-text">' + text + "</span>" +
          "</button>"
        );
      })
      .join("");

    appEl.innerHTML =
      '<div class="assessment-progress-track"><div class="assessment-progress-fill" style="width:' +
      progressPct +
      '%;"></div></div>' +
      '<p class="assessment-step-label">Pillar ' +
      (state.index + 1) +
      " of " +
      QUESTIONS.length +
      " &middot; " +
      q.name +
      "</p>" +
      '<h3 class="assessment-question">' + q.question + "</h3>" +
      '<div class="assessment-options">' + optionsHTML + "</div>" +
      '<div class="assessment-nav">' +
      (state.index > 0 ? '<button type="button" class="back-link back-link-light" id="backBtn">&larr; Back</button>' : "<span></span>") +
      "</div>";

    appEl.querySelectorAll(".assessment-option").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.answers[q.slug] = parseInt(btn.dataset.value, 10);
        window.setTimeout(function () {
          if (state.index < QUESTIONS.length - 1) {
            state.index += 1;
            render();
          } else {
            state.step = "results";
            render();
          }
        }, 280);
        appEl.querySelectorAll(".assessment-option").forEach(function (b) { b.classList.remove("is-selected"); });
        btn.classList.add("is-selected");
      });
    });

    var backBtn = document.getElementById("backBtn");
    if (backBtn) {
      backBtn.addEventListener("click", function () {
        state.index -= 1;
        render();
      });
    }
  }

  function renderResults() {
    var counts = { 1: 0, 2: 0, 3: 0, 4: 0 };
    var scored = QUESTIONS.map(function (q) {
      var value = state.answers[q.slug] || 3;
      counts[value] += 1;
      return { slug: q.slug, name: q.name, value: value, level: LEVELS[value - 1] };
    });

    var sorted = scored.slice().sort(function (a, b) { return a.value - b.value; });
    var lowestValue = sorted[0].value;
    var recommendations = sorted.filter(function (r) { return r.value === lowestValue; }).slice(0, 3);
    if (recommendations.length < 2) {
      recommendations = sorted.slice(0, 3);
    }

    var summary =
      "Your family line is thriving in " + counts[4] + ", growing in " + counts[3] +
      ", struggling in " + counts[2] + ", and starving in " + counts[1] +
      (counts[1] === 1 ? " pillar." : " pillars.");

    var cardsHTML = scored
      .map(function (r) {
        var pillar = pillarLookup(r.slug);
        var href = pillar ? "pillars/" + pillar.slug + ".html" : "#";
        return (
          '<a class="pillar-card assessment-result-card assessment-result-' +
          r.level.key +
          '" href="' +
          href +
          '">' +
          '<span class="pillar-card-status assessment-result-badge">' + r.level.label + "</span>" +
          "<h3>" + r.name + "</h3>" +
          '<span class="pillar-card-arrow" aria-hidden="true">&rarr;</span>' +
          "</a>"
        );
      })
      .join("");

    var recHTML = recommendations
      .map(function (r) {
        var pillar = pillarLookup(r.slug);
        var href = pillar ? "pillars/" + pillar.slug + ".html" : "#";
        return (
          '<a class="download-btn assessment-rec-link" href="' + href + '">' +
          '<span class="download-btn-label">' + r.name + "</span>" +
          '<span class="download-btn-status">' + r.level.label + "</span>" +
          "</a>"
        );
      })
      .join("");

    appEl.innerHTML =
      '<p class="assessment-step-label">Your results</p>' +
      '<p class="assessment-summary">' + summary + "</p>" +
      '<div class="assessment-recommend">' +
      '<p class="assessment-recommend-label">Where to start</p>' +
      '<div class="assessment-recommend-links">' + recHTML + "</div>" +
      "</div>" +
      '<div class="assessment-results-grid">' + cardsHTML + "</div>" +
      '<div class="assessment-nav assessment-nav-results">' +
      '<button type="button" class="back-link back-link-light" id="retakeBtn">&larr; Retake the assessment</button>' +
      '<a href="library.html" class="back-link back-link-light">Browse the library &rarr;</a>' +
      "</div>";

    document.getElementById("retakeBtn").addEventListener("click", function () {
      state.step = "intro";
      state.index = 0;
      state.answers = {};
      render();
    });
  }

  render();
})();
