"use client";
import React, { useEffect, useRef, useState } from "react";
import { AppContextProvider } from "./context/AppContext";
import Separator from "./components/Separator";
import Container from "./components/animation_components/Container";
import InteractionCard from "./components/InteractionCard";
import Image from "next/image";

export default function Home() {
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);
  const parentRef = useRef<HTMLDivElement>(null); // Ref for the parent div
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [containerDimensions, setContainerDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [maxSize, setMaxSize] = useState({
    value: 10,
    text: "Nr",
  });
  const [objectCount, setObjectCount] = useState(200);

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

  function sizeSwitcher() {
    if (maxSize.value === 10) {
      setMaxSize((prevSize) => ({
        ...prevSize,
        value: 30,
        text: "Lg",
      }));
    } else if (maxSize.value === 30) {
      setMaxSize((prevSize) => ({ ...prevSize, value: 50, text: "Mx" }));
    } else if (maxSize.value === 50) {
      setMaxSize((prevSize) => ({ ...prevSize, value: 5, text: "Sm" }));
    } else if (maxSize.value === 5) {
      setMaxSize((prevSize) => ({ ...prevSize, value: 10, text: "Nr" }));
    }
  }

  function objectCountSwitcher(amount: number) {
    switch (amount) {
      case 200:
        setObjectCount(200);
        break;
      case 500:
        setObjectCount(500);
        break;
      case 50:
        setObjectCount(50);
        break;
    }
  }

  return (
    <AppContextProvider>
      <div className="container max-w-full h-screen flex justify-center items-center p-8">
        <div className="w-full md:w-[500px] h-full border border-1 border-black flex flex-col px-8 pt-4 pb-4">
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
            <div className="flex justify-between w-full h-16 bg-transparent">
              <InteractionCard
                cards={[
                  {
                    id: "float",
                    title: "001",
                    description:
                      "Something about floating. Something about floating.",
                  },
                  {
                    id: "bounce",
                    title: "002",
                    description:
                      "Something about gravity. Something about gravity.",
                  },
                  {
                    id: "cycle",
                    title: "003",
                    description:
                      "Something about cycles. Something about cycles.",
                  },
                ]}
              />
            </div>
            <Separator height={0.05} />
          </div>
          <div
            ref={parentRef}
            className="flex justify-center items-center w-full h-[80%] border border-1 border-black/[0.2]"
          >
            <Container
              width={containerDimensions.width}
              height={containerDimensions.height}
              objectCount={objectCount}
              maxSize={maxSize.value}
            />
          </div>
          <div className="flex justify-between mt-2 items-center">
            <Image
              onClick={sizeSwitcher}
              src="/logo.svg"
              alt="Logo"
              className="select-none cursor-pointer hover:p-[0.5%] duration-150 ease-in-out"
              width={125}
              height={125}
            />

            <div className="flex gap-2">
              <div
                onClick={() => objectCountSwitcher(50)}
                className={
                  objectCount === 50
                    ? "cursor-pointer w-2 h-2 bg-black rounded-full"
                    : "cursor-pointer w-2 h-2 bg-black/[0.2] rounded-full"
                }
              ></div>
              <div
                onClick={() => objectCountSwitcher(200)}
                className={
                  objectCount === 200
                    ? "cursor-pointer w-2 h-2 bg-black rounded-full"
                    : "cursor-pointer w-2 h-2 bg-black/[0.2] rounded-full"
                }
              ></div>
              <div
                onClick={() => objectCountSwitcher(500)}
                className={
                  objectCount === 500
                    ? "cursor-pointer w-2 h-2 bg-black rounded-full"
                    : "cursor-pointer w-2 h-2 bg-black/[0.2] rounded-full"
                }
              ></div>
            </div>
          </div>
        </div>
      </div>
    </AppContextProvider>
  );
}
