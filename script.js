// Detects if current device is mobile (for features like scroll blur, canvas animation, etc.)
function isMobileDevice() {
  return (
    typeof window.orientation !== "undefined" ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent)
  );
}

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const navLinks = document.querySelector(".nav-links");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuToggle = document.getElementById("menu-toggle");
  const themeToggle = document.getElementById("theme-toggle");
  const themeToggleMobile = document.getElementById("theme-toggle-mobile");
  const themeIcon = document.getElementById("theme-icon");
  const yearElem = document.getElementById("current-year");
  const backToTop = document.getElementById("back-to-top");
  const canvas = document.getElementById("hero-canvas");
  const mq = window.matchMedia("(max-width: 980px)");

  // ======= THEME SETUP =======
  function applyTheme(theme) {
    const isLight = theme === "light";
    body.classList.toggle("light-mode", isLight);
    if (themeIcon) themeIcon.textContent = isLight ? "🌙" : "☀️";
    if (themeToggleMobile) {
      const mobileIcon = themeToggleMobile.querySelector(".theme-icon");
      if (mobileIcon) mobileIcon.textContent = isLight ? "🌙" : "☀️";
      themeToggleMobile.setAttribute("aria-pressed", String(isLight));
    }
    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", String(isLight));
    }
    localStorage.setItem("theme", theme);
  }

  // Initialize theme
  let savedTheme = localStorage.getItem("theme");
  if (!savedTheme) {
    savedTheme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }
  applyTheme(savedTheme);

  // Bind theme toggles
  [themeToggle, themeToggleMobile].forEach(btn => {
    if (!btn) return;
    btn.addEventListener("click", () => {
      const isLight = body.classList.contains("light-mode");
      applyTheme(isLight ? "dark" : "light");
    });
  });

  // ======= MENU DISPLAY BASED ON SCREEN SIZE =======
  function updateMenuDisplay() {
    if (mq.matches) {
      navLinks.style.display = "none";
      if (menuToggle) menuToggle.style.display = "inline-block";
    } else {
      navLinks.style.display = "flex";
      if (menuToggle) menuToggle.style.display = "none";
      if (mobileMenu) {
        mobileMenu.setAttribute("hidden", "");
      }
      body.classList.remove("nav-open");
      if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
    }
  }
  updateMenuDisplay();
  mq.addEventListener("change", updateMenuDisplay);

  // ======= MOBILE MENU FUNCTIONALITY =======
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      const isHidden = mobileMenu.hasAttribute("hidden");
      mobileMenu.toggleAttribute("hidden", !isHidden);
      menuToggle.setAttribute("aria-expanded", String(isHidden));
      body.classList.toggle("nav-open", isHidden);
    });

    document.addEventListener("click", e => {
      if (mobileMenu.hasAttribute("hidden")) return;
      const within = mobileMenu.contains(e.target) || menuToggle.contains(e.target);
      if (!within) {
        mobileMenu.setAttribute("hidden", "");
        menuToggle.setAttribute("aria-expanded", "false");
        body.classList.remove("nav-open");
      }
    });

    document.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        mobileMenu.setAttribute("hidden", "");
        menuToggle.setAttribute("aria-expanded", "false");
        body.classList.remove("nav-open");
      }
    });
  }

  // ======= TYPEWRITER EFFECT =======
  const typewriterText = "Innovator in Video Editing, Game Development, Software, and Aerospace";
  const typewriterElement = document.querySelector(".typewriter");
  let charIndex = 0;
  function typeWriter() {
    if (!typewriterElement) return;
    if (charIndex < typewriterText.length) {
      typewriterElement.textContent += typewriterText.charAt(charIndex++);
      setTimeout(typeWriter, 100);
    }
  }
  typeWriter();

  // ======= SCROLL BLUR (Desktop Only) =======
  if (!mq.matches && canvas) {
    window.addEventListener("scroll", () => {
      const blurAmount = Math.min(window.scrollY / 100, 10);
      canvas.style.filter = `blur(${blurAmount}px)`;
    }, { passive: true });
  }

  // ======= CANVAS ANIMATION (Desktop Only) =======
  function initializeCanvas() {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    class Dot {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = Math.random() * 2 - 1;
        this.vy = Math.random() * 2 - 1;
        this.radius = Math.random() * 2 + 1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = body.classList.contains("light-mode") ? "#000" : "#fff";
        ctx.fill();
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
    }

    const dots = Array.from({ length: 100 }, () => new Dot(Math.random()*canvas.width, Math.random()*canvas.height));

    function drawLines() {
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = body.classList.contains("light-mode") ? "#000" : "#fff";
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach(d => { d.update(); d.draw(); });
      drawLines();
      requestAnimationFrame(animate);
    }
    animate();
  }

  if (!mq.matches) {
    initializeCanvas();
  }

  // ======= DYNAMIC FOOTER YEAR =======
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }

  // ======= BACK TO TOP =======
  if (backToTop) {
    window.addEventListener("scroll", () => {
      backToTop.style.display = window.scrollY > 300 ? "block" : "none";
    }, { passive: true });

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // helper: instant tap on touch + click fallback
function bindInstantTap(el, handler) {
  if (!el) return;
  // pointerdown gives immediate response on touch; prevent default to avoid duplicate click
  el.addEventListener('pointerdown', (e) => { e.preventDefault(); handler(e); }, { passive: false });
  // fallback for non-pointer environments (older browsers/desktops)
  el.addEventListener('click', (e) => { e.preventDefault(); handler(e); });
}

// ======= THEME TOGGLES (replace your existing click bindings) =======
[themeToggle, themeToggleMobile].forEach(btn => {
  if (!btn) return;
  bindInstantTap(btn, () => {
    const isLight = body.classList.contains("light-mode");
    applyTheme(isLight ? "dark" : "light");
  });
});

// ======= MOBILE MENU (augment your existing block) =======
if (menuToggle && mobileMenu) {
  // replace menuToggle.addEventListener("click", ...) with:
  bindInstantTap(menuToggle, () => {
    const isHidden = mobileMenu.hasAttribute("hidden");
    mobileMenu.toggleAttribute("hidden", !isHidden);
    menuToggle.setAttribute("aria-expanded", String(isHidden));
    body.classList.toggle("nav-open", isHidden);
  });

  // close when any link inside the mobile panel is tapped
  mobileMenu.querySelectorAll('a').forEach(a => {
    bindInstantTap(a, () => {
      mobileMenu.setAttribute("hidden", "");
      menuToggle.setAttribute("aria-expanded", "false");
      body.classList.remove("nav-open");
    });
  });
}


  // ======= MODAL FUNCTIONALITY =======
  const modal = document.getElementById("modal");
  if (modal) {
    const modalContent = modal.querySelector(".modal-content");
    const modalClose = modal.querySelector(".modal-close");

    window.openModal = function(src, isVideo) {
      modalContent.innerHTML = "";
      modal.style.display = "flex";
      modal.setAttribute("aria-hidden", "false");
      const element = isVideo ? document.createElement("iframe") : document.createElement("img");
      element.src = src;
      if (isVideo) {
        element.allowFullscreen = true;
        Object.assign(element.style, { width: "100%", height: "100%" });
      } else {
        Object.assign(element.style, { maxWidth: "90%", maxHeight: "90vh", objectFit: "contain" });
      }
      element.onload = () => {
        modalContent.innerHTML = "";
        modalContent.appendChild(element);
      };
    };

    modalClose.addEventListener("click", () => {
      modal.style.display = "none";
      modal.setAttribute("aria-hidden", "true");
    });

    modal.addEventListener("click", e => {
      if (e.target === modal) {
        modal.style.display = "none";
        modal.setAttribute("aria-hidden", "true");
      }
    });
  }

  // ======= CONTACT CANVAS EFFECT (Desktop Only) =======
  if (!mq.matches) {
    const contactCanvas = document.getElementById("contact-canvas");
    if (contactCanvas) {
      const ctx = contactCanvas.getContext("2d");
      function resizeCanvas() {
        contactCanvas.width = contactCanvas.offsetWidth;
        contactCanvas.height = contactCanvas.offsetHeight;
      }
      resizeCanvas();

      class Particle {
        constructor() {
          this.x = Math.random() * contactCanvas.width;
          this.y = Math.random() * contactCanvas.height;
          this.vx = (Math.random() - 0.5) * 2;
          this.vy = (Math.random() - 0.5) * 2;
          this.radius = Math.random() * 2 + 1;
        }
        draw() {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
          ctx.fillStyle = body.classList.contains("light-mode")
            ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)";
          ctx.fill();
        }
        update() {
          this.x += this.vx;
          this.y += this.vy;
          if (this.x < 0 || this.x > contactCanvas.width) this.vx *= -1;
          if (this.y < 0 || this.y > contactCanvas.height) this.vy *= -1;
        }
      }

      const particles = Array.from({ length: 50 }, () => new Particle());
      function animateParticles() {
        ctx.clearRect(0, 0, contactCanvas.width, contactCanvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateParticles);
      }
      animateParticles();
      window.addEventListener("resize", resizeCanvas);
    }
  }
});
