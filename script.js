// Detects if current device is mobile
function isMobileDevice() {
  return (
    typeof window.orientation !== "undefined" ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent)
  );
}

// Immediately set theme for initial loader display
(function setInitialThemeForLoader() {
  const html = document.documentElement;
  let theme = localStorage.getItem("theme");
  if (!theme) {
    theme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }
  html.classList.toggle("light-mode", theme === "light");
})();

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const canvas = document.getElementById("hero-canvas");

  // ========== MOBILE DETECTION ==========
  if (isMobileDevice()) {
    if (canvas) canvas.style.display = "none";
    body.classList.add("mobile");
  } else {
    initializeCanvas();
  }

  // ========== THEME: Detection, Initialization, Toggle ==========
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");

  function setBodyTheme(theme) {
    body.classList.toggle("light-mode", theme === "light");
    themeIcon.textContent = theme === "light" ? "🌙" : "☀️";
  }

  function detectSystemTheme() {
    if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      setBodyTheme("light");
    } else {
      setBodyTheme("dark");
    }
  }

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    setBodyTheme(savedTheme);
  } else {
    detectSystemTheme();
  }

  themeToggle.addEventListener("click", () => {
    const isLight = body.classList.toggle("light-mode");
    const theme = isLight ? "light" : "dark";
    localStorage.setItem("theme", theme);
    themeIcon.textContent = isLight ? "🌙" : "☀️";
  });

  // ========== TYPEWRITER EFFECT ==========
  const typewriterText = "Innovator in Video Editing, Game Development, Software, and Aerospace";
  const typewriterElement = document.querySelector(".typewriter");
  let charIndex = 0;
  function typeWriter() {
    if (charIndex < typewriterText.length) {
      typewriterElement.textContent += typewriterText.charAt(charIndex++);
      setTimeout(typeWriter, 100);
    }
  }
  typeWriter();

  // ========== SCROLL BLUR (Desktop Only) ==========
  if (!isMobileDevice() && canvas) {
    window.addEventListener("scroll", () => {
      const blurAmount = Math.min(window.scrollY / 100, 10);
      canvas.style.filter = `blur(${blurAmount}px)`;
    });
  }

  // ========== GSAP ANIMATIONS ==========
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from(".cta-btn", {
      opacity: 0,
      y: 50,
      duration: 1,
      delay: 1.5,
      onComplete: () => {
        document.querySelector(".cta-btn").style.visibility = "visible";
      }
    });

    gsap.from(".portfolio-section", {
      scrollTrigger: {
        trigger: ".portfolio-section",
        start: "top 80%",
      },
      opacity: 0,
      y: 50,
      duration: 1,
    });
  }

  // ========== CANVAS ANIMATION (Desktop Only) ==========
  function initializeCanvas() {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Dot {
      constructor(x, y) {
        this.x = x; this.y = y;
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

    const dots = Array.from({ length: 100 }, 
      () => new Dot(Math.random() * canvas.width, Math.random() * canvas.height));

    function drawLines() {
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
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
      dots.forEach(dot => { dot.update(); dot.draw(); });
      drawLines();
      requestAnimationFrame(animate);
    }

    animate();
  }

  // ========== DYNAMIC FOOTER YEAR ==========
  const yearElem = document.getElementById("current-year");
  if (yearElem) yearElem.textContent = new Date().getFullYear();

  // ========== BACK TO TOP ==========
  const backToTop = document.getElementById("back-to-top");
  if (backToTop) {
    window.addEventListener("scroll", () => {
      backToTop.style.display = window.scrollY > 300 ? "block" : "none";
    });
    backToTop.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" })
    );
  }

  // ========== MODAL FUNCTIONALITY ==========
  const modal = document.getElementById("modal");
  if (modal) {
    const modalContent = modal.querySelector(".modal-content");
    const modalClose = modal.querySelector(".modal-close");

    window.openModal = function (src, isVideo) {
      modalContent.innerHTML = '<div class="modal-loader">Loading...</div>';
      modal.style.display = "flex";
      modal.setAttribute("aria-hidden", "false");
      const element = isVideo ? document.createElement("iframe") : document.createElement("img");
      element.src = src;
      if (isVideo) {
        element.allowFullscreen = true;
        Object.assign(element.style, { width: "100%", height: "100%" });
      } else {
        Object.assign(element.style, {
          maxWidth: "90%",
          maxHeight: "90vh",
          objectFit: "contain"
        });
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

  // ========== CONTACT CANVAS EFFECT (Desktop Only) ==========
  if (!isMobileDevice()) {
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

      // Loader canvas animation inside contact (if present)
      loaderCanvasAesthetic();  // Only call if this function is not redefined elsewhere

      window.addEventListener("resize", resizeCanvas);
    }
  }

  // ========== LOADER CANVAS ANIMATION ==========
  function loaderCanvasAesthetic() {
    const canvas = document.getElementById('loader-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let t = 0;

    function getColor() {
      return body.classList.contains('light-mode') || document.documentElement.classList.contains('light-mode')
        ? '#111' : '#fff';
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const baseColor = getColor();
      const rings = 4;
      for (let i = 0; i < rings; i++) {
        const r = 40 + i * 18 + Math.sin((t + i) / 16) * 12;
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((t/70) * (i % 2 === 0 ? 1 : -1));
        ctx.strokeStyle = `rgba(${baseColor === '#fff' ? '255,255,255' : '17,17,17'},${0.34 + 0.12*i})`;
        ctx.lineWidth = 3 - i * 0.6;
        ctx.beginPath();
        for (let a = 0; a <= 2 * Math.PI; a += Math.PI / 60) {
          const offs = Math.sin(t/16 + a * 3 + i) * 7 + Math.sin((t + a * 95) / (24 + 6*i)) * 4;
          ctx.lineTo(
            Math.cos(a) * (r + offs),
            Math.sin(a) * (r + offs)
          );
        }
        ctx.closePath();
        ctx.shadowBlur = 10 - i * 2;
        ctx.shadowColor = baseColor;
        ctx.stroke();
        ctx.restore();
      }
      // Center pulse
      ctx.save();
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.arc(canvas.width/2, canvas.height/2, 12 + Math.sin(t/8)*3, 0, 2*Math.PI);
      ctx.fillStyle = baseColor;
      ctx.shadowBlur = 20;
      ctx.shadowColor = baseColor;
      ctx.fill();
      ctx.restore();

      t += 1;
      requestAnimationFrame(draw);
    }
    draw();
    // Update animation color if theme changes
    const observer = new MutationObserver(draw);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    observer.observe(body, { attributes: true, attributeFilter: ['class'] });
  }

  // Loader overlay fade out on load
  window.addEventListener('load', () => {
    const loaderOverlay = document.getElementById('loader-overlay');
    if (loaderOverlay) {
      loaderOverlay.style.opacity = '0';
      setTimeout(() => {
        loaderOverlay.style.display = 'none';
      }, 500);
    }
  });

});
