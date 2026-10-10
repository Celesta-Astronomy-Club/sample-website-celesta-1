const body = document.body;
const navToggle = document.querySelector(".nav-toggle");
const cursorOrb = document.querySelector("#cursorOrb");
const starCanvas = document.querySelector("#starfield");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (navToggle) {
  navToggle.addEventListener("click", () => {
    const isOpen = body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

if (cursorOrb && window.matchMedia("(pointer: fine)").matches) {
  body.classList.add("has-custom-cursor");

  let cursorX = window.innerWidth / 2;
  let cursorY = window.innerHeight / 2;
  let orbX = cursorX;
  let orbY = cursorY;

  window.addEventListener("pointermove", (event) => {
    cursorX = event.clientX;
    cursorY = event.clientY;
  });

  document.querySelectorAll("a, button").forEach((item) => {
    item.addEventListener("pointerenter", () => cursorOrb.classList.add("is-hovering"));
    item.addEventListener("pointerleave", () => cursorOrb.classList.remove("is-hovering"));
  });

  const moveOrb = () => {
    orbX += (cursorX - orbX) * 0.2;
    orbY += (cursorY - orbY) * 0.2;
    cursorOrb.style.transform = `translate3d(${orbX}px, ${orbY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(moveOrb);
  };

  moveOrb();
}

if (starCanvas) {
  const context = starCanvas.getContext("2d");
  const stars = [];
  const starCount = 110;
  let width = 0;
  let height = 0;
  let pixelRatio = 1;

  const resize = () => {
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    starCanvas.width = Math.floor(width * pixelRatio);
    starCanvas.height = Math.floor(height * pixelRatio);
    starCanvas.style.width = `${width}px`;
    starCanvas.style.height = `${height}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    stars.length = 0;
    for (let index = 0; index < starCount; index += 1) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.35 + 0.2,
        alpha: Math.random() * 0.55 + 0.18,
        drift: Math.random() * 0.18 + 0.02
      });
    }
  };

  const draw = () => {
    context.clearRect(0, 0, width, height);
    stars.forEach((star) => {
      context.beginPath();
      context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      context.fillStyle = `rgba(245, 242, 234, ${star.alpha})`;
      context.fill();

      if (!prefersReducedMotion) {
        star.y += star.drift;
        if (star.y > height + 4) {
          star.y = -4;
          star.x = Math.random() * width;
        }
      }
    });

    requestAnimationFrame(draw);
  };

  resize();
  draw();
  window.addEventListener("resize", resize);
}
