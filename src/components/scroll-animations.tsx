"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollAnimations() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          isMotionOK: "(prefers-reduced-motion: no-preference)",
          isReduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isMotionOK } = context.conditions as {
            isMotionOK: boolean;
            isReduced: boolean;
          };
          if (!isMotionOK) {
            // Reduced motion: skip all scroll-driven animations; elements stay
            // in their natural final state. No-op.
            return;
          }

          // Single batched pass over the document — each selector runs once,
          // results are cached in local consts, and every animation is created
          // inside the same gsap.context for a one-shot revert on unmount.
          const fadeUpElements = document.querySelectorAll(
            '[data-animate="fade-up"]'
          );
          const parallaxElements = document.querySelectorAll("[data-parallax]");
          const staggerContainers = document.querySelectorAll(
            '[data-animate="stagger"]'
          );
          const slideLeftElements = document.querySelectorAll(
            '[data-animate="slide-left"]'
          );
          const slideRightElements = document.querySelectorAll(
            '[data-animate="slide-right"]'
          );
          const scaleElements = document.querySelectorAll(
            '[data-animate="scale-up"]'
          );

          fadeUpElements.forEach((el) => {
            gsap.from(el, {
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none none",
              },
              y: 50,
              opacity: 0,
              duration: 0.8,
              ease: "power3.out",
            });
          });

          parallaxElements.forEach((el) => {
            gsap.to(el, {
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              },
              y: -50,
              ease: "none",
            });
          });

          staggerContainers.forEach((container) => {
            gsap.from(container.children, {
              scrollTrigger: {
                trigger: container,
                start: "top 80%",
                toggleActions: "play none none none",
              },
              y: 40,
              opacity: 0,
              duration: 0.6,
              stagger: 0.12,
              ease: "power3.out",
            });
          });

          slideLeftElements.forEach((el) => {
            gsap.from(el, {
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none none",
              },
              x: -80,
              opacity: 0,
              duration: 0.8,
              ease: "power3.out",
            });
          });

          slideRightElements.forEach((el) => {
            gsap.from(el, {
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none none",
              },
              x: 80,
              opacity: 0,
              duration: 0.8,
              ease: "power3.out",
            });
          });

          scaleElements.forEach((el) => {
            gsap.from(el, {
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none none",
              },
              scale: 0.85,
              opacity: 0,
              duration: 0.8,
              ease: "power3.out",
            });
          });
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return null;
}
