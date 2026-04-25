const topbar = document.querySelector("[data-topbar]");

function updateTopbar() {
  topbar?.classList.toggle("is-scrolled", window.scrollY > 8);
}

updateTopbar();
window.addEventListener("scroll", updateTopbar, { passive: true });

const canvas = document.querySelector("#heroCanvas");
const ctx = canvas?.getContext("2d");
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (canvas && ctx) {
  const colors = ["#00a7a5", "#2b6fe8", "#d9a441", "#d95c45", "#2e9d64"];
  const nodes = [];
  let width = 0;
  let height = 0;
  let frame = 0;

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = Math.max(1, Math.floor(width * ratio));
    canvas.height = Math.max(1, Math.floor(height * ratio));
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    nodes.length = 0;
    const count = Math.max(26, Math.min(64, Math.floor(width / 26)));
    for (let i = 0; i < count; i += 1) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 2 + Math.random() * 4,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        color: colors[i % colors.length],
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgba(247, 243, 236, 0.34)";
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < nodes.length; i += 1) {
      const a = nodes[i];
      if (!prefersReduced) {
        a.x += a.vx;
        a.y += a.vy;
        if (a.x < -20) a.x = width + 20;
        if (a.x > width + 20) a.x = -20;
        if (a.y < -20) a.y = height + 20;
        if (a.y > height + 20) a.y = -20;
      }

      for (let j = i + 1; j < nodes.length; j += 1) {
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 155) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(7, 17, 31, ${0.12 * (1 - dist / 155)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      ctx.fillStyle = a.color;
      ctx.globalAlpha = 0.7;
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    if (!prefersReduced) frame = requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize, { passive: true });
  resize();
  draw();

  window.addEventListener("pagehide", () => cancelAnimationFrame(frame));
}
