import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import lottie from "lottie-web";

const horizontalKeyframes = [
  { progress: 0, value: -0.3 },
  { progress: 0.1, value: -0.6 },
  { progress: 0.2, value: -0.15 },
  { progress: 0.28, value: -0.18 },
  { progress: 0.4, value: 0.7 },
  { progress: 0.52, value: 0.3 },
  { progress: 0.58, value: 0.35 },
  { progress: 0.68, value: -0.55 },
  { progress: 0.8, value: -0.8 },
  { progress: 0.9, value: 0.15 },
  { progress: 1, value: -0.2 },
];

const verticalKeyframes = [
  { progress: 0, value: 0 },
  { progress: 0.05, value: 0.16 },
  { progress: 0.3, value: 0.34 },
  { progress: 0.6, value: 0.5 },
  { progress: 0.85, value: 0.66 },
  { progress: 1, value: 1 },
];

export const sampleKeyframes = (keyframes, progress) => {
  for (let i = 0; i < keyframes.length - 1; i++) {
    const from = keyframes[i];
    const to = keyframes[i + 1];

    if (progress >= from.progress && progress <= to.progress) {
      const segment =
        (progress - from.progress) / (to.progress - from.progress);
      const eased = segment * segment * (3 - 2 * segment);
      return from.value + (to.value - from.value) * eased;
    }
  }
  return keyframes[keyframes.length - 1].value;
};

export const useBeeAnimation = () => {
  const spotlightRef = useRef(null);
  const beeRef = useRef(null);
  const shadowRef = useRef(null);

  const [animationStatus, setAnimationStatus] = useState("loading");

  useEffect(() => {
    const spotlight = spotlightRef.current;
    const bee = beeRef.current;
    const shadow = shadowRef.current;
    if (!spotlight || !bee || !shadow) return;

    let disposed = false;
    let failed = false;
    let refreshFrame = 0;
    let readyCount = 0;
    const animations = [];
    const controller = new AbortController();
    const flight = { scrollProgress: 0 };

    // Recalculate viewport dimensions so resizing also updates the flight path.
    function positionBee(progress) {
      const beeSize = 125;
      const shadowSize = 115;
      const center = (window.innerWidth - beeSize) / 2;
      const offset = sampleKeyframes(horizontalKeyframes, progress);
      const drop = sampleKeyframes(verticalKeyframes, progress);
      const startY = -beeSize - 60;
      const endY = window.innerHeight + 50;
      const x = center + offset * window.innerWidth * 0.4;
      const y = startY + (endY - startY) * drop;
      const lookAhead = Math.min(1, progress + 0.02);
      const direction =
        sampleKeyframes(horizontalKeyframes, lookAhead) - offset;
      const tilt = gsap.utils.clamp(-14, 14, direction * 120);

      gsap.set(bee, { x, y, rotation: tilt });

      const heightFeel = Math.sin(drop * Math.PI);
      const shadowCenter = (beeSize - shadowSize) / 2;
      gsap.set(shadow, {
        x: x + shadowCenter + 40 * (0.5 + heightFeel),
        y: y + shadowCenter + 60 * (0.6 + heightFeel),
        scaleX: 1 + heightFeel * 0.15,
        scaleY: 0.5,
        rotation: tilt,
        opacity: 0.5 - heightFeel * 0.2,
        transformOrigin: "50% 100%",
      });
    }

    const context = gsap.context(() => {
      positionBee(0);
      gsap.to(flight, {
        scrollProgress: 1,
        ease: "none",
        scrollTrigger: {
          trigger: spotlight,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          // Synchronize with the current scroll, including restored positions.
          onRefresh: (trigger) => {
            flight.scrollProgress = trigger.progress;
            positionBee(trigger.progress);
          },
        },
        onUpdate: () => positionBee(flight.scrollProgress),
      });
    });

    function scheduleRefresh() {
      if (disposed) return;
      cancelAnimationFrame(refreshFrame);
      refreshFrame = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }

    // ReactLenis handles its own dimensions; refresh the animation's range here.
    // Images, fonts and viewport changes can all change the scrollable range.
    const observer = new ResizeObserver(scheduleRefresh);
    observer.observe(spotlight);
    window.addEventListener("resize", scheduleRefresh);
    document.fonts.ready.then(scheduleRefresh);
    scheduleRefresh();

    function onReady() {
      if (disposed || failed) return;
      readyCount += 1;
      if (readyCount !== 2) return;

      ScrollTrigger.refresh();
      positionBee(flight.scrollProgress);
      animations.forEach((animation) => animation.goToAndPlay(0, true));
      setAnimationStatus("ready");
    }

    function onFailure() {
      if (disposed || failed) return;
      failed = true;
      animations.forEach((animation) => animation.pause());
      setAnimationStatus("error");
    }

    // Fetch once; use separate copies because Lottie can mutate animation data.
    async function loadAnimations() {
      try {
        const response = await fetch("/bee.json", {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Failed to load bee animation");
        const data = await response.json();
        if (disposed) return;

        for (const container of [bee, shadow]) {
          const animation = lottie.loadAnimation({
            container,
            renderer: "svg",
            loop: true,
            autoplay: false,
            animationData: structuredClone(data),
          });
          animations.push(animation);
          animation.addEventListener("DOMLoaded", onReady);
          animation.addEventListener("data_failed", onFailure);
          animation.addEventListener("error", onFailure);
        }
      } catch (error) {
        if (error.name !== "AbortError") onFailure();
      }
    }

    loadAnimations();

    // StrictMode also runs this cleanup before initializing again in development.
    return () => {
      disposed = true;
      controller.abort();
      observer.disconnect();
      window.removeEventListener("resize", scheduleRefresh);
      cancelAnimationFrame(refreshFrame);
      context.revert();
      animations.forEach((animation) => {
        animation.removeEventListener("DOMLoaded", onReady);
        animation.removeEventListener("data_failed", onFailure);
        animation.removeEventListener("error", onFailure);
        animation.destroy();
      });
    };
  }, []);

  return { spotlightRef, beeRef, shadowRef, animationStatus };
};
