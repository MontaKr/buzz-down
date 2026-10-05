# Buzz Down

JavaScript 코드를 React 코드로 변환한 스크롤 애니메이션 프로젝트

Lottie와 GSAP ScrollTrigger를 연결해 스크롤 진행률에 따라 벌의 위치와 기울기, 그림자가 변하도록 구현
Lottie는 벌의 움직임을 반복 재생하고, ScrollTrigger는 스크롤에 맞춰 벌의 이동 경로를 제어

## 주요 기능

- 스크롤에 따라 화면을 가로지르는 벌 애니메이션
- 벌의 이동 방향에 따른 기울기와 그림자 변화
- Lenis를 활용한 부드러운 스크롤
- React 커스텀 훅(`useBeeAnimation`)으로 애니메이션 로직 분리
- context와 revert()를 사용하여 GSAP 클린업

## 사용 기술

React · Vite · Lottie (`lottie-web`) · GSAP ScrollTrigger · Lenis · Tailwind CSS

## 실행 방법

```bash
npm install
npm run dev
```

## 참고 영상

[원본 JavaScript 튜토리얼](https://www.youtube.com/watch?v=Pk6ja-KXoUw&list=PLCLenABZNYtE&index=1)
