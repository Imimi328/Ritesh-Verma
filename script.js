document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const navLinks = document.querySelector(".nav-links");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuToggle = document.getElementById("menu-toggle");
  const themeToggle = document.getElementById("theme-toggle");
  const themeToggleMobile = document.getElementById("theme-toggle-mobile");
  const themeIcon = document.getElementById("theme-icon");
  const backToTop = document.getElementById("back-to-top");
  const modal = document.getElementById("modal");
  const modalContent = modal.querySelector(".modal-content");
  const modalClose = modal.querySelector(".modal-close");

  // === Theme Logic ===
  function applyTheme(theme) {
    const isLight = theme === "light";
    body.classList.toggle("light-mode", isLight);
    if (themeIcon) themeIcon.textContent = isLight ? "🌙" : "☀️";
    if (themeToggleMobile) themeToggleMobile.querySelector(".theme-icon").textContent = isLight ? "🌙" : "☀️";
    localStorage.setItem("theme", theme);
  }
  let savedTheme = localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  applyTheme(savedTheme);

  [themeToggle, themeToggleMobile].forEach(btn => {
    if(btn) btn.addEventListener("click", () => applyTheme(body.classList.contains("light-mode") ? "dark" : "light"));
  });

  // === Mobile Menu ===
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      const isHidden = mobileMenu.hasAttribute("hidden");
      mobileMenu.toggleAttribute("hidden", !isHidden);
      body.classList.toggle("nav-open", isHidden);
    });
    mobileMenu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
       mobileMenu.setAttribute("hidden", ""); body.classList.remove("nav-open");
    }));
  }

  // === Typewriter ===
  const texts = "Innovator in Video Editing, Game Development, Software, and Aerospace";
  const typeEl = document.querySelector(".typewriter");
  let i = 0;
  if (typeEl) {
    function type() { if(i < texts.length) { typeEl.textContent += texts.charAt(i++); setTimeout(type, 100); } }
    type();
  }

  // === Modal ===
  window.openModal = function(src, isVideo) {
    modalContent.innerHTML = "";
    modal.style.display = "flex";
    const el = isVideo ? document.createElement("iframe") : document.createElement("img");
    el.src = src;
    if(isVideo) { el.allowFullscreen = true; el.style.width="100%"; el.style.height="500px"; el.style.border="none"; }
    else { el.style.maxWidth="100%"; el.style.maxHeight="90vh"; el.style.display="block"; el.style.margin="0 auto"; }
    modalContent.appendChild(el);
  };
  modalClose.addEventListener("click", () => modal.style.display = "none");
  modal.addEventListener("click", e => { if(e.target === modal) modal.style.display = "none"; });

  // === Back to Top & Footer Year ===
  document.getElementById("current-year").textContent = new Date().getFullYear();
  window.addEventListener("scroll", () => backToTop.style.display = window.scrollY > 300 ? "block" : "none");
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // === Canvas Animations (Simple Particle System) ===
  const canvas = document.getElementById("hero-canvas");
  const ctx = canvas ? canvas.getContext("2d") : null;
  if (ctx && window.innerWidth > 980) {
    let w, h;
    const resize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize); resize();
    
    const particles = Array.from({length: 60}, () => ({
      x: Math.random()*w, y: Math.random()*h, vx: (Math.random()-0.5), vy: (Math.random()-0.5), r: Math.random()*2+1
    }));
    
    function animate() {
      ctx.clearRect(0,0,w,h);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if(p.x < 0 || p.x > w) p.vx *= -1; if(p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fillStyle = body.classList.contains("light-mode") ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)";
        ctx.fill();
      });
      requestAnimationFrame(animate);
    }
    animate();
  }
});