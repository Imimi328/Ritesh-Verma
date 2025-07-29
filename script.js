// Mobile detection function
function isMobileDevice() {
  return (
    typeof window.orientation !== "undefined" ||
    navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i)
  );
}

document.addEventListener("DOMContentLoaded", () => {
  // ========== MOBILE DETECTION FIRST ========== //
  const canvas = document.getElementById("hero-canvas");
  const body = document.body;

  if (isMobileDevice()) {
    if (canvas) canvas.style.display = "none"; // Disable canvas on mobile
    document.body.classList.add("mobile"); // Add mobile class for CSS
  } else {
    // Initialize canvas-related features only if NOT on mobile
    initializeCanvas();
  }

  // ========== THEME DETECTION & TOGGLE ========== //
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");

  function detectSystemTheme() {
    try {
      if (window.matchMedia("(prefers-color-scheme: light)").matches) {
        body.classList.add("light-mode");
        themeIcon.textContent = "🌙";
      } else {
        body.classList.remove("light-mode");
        themeIcon.textContent = "☀️";
      }
    } catch (e) {
      // Fallback to dark mode
      body.classList.remove("light-mode");
      themeIcon.textContent = "☀️";
    }
  }

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    body.classList.add("light-mode");
    themeIcon.textContent = "🌙";
  } else if (savedTheme === "dark") {
    body.classList.remove("light-mode");
    themeIcon.textContent = "☀️";
  } else {
    detectSystemTheme();
  }

  themeToggle.addEventListener("click", () => {
    body.classList.toggle("light-mode");
    const isLightMode = body.classList.contains("light-mode");
    localStorage.setItem("theme", isLightMode ? "light" : "dark");
    themeIcon.textContent = isLightMode ? "🌙" : "☀️";
  });

  // ========== TYPEWRITER EFFECT ========== //
  const typewriterText = "Innovator in Video Editing, Game Development, Software, and Aerospace";
  const typewriterElement = document.querySelector(".typewriter");
  let charIndex = 0;

  function typeWriter() {
    if (charIndex < typewriterText.length) {
      typewriterElement.textContent += typewriterText.charAt(charIndex);
      charIndex++;
      setTimeout(typeWriter, 100);
    }
  }
  typeWriter();

  // ========== SCROLL BLUR EFFECT (DESKTOP ONLY) ========== //
  if (!isMobileDevice()) {
    window.addEventListener("scroll", () => {
      const blurAmount = Math.min(window.scrollY / 100, 10);
      canvas.style.filter = `blur(${blurAmount}px)`;
    });
  }

  // ========== GSAP ANIMATIONS ========== //
  gsap.registerPlugin(ScrollTrigger);

  gsap.from(".cta-btn", {
    opacity: 0,
    y: 50,
    duration: 1,
    delay: 1.5,
    onComplete: () => {
      document.querySelector(".cta-btn").style.visibility = "visible";
    },
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

  // ========== FUNCTION TO INITIALIZE CANVAS (DESKTOP ONLY) ========== //
  function initializeCanvas() {
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

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
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
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

    let dots = [];
    function initDots() {
      for (let i = 0; i < 100; i++) {
        dots.push(new Dot(Math.random() * canvas.width, Math.random() * canvas.height));
      }
    }

    function drawLines() {
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 100) {
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
      dots.forEach((dot) => {
        dot.update();
        dot.draw();
      });
      drawLines();
      requestAnimationFrame(animate);
    }

    initDots();
    animate();
  }

  // Dynamic footer year
  document.getElementById("current-year").textContent = new Date().getFullYear();

  // Back to top button
  const backToTop = document.getElementById("back-to-top");
  window.addEventListener("scroll", () => {
    backToTop.style.display = window.scrollY > 300 ? "block" : "none";
  });
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // Modal functionality
  const modal = document.getElementById("modal");
  const modalContent = modal.querySelector(".modal-content");
  const modalClose = modal.querySelector(".modal-close");

  window.openModal = function(src, isVideo) {
    modalContent.innerHTML = '<div class="modal-loader">Loading...</div>';
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
    const element = isVideo ? document.createElement("iframe") : document.createElement("img");
    element.src = src;
    if (isVideo) {
      element.allowfullscreen = true;
      element.style.width = "100%";
      element.style.height = "100%";
    } else {
      element.style.maxWidth = "90%";
      element.style.maxHeight = "90vh";
      element.style.objectFit = "contain";
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

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      modal.setAttribute("aria-hidden", "true");
    }
  });

  // Contact canvas (desktop only)
  if (!isMobileDevice()) {
    const contactCanvas = document.getElementById("contact-canvas");
    if (contactCanvas) {
      const ctx = contactCanvas.getContext("2d");
      contactCanvas.width = contactCanvas.offsetWidth;
      contactCanvas.height = contactCanvas.offsetHeight;

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
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = document.body.classList.contains("light-mode") ? "rgba(0, 0, 0, 0.5)" : "rgba(255, 255, 255, 0.5)";
          ctx.fill();
        }

        update() {
          this.x += this.vx;
          this.y += this.vy;
          if (this.x < 0 || this.x > contactCanvas.width) this.vx *= -1;
          if (this.y < 0 || this.y > contactCanvas.height) this.vy *= -1;
        }
      }

      let particles = [];
      for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
      }

      function animateParticles() {
        ctx.clearRect(0, 0, contactCanvas.width, contactCanvas.height);
        particles.forEach(particle => {
          particle.update();
          particle.draw();
        });
        requestAnimationFrame(animateParticles);
      }

      animateParticles();

      // Resize canvas on window resize
      window.addEventListener("resize", () => {
        contactCanvas.width = contactCanvas.offsetWidth;
        contactCanvas.height = contactCanvas.offsetHeight;
      });
    }
  }
});
