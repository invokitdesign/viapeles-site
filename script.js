/* ============================================================
   VIAPELES — Premium behavior
   i18n · smooth scroll (Lenis) · custom cursor · magnetic ·
   parallax · tilt · masked/word reveals · counters · preloader
   ============================================================ */
(function () {
  "use strict";

  var WA_NUMBER = "351966023129"; // real WhatsApp number

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(pointer: fine)").matches;
  var touch = window.matchMedia("(pointer: coarse)").matches;

  /* ---------------------------------------------------------
     COPY (i18n source of truth)
  --------------------------------------------------------- */
  var COPY = {
    pt: {
      langSwitch: "EN",
      navAbout: "Sobre", navProducts: "Coleções", navContact: "Contacto",
      heroTitleA: "A matéria", heroTitleB1: "da", heroTitleB2: "elegância.",
      heroSub: "Selecionamos peles, couros e tecidos de eleição para estofadores. Matéria nobre, criteriosamente selecionada, pronta para o seu ofício.",
      heroCta: "Falar no WhatsApp",

      stmtA: "Se não encontra o que procura,", stmtEm: "veio ao sítio certo.",
      col0name: "Peles & Couros", col0desc: "Peles para estofos de alta durabilidade e toque nobre, em cores e acabamentos que resistem ao tempo e ao uso intenso.",
      col1name: "Tecidos", col1desc: "Tecidos automotivos e de revestimento, do clássico ao contemporâneo, testados para o dia a dia mais exigente.",
      col2name: "Complementos", col2desc: "Linhas, colas, espumas. Tudo o que dá suporte e acabamento a cada trabalho, num só fornecedor.",
      aboutTitle: "Uma casa dedicada ao ofício do estofo.",
      aboutBody1: "A VIAPELES trabalha com os melhores curtumes e fábricas têxteis. Cada pele e cada rolo passa pelas nossas mãos antes de chegar às suas, avaliados pela textura, resistência e beleza.",
      contactTitle: "Ofereça uma nova pele ao seu projeto.",
      labelPhone: "Telefone", labelEmail: "Email", labelAddress: "Morada",
      legalPrivacy: "Política de Privacidade", legalTerms: "Termos e Condições", legalComplaints: "Livro de Reclamações",
      footerTag: "Peles e tecidos para estofadores",
      footerMsg: "Enviar mensagem",
      waText: "Olá VIAPELES, gostaria de mais informações."
    },
    en: {
      langSwitch: "PT",
      navAbout: "About", navProducts: "Collections", navContact: "Contact",
      heroTitleA: "The matter", heroTitleB1: "of", heroTitleB2: "elegance.",
      heroSub: "We source select leathers and fabrics for upholsterers. Noble material, carefully selected, ready for your craft.",
      heroCta: "Chat on WhatsApp",

      stmtA: "Can't find what you're after?", stmtEm: "You've come to the right place.",
      col0name: "Leathers & Hides", col0desc: "Hides for high-durability upholstery with a noble feel, in colours and finishes that stand the test of time and heavy use.",
      col1name: "Fabrics", col1desc: "Automotive and covering fabrics, from classic to contemporary, tested for the most demanding everyday use.",
      col2name: "Supplies", col2desc: "Threads, glues, foams. Everything that supports and finishes every job, from a single supplier.",
      aboutTitle: "A house devoted to the craft of upholstery.",
      aboutBody1: "VIAPELES works with the finest tanneries and textile mills. Every hide and every roll passes through our hands before reaching yours, judged on texture, strength and beauty.",
      contactTitle: "Give your project a new skin.",
      labelPhone: "Phone", labelEmail: "Email", labelAddress: "Address",
      legalPrivacy: "Privacy Policy", legalTerms: "Terms & Conditions", legalComplaints: "Complaints Book",
      footerTag: "Leather and fabrics for upholsterers",
      footerMsg: "Send message",
      waText: "Hello VIAPELES, I'd like more information."
    }
  };

  /* ---------------------------------------------------------
     Language
  --------------------------------------------------------- */
  var stored = null;
  try { stored = localStorage.getItem("via-lang"); } catch (e) {}
  var lang = (stored === "pt" || stored === "en") ? stored : "pt";
  var toggle = document.getElementById("lang-toggle");

  // word-splitter for .reveal-lines (with single data-i18n + plain text)
  function splitWords(el, text) {
    el.textContent = "";
    var words = text.split(" ");
    words.forEach(function (w, i) {
      var word = document.createElement("span");
      word.className = "rl-word";
      var inner = document.createElement("span");
      inner.textContent = w;
      inner.style.transitionDelay = (i * 45) + "ms";
      word.appendChild(inner);
      el.appendChild(word);
      if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
    });
  }

  function applyLang(next) {
    lang = next;
    var t = COPY[lang];
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (t[key] == null) return;
      if (el.classList.contains("reveal-lines")) splitWords(el, t[key]);
      else el.textContent = t[key];
    });

    if (toggle) {
      toggle.textContent = t.langSwitch;
      toggle.setAttribute("aria-label", lang === "pt" ? "Switch to English" : "Mudar para Português");
    }
    var href = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(t.waText);
    document.querySelectorAll("[data-wa]").forEach(function (a) { a.href = href; });
    try { localStorage.setItem("via-lang", lang); } catch (e) {}
  }

  if (toggle) toggle.addEventListener("click", function () { applyLang(lang === "pt" ? "en" : "pt"); });
  applyLang(lang);

  /* ---------------------------------------------------------
     Sticky nav + scroll progress
  --------------------------------------------------------- */
  var nav = document.getElementById("via-nav");
  var progressBar = document.querySelector(".scroll-progress__bar");
  var navLogo = document.getElementById("via-nav-logo");
  var lastScrolled = null;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    var scrolled = y > 60;
    if (scrolled !== lastScrolled) {
      lastScrolled = scrolled;
      if (nav) nav.classList.toggle("is-scrolled", scrolled);
      if (navLogo) navLogo.src = scrolled ? "assets/viapeles-logo-dark.png" : "assets/viapeles-logo-light.png";
    }
    if (progressBar) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.transform = "scaleX(" + (h > 0 ? Math.min(1, y / h) : 0) + ")";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------------------------------------------------------
     Reveal (blocks + masked lines + word rise)
  --------------------------------------------------------- */
  function fireReveal(el) {
    el.classList.add("is-visible");
    el.querySelectorAll(".line-mask").forEach(function (m) { m.classList.add("is-revealed"); });
    el.querySelectorAll(".reveal-lines").forEach(function (r) { r.classList.add("is-visible"); });
  }

  var reveals = document.querySelectorAll("[data-reveal]");
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach(fireReveal);
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var d = parseInt(e.target.getAttribute("data-reveal-delay") || "0", 10);
        e.target.style.transitionDelay = d + "ms";
        fireReveal(e.target);
        io.unobserve(e.target);
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  }


  /* ---------------------------------------------------------
     Magnetic elements (desktop, pointer:fine only — never on mobile)
  --------------------------------------------------------- */
  if (fine && !reduce && !window.matchMedia("(max-width: 900px)").matches) {
    document.querySelectorAll("[data-magnetic]").forEach(function (el) {
      el.style.transition = "transform .4s cubic-bezier(.19,1,.22,1)";
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var x = e.clientX - (r.left + r.width / 2);
        var y = e.clientY - (r.top + r.height / 2);
        el.style.transform = "translate(" + (x * 0.25) + "px," + (y * 0.4) + "px)";
      });
      el.addEventListener("mouseleave", function () { el.style.transform = ""; });
    });

    /* Tilt on collection media */
    document.querySelectorAll("[data-tilt]").forEach(function (el) {
      el.style.transition = "transform .5s cubic-bezier(.19,1,.22,1), box-shadow .6s ease";
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = "perspective(1000px) rotateX(" + (-py * 4) + "deg) rotateY(" + (px * 4) + "deg)";
      });
      el.addEventListener("mouseleave", function () {
        el.style.transform = "perspective(1000px) rotateX(0) rotateY(0)";
      });
    });
  }

  /* ---------------------------------------------------------
     Parallax (rAF, disabled on reduced motion)
  --------------------------------------------------------- */
  var parallaxEls = [].slice.call(document.querySelectorAll("[data-parallax]"));
  if (parallaxEls.length && !reduce) {
    var pRAF = function () {
      var vh = window.innerHeight;
      for (var i = 0; i < parallaxEls.length; i++) {
        var el = parallaxEls[i];
        var r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) continue;
        var speed = parseFloat(el.dataset.parallax) || 0.1;
        var y = (r.top + r.height / 2 - vh / 2) * -speed;
        el.style.transform = "translate3d(0," + y.toFixed(2) + "px,0)";
      }
      requestAnimationFrame(pRAF);
    };
    requestAnimationFrame(pRAF);
  }

  /* Smooth scrolling is handled natively via CSS `scroll-behavior: smooth`
     + `scroll-margin-top` on the anchored sections. A JS smooth-scroll
     library (Lenis) was removed: loaded from a CDN, it intermittently
     locked the page scroll at 0 ("can't navigate"). Native scroll is
     reliable and the reel scroll-jack / parallax read window.scrollY. */

  /* ---------------------------------------------------------
     Collections reel — horizontal unroll. The section is pinned
     and the strip slides sideways as you scroll vertically, on
     every screen size. (Safe on touch now: the earlier scroll
     lock was caused by Lenis, which has been removed.)
  --------------------------------------------------------- */
  (function initReel() {
    var track = document.getElementById("reel-track");
    if (!track) return;
    var viewport = document.getElementById("reel-viewport");
    var strip = document.getElementById("reel-strip");
    var rail = document.getElementById("reel-rail");
    var panels = [].slice.call(document.querySelectorAll(".reel__panel"));
    var tabs = [].slice.call(document.querySelectorAll(".reel__tab"));
    var N = panels.length;
    var active = -1;

    function metrics() {
      var tr = track.getBoundingClientRect();
      // maxX from real panel positions (centre-mode) — avoids the scrollWidth
      // quirk where trailing padding is not counted, so the last panel centres.
      var mx = N > 1 ? (panels[N - 1].offsetLeft - panels[0].offsetLeft) : 0;
      return {
        top: tr.top + (window.scrollY || window.pageYOffset),
        h: track.offsetHeight,
        maxX: Math.max(0, mx)
      };
    }
    function setActive(i) {
      if (i === active) return;
      active = i;
      for (var k = 0; k < N; k++) if (tabs[k]) tabs[k].classList.toggle("is-active", k === i);
    }
    function smooth(t) { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); }
    function nearestToCenter() {
      var vp = viewport.getBoundingClientRect();
      var cx = vp.left + vp.width / 2, best = 0, bd = Infinity;
      for (var k = 0; k < N; k++) {
        var r = panels[k].getBoundingClientRect();
        var d = Math.abs((r.left + r.width / 2) - cx);
        if (d < bd) { bd = d; best = k; }
      }
      return best;
    }
    // 3D depth on the images + entrance animation on the captions,
    // both driven by each panel's distance from the viewport centre.
    function applyFx(is3D) {
      var vp = viewport.getBoundingClientRect();
      var vw = vp.width, cx = vp.left + vw / 2;
      for (var k = 0; k < N; k++) {
        var r = panels[k].getBoundingClientRect();
        var off = ((r.left + r.width / 2) - cx) / vw;      // ~ -1..1
        var absoff = Math.abs(off);
        var media = panels[k].querySelector(".reel__media");
        var img = panels[k].querySelector("img");
        var cap = panels[k].querySelector(".reel__caption");
        if (reduce) {
          if (media) media.style.transform = "";
          if (img) img.style.transform = "";
          panels[k].classList.add("is-revealed");
          continue;
        }
        var focus = smooth(1 - Math.min(absoff / 0.55, 1));
        if (is3D && media) {
          media.style.transform = "perspective(1600px) rotateY(" + (off * -9).toFixed(2) + "deg) scale(" + (1 - Math.min(absoff, 1) * 0.09).toFixed(3) + ")";
        } else {
          if (media) media.style.transform = "";
          if (img) img.style.transform = "";
        }
        // caption reveals once (CSS-transition entrance) when the panel is centred
        // AND actually within the viewport, then stays — no exit animation
        if (focus >= 0.5) {
          var vc = r.top + r.height / 2;
          if (vc > 0 && vc < window.innerHeight) panels[k].classList.add("is-revealed");
        }
      }
    }
    function update() {
      var vh = window.innerHeight, m = metrics();
      var denom = m.h - vh;
      var p = denom > 0 ? (((window.scrollY || window.pageYOffset) - m.top) / denom) : 0;
      p = Math.max(0, Math.min(1, p));
      strip.style.transform = "translate3d(" + (-p * m.maxX).toFixed(2) + "px,0,0)";
      if (rail) rail.style.transform = "scaleX(" + p.toFixed(4) + ")";
      applyFx(true);
      setActive(nearestToCenter());
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("load", update);
    window.addEventListener("resize", update);

    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () {
        var m = metrics(), vh = window.innerHeight;
        var target = m.top + (N > 1 ? i / (N - 1) : 0) * (m.h - vh);
        window.scrollTo({ top: target, behavior: "smooth" });
      });
    });
  })();

  /* ---------------------------------------------------------
     Preloader → reveal hero
  --------------------------------------------------------- */
  var preloader = document.getElementById("preloader");
  function launch() {
    document.body.classList.add("is-ready");
    document.body.classList.remove("is-loading");
  }
  if (!preloader || reduce) {
    if (preloader) preloader.style.display = "none";
    launch();
  } else {
    document.body.classList.add("is-loading");
    var fill = document.getElementById("preloader-fill");
    var count = document.getElementById("preloader-count");
    var dur = 1300, start = performance.now();
    (function tickPre(now) {
      var p = Math.min(1, (now - start) / dur);
      var e = 1 - Math.pow(1 - p, 2);
      if (fill) fill.style.width = (e * 100) + "%";
      if (count) count.textContent = (e * 100 < 10 ? "0" : "") + Math.round(e * 100);
      if (p < 1) { requestAnimationFrame(tickPre); }
      else {
        preloader.classList.add("is-done");
        launch();
        setTimeout(function () { if (preloader && preloader.parentNode) preloader.parentNode.removeChild(preloader); }, 1400);
      }
    })(start);
  }
})();
