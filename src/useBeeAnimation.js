import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import lottie from "lottie-web";

// 벌의 수평 이동 값
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

// 벌의 수직 이동 값
const verticalKeyframes = [
  { progress: 0, value: 0 },
  { progress: 0.05, value: 0.16 },
  { progress: 0.3, value: 0.34 },
  { progress: 0.6, value: 0.5 },
  { progress: 0.85, value: 0.66 },
  { progress: 1, value: 1 },
];

/**
 * 스크롤 진행률이 속한 Keyframe 구간을 찾아 value를 부드럽게 보간
 *
 * @param keyframes - 벌 이동 값 경로 데이터
 * @param progress - ScrollTrigger 구간의 스크롤 진행률 (0~1)
 * @returns {number} 현재 진행률에 해당하는 보간된 값
 */
export const sampleKeyframes = (keyframes, progress) => {
  for (let i = 0; i < keyframes.length - 1; i++) {
    const from = keyframes[i];
    const to = keyframes[i + 1];

    if (progress >= from.progress && progress <= to.progress) {
      const segment =
        (progress - from.progress) / (to.progress - from.progress); // 해당 구간에서 진행률
      const eased = segment * segment * (3 - 2 * segment); // eased 보정

      return from.value + (to.value - from.value) * eased;
    }
  }

  return keyframes[keyframes.length - 1].value;
};

export const useBeeAnimation = () => {
  const spotlightRef = useRef(null);
  const beeRef = useRef(null);
  const shadowRef = useRef(null);

  useEffect(() => {
    const spotlight = spotlightRef.current;
    const bee = beeRef.current;
    const shadow = shadowRef.current;

    if (!spotlight || !bee || !shadow) return;

    const animations = [bee, shadow].map((container) =>
      lottie.loadAnimation({
        container,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "/bee.json",
      }),
    );

    const flight = { scrollProgress: 0 };

    const positionBee = (progress) => {
      const beeSize = bee.offsetWidth; // 벌 사이즈
      const shadowSize = shadow.offsetWidth; // 벌 그림자 사이즈
      const center = (window.innerWidth - beeSize) / 2; // 벌을 수평 가운데에 위치
      const offset = sampleKeyframes(horizontalKeyframes, progress); // progress에 따른 벌의 수평 위치 비율
      const drop = sampleKeyframes(verticalKeyframes, progress); // // progress에 따른 벌의 수직 위치 비율
      const startY = -beeSize - 60; // 벌 애니메이션의 시작 위치 (임의로 -60만큼 추가)
      const endY = window.innerHeight + 50; // 벌 애니메이션의 종료 위치 (임의로 50만큼 추가)
      const x = center + offset * window.innerWidth * 0.4; // 벌의 실제 x 좌표(0.4를 곱해서 이동 거리 제한)
      const y = startY + (endY - startY) * drop; // 벌의 실제 y 좌표
      const lookAhead = Math.min(1, progress + 0.02); // 앞선 진행률
      const direction =
        sampleKeyframes(horizontalKeyframes, lookAhead) - offset; // 벌의 방향 계산
      const tilt = gsap.utils.clamp(-14, 14, direction * 120); // 벌의 기울기 계산

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
    };

    const context = gsap.context(() => {
      positionBee(0); // 마운트 시 초기 위치 계산

      gsap.to(flight, {
        scrollProgress: 1,
        ease: "none",
        scrollTrigger: {
          trigger: spotlight,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          // markers: true,
          onRefresh: (trigger) => {
            flight.scrollProgress = trigger.progress;
            positionBee(trigger.progress);
          },
        },

        onUpdate: () => positionBee(flight.scrollProgress),
      });
    });

    const refreshScroll = () => ScrollTrigger.refresh();

    window.addEventListener("resize", refreshScroll);

    refreshScroll();

    // StrictMode also runs this cleanup before initializing again in development.
    return () => {
      window.removeEventListener("resize", refreshScroll);
      context.revert();
      animations.forEach((animation) => animation.destroy());
    };
  }, []);

  return { spotlightRef, beeRef, shadowRef };
};
