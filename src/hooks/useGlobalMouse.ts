"use client";

const mouse = { x: 0.5, y: 0.5, smoothX: 0.5, smoothY: 0.5 };
let listening = false;
let animating = false;

function startListening() {
  if (listening) return;
  listening = true;

  const onMouse = (e: MouseEvent) => {
    mouse.x = e.clientX / window.innerWidth;
    mouse.y = e.clientY / window.innerHeight;
  };
  window.addEventListener("mousemove", onMouse);

  if (!animating) {
    animating = true;
    const tick = () => {
      mouse.smoothX += (mouse.x - mouse.smoothX) * 0.035;
      mouse.smoothY += (mouse.y - mouse.smoothY) * 0.035;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
}

export function getGlobalMouse() {
  if (typeof window !== "undefined") startListening();
  return mouse;
}
