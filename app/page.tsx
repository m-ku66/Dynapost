"use client";
import React, { useEffect, useRef, useState } from "react";
import { AppContextProvider } from "./context/AppContext";
import Separator from "./components/Separator";
export default function Home() {
  const h1Ref = useRef<HTMLHeadingElement>(null); // reference to remember header width between renders
  const pRef = useRef<HTMLParagraphElement>(null); // reference to remember paragraph width between renders
  const [letterSpacing, setLetterSpacing] = useState(0); // spacing between letters

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

    // Initial calculation
    adjustLetterSpacing();

    // Adjust on window resize for responsiveness
    window.addEventListener("resize", adjustLetterSpacing);
    return () => window.removeEventListener("resize", adjustLetterSpacing);
  }, []);

  return (
    <AppContextProvider>
      <div className="container max-w-full h-screen flex justify-center items-center p-8">
        <div className="w-full md:w-[500px] h-full border border-1 border-black flex flex-col px-8 py-4">
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
          <div className="w-full h-full border border-1 border-black">
            container component
          </div>
        </div>
      </div>
    </AppContextProvider>
  );
}
