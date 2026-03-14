"use client";

const mouse = { x: 0.5, y: 0.5, smoothX: 0.5, smoothY: 0.5 };
let listening = false;
let animating = false;

function startListening() {
  if (listening) return;
  listening = true;

  // Mouse (desktop)
  const onMouse = (e: MouseEvent) => {
    mouse.x = e.clientX / window.innerWidth;
    mouse.y = e.clientY / window.innerHeight;
  };
  window.addEventListener("mousemove", onMouse);

  // Touch (mobile) - track finger position
  const onTouch = (e: TouchEvent) => {
    const t = e.touches[0];
    if (t) {
      mouse.x = t.clientX / window.innerWidth;
      mouse.y = t.clientY / window.innerHeight;
    }
  };
  window.addEventListener("touchmove", onTouch, { passive: true });

  // Gyroscope (mobile) - tilt maps to mouse position
  const onOrientation = (e: DeviceOrientationEvent) => {
    const gamma = e.gamma ?? 0; // left-right tilt: -90 to 90
    const beta = e.beta ?? 0;   // front-back tilt: -180 to 180

    // Clamp and normalize to 0-1 range (±30° range for natural feel)
    mouse.x = Math.min(1, Math.max(0, (gamma + 30) / 60));
    mouse.y = Math.min(1, Math.max(0, (beta - 30) / 60));
  };

  // iOS 13+ requires permission for DeviceOrientation
  if (
    typeof DeviceOrientationEvent !== "undefined" &&
    typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission === "function"
  ) {
    const request = (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission;
    // Will be triggered on first user interaction
    const requestOnce = () => {
      request().then((state) => {
        if (state === "granted") {
          window.addEventListener("deviceorientation", onOrientation);
        }
      }).catch(() => {});
      window.removeEventListener("touchstart", requestOnce);
    };
    window.addEventListener("touchstart", requestOnce, { once: true });
  } else {
    window.addEventListener("deviceorientation", onOrientation);
  }

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
