"use client";

const mouse = { x: 0.5, y: 0.5, smoothX: 0.5, smoothY: 0.5 };
let listening = false;
let animating = false;
let hasGyro = false;
let touching = false;

function startListening() {
  if (listening) return;
  listening = true;

  // Mouse (desktop)
  const onMouse = (e: MouseEvent) => {
    mouse.x = e.clientX / window.innerWidth;
    mouse.y = e.clientY / window.innerHeight;
  };
  window.addEventListener("mousemove", onMouse);

  // Touch (mobile) - only override gyro while actively touching
  const onTouchStart = () => { touching = true; };
  const onTouchEnd = () => { touching = false; };
  const onTouch = (e: TouchEvent) => {
    const t = e.touches[0];
    if (t) {
      mouse.x = t.clientX / window.innerWidth;
      mouse.y = t.clientY / window.innerHeight;
    }
  };
  window.addEventListener("touchstart", onTouchStart, { passive: true });
  window.addEventListener("touchend", onTouchEnd, { passive: true });
  window.addEventListener("touchmove", onTouch, { passive: true });

  // Gyroscope (mobile) - tilt maps to mouse position
  const onOrientation = (e: DeviceOrientationEvent) => {
    if (touching) return; // Don't fight with touch input
    hasGyro = true;
    const gamma = e.gamma ?? 0; // left-right tilt: -90 to 90
    const beta = e.beta ?? 0;   // front-back tilt: -180 to 180

    // ±20° range centered around natural phone hold (~45° beta)
    mouse.x = Math.min(1, Math.max(0, (gamma + 20) / 40));
    mouse.y = Math.min(1, Math.max(0, (beta - 25) / 40));
  };

  // Start gyroscope
  const enableGyro = () => {
    window.addEventListener("deviceorientation", onOrientation);
  };

  // iOS 13+ requires permission — ask on first touch
  if (
    typeof DeviceOrientationEvent !== "undefined" &&
    typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission === "function"
  ) {
    const request = (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission;
    const requestOnce = () => {
      request().then((state) => {
        if (state === "granted") enableGyro();
      }).catch(() => {});
    };
    window.addEventListener("touchstart", requestOnce, { once: true });
  } else if (typeof DeviceOrientationEvent !== "undefined") {
    enableGyro();
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

export function hasGyroscope() {
  return hasGyro;
}
