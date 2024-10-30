"use client";
import React, { useEffect, useRef, useState } from "react";
import { AppContextProvider } from "./context/AppContext";
import Separator from "./components/Separator";
import Container from "./components/animation_components/Container";

export default function Home() {
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);
  const parentRef = useRef<HTMLDivElement>(null); // Ref for the parent div
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [containerDimensions, setContainerDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const adjustLetterSpacing = () => {
      if (h1Ref.current && pRef.current) {
        const h1Width = h1Ref.current.offsetWidth;
        const pWidth = pRef.current.offsetWidth;
        const pTextLength = pRef.current.innerText.length;
        const widthDifference = h1Width - pWidth + 30;
        const calculatedSpacing = widthDifference / pTextLength;

        setLetterSpacing(calculatedSpacing);
      }
    };

    // Calculate container dimensions
    const adjustContainerDimensions = () => {
      if (parentRef.current) {
        setContainerDimensions({
          width: parentRef.current.clientWidth,
          height: parentRef.current.clientHeight,
        });
      }
    };

    // Initial calculations
    adjustLetterSpacing();
    adjustContainerDimensions();

    // Adjust on window resize
    window.addEventListener("resize", () => {
      adjustLetterSpacing();
      adjustContainerDimensions();
    });
    return () => {
      window.removeEventListener("resize", adjustLetterSpacing);
      window.removeEventListener("resize", adjustContainerDimensions);
    };
  }, []);

  return (
    <AppContextProvider>
      <div className="container max-w-full h-screen flex justify-center items-center p-8">
        <div className="w-full md:w-[500px] h-full border border-1 border-black flex flex-col px-8 pt-4 pb-8">
          <div className="flex flex-col select-none">
            <h1 ref={h1Ref} className="text-[4rem] font-black text-center">
              DYNAPOST
            </h1>
            <p
              ref={pRef}
              className="text-[0.95rem] md:text-[1rem] text-nowrap text-center font-light"
              style={{ letterSpacing: `${letterSpacing}px` }}
            >
              INTERACTIVE POSTER DESIGN EXPERIENCE
            </p>
          </div>
          <div className="flex flex-col w-full h-fit">
            <Separator height={0.05} />
            <div className="flex justify-between w-full h-16 bg-stone-300"></div>
            <Separator height={0.05} />
          </div>
          <div
            ref={parentRef}
            className="flex justify-center items-center w-full h-[80%] border border-1 border-black/[0.2]"
          >
            <Container
              width={containerDimensions.width}
              height={containerDimensions.height}
              objectCount={200}
              maxSize={10}
            />
          </div>
        </div>
      </div>
    </AppContextProvider>
  );
}
