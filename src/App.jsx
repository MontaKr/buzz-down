import { ReactLenis, useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";

import { useBeeAnimation } from "./useBeeAnimation";

gsap.registerPlugin(ScrollTrigger);

function App() {
  const { spotlightRef, beeRef, shadowRef } = useBeeAnimation();

  useLenis(() => {
    ScrollTrigger.update();
  });

  return (
    <ReactLenis root options={{ autoRaf: true }}>
      <section className="intro relative flex h-svh w-full items-center justify-center overflow-hidden bg-[#fff318] text-center">
        <h1 className="w-3/5 text-[clamp(3rem,5vw,7rem)] font-medium leading-none tracking-[-0.01em] reference-mobile:w-[90%] reference-mobile:text-[2rem]">
          Everything here took longer than expected.
        </h1>
      </section>

      <section
        ref={spotlightRef}
        className="spotlight relative w-full overflow-hidden bg-[#fff318] px-24 py-48 reference-mobile:px-8"
      >
        <div className="spotlight-item mb-40 w-2/5 odd:mr-auto even:ml-auto last:mb-0 reference-mobile:w-3/5">
          <img className="h-full w-full object-cover" src="/img1.jpg" alt="" />
          <div className="spotlight-item-copy mt-4 flex justify-between font-medium leading-none tracking-[-0.01em]">
            <p>Fruiting Bodies</p>
            <p>01</p>
          </div>
        </div>

        <div className="spotlight-item mb-40 w-2/5 odd:mr-auto even:ml-auto last:mb-0 reference-mobile:w-3/5">
          <img className="h-full w-full object-cover" src="/img2.jpg" alt="" />
          <div className="spotlight-item-copy mt-4 flex justify-between font-medium leading-none tracking-[-0.01em]">
            <p>Silk &amp; Sediment</p>
            <p>02</p>
          </div>
        </div>

        <div className="spotlight-item mb-40 w-2/5 odd:mr-auto even:ml-auto last:mb-0 reference-mobile:w-3/5">
          <img className="h-full w-full object-cover" src="/img3.jpg" alt="" />
          <div className="spotlight-item-copy mt-4 flex justify-between font-medium leading-none tracking-[-0.01em]">
            <p>Canvas Drape</p>
            <p>03</p>
          </div>
        </div>

        <div className="spotlight-item mb-40 w-2/5 odd:mr-auto even:ml-auto last:mb-0 reference-mobile:w-3/5">
          <img className="h-full w-full object-cover" src="/img4.jpg" alt="" />
          <div className="spotlight-item-copy mt-4 flex justify-between font-medium leading-none tracking-[-0.01em]">
            <p>Lowland Drift</p>
            <p>04</p>
          </div>
        </div>

        <div className="spotlight-item mb-40 w-2/5 odd:mr-auto even:ml-auto last:mb-0 reference-mobile:w-3/5">
          <img className="h-full w-full object-cover" src="/img5.jpg" alt="" />
          <div className="spotlight-item-copy mt-4 flex justify-between font-medium leading-none tracking-[-0.01em]">
            <p>Culture Dish</p>
            <p>05</p>
          </div>
        </div>

        <div className="spotlight-item mb-40 w-2/5 odd:mr-auto even:ml-auto last:mb-0 reference-mobile:w-3/5">
          <img className="h-full w-full object-cover" src="/img6.jpg" alt="" />
          <div className="spotlight-item-copy mt-4 flex justify-between font-medium leading-none tracking-[-0.01em]">
            <p>Quiet Hours</p>
            <p>06</p>
          </div>
        </div>
      </section>

      <section className="outro relative flex h-svh w-full items-center justify-center overflow-hidden bg-[#fff318] text-center">
        <h1 className="w-3/5 text-[clamp(3rem,5vw,7rem)] font-medium leading-none tracking-[-0.01em] reference-mobile:w-[90%] reference-mobile:text-[2rem]">
          Thanks for scrolling all the way down here.
        </h1>
      </section>

      <div
        className="lottie-container pointer-events-none fixed top-0 left-0 h-svh w-full"
        aria-hidden="true"
      >
        <div
          ref={shadowRef}
          className="bee-shadow absolute top-0 left-0 size-[115px] opacity-50 blur-[2px] brightness-0 will-change-[transform,opacity]"
        />

        <div
          ref={beeRef}
          className="bee absolute top-0 left-0 size-[125px] will-change-transform"
        />
      </div>
    </ReactLenis>
  );
}

export default App;
