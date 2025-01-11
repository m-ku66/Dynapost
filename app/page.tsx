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
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

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
        const rect = parentRef.current.getBoundingClientRect();
        setContainerDimensions({
          width: rect.width,
          height: rect.height,
        });
      }
    };

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "s") {
        toggleAudio();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    // Initial calculations with a small delay
    const timeoutId = setTimeout(() => {
      adjustLetterSpacing();
      adjustContainerDimensions();
    }, 100);

    // Adjust on window resize
    const handleResize = () => {
      adjustLetterSpacing();
      adjustContainerDimensions();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyPress);
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

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set up audio
    audio.volume = 0.5; // Set initial volume to 50%

    // Handle audio play on user interaction
    const playAudio = () => {
      if (audio.paused) {
        audio
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.error("Audio playback failed:", error);
          });
      }
    };

    // Add click event listener to document for initial play
    document.addEventListener("click", playAudio, { once: true });

    return () => {
      document.removeEventListener("click", playAudio);
    };
  }, []);

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((error) => console.error("Audio playback failed:", error));
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  return (
    <AppContextProvider>
      <div className="hidden fade-in1 container max-w-full h-screen md:flex justify-center items-center p-8 bg-white text-black">
        <div className="slide-up w-full md:w-[500px] h-full border border-1 border-black flex flex-col px-8 pt-4 pb-4">
          <div className="flex flex-col select-none">
            <h1
              ref={h1Ref}
              className="expand-from-center1 text-[4rem] font-black text-center"
            >
              DYNAPOST
            </h1>
            <p
              ref={pRef}
              className="expand-from-center2 text-[0.95rem] md:text-[1rem] text-nowrap text-center font-light"
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
                      "Sometimes it's good to let go and let yourself float.",
                  },
                  {
                    id: "bounce",
                    title: "002",
                    description:
                      "What goes up must come down. And back up again.",
                  },
                  {
                    id: "cycle",
                    title: "003",
                    description:
                      "Round and round and round and round and round.",
                  },
                ]}
              />
            </div>
            <Separator height={0.05} />
          </div>
          <div
            ref={parentRef}
            className="fade-in2 flex justify-center items-center w-full h-full border border-1 border-black/[0.2]"
          >
            {containerDimensions.width > 0 &&
              containerDimensions.height > 0 && (
                <Container
                  width={containerDimensions.width}
                  height={containerDimensions.height}
                  objectCount={objectCount}
                  maxSize={maxSize.value}
                />
              )}
          </div>
          <div className="fade-in3 flex justify-between mt-2 items-center">
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
        <audio
          src="/lofi-song-backyard-by-lofium-242713.mp3"
          ref={audioRef}
          loop
          autoPlay
        ></audio>
        <div className="select-none absolute flex flex-col gap-1 left-8 bottom-4">
          <div className="flex gap-1 text-[0.5rem] md:text-[1rem]">
            Music by
            <a
              className="text-emerald-800"
              href="https://pixabay.com/users/lofium-30660321/"
              target="_blank"
            >
              Lofium
            </a>
          </div>
          <p className="hidden md:block text-[0.7rem]">
            {`press 's' to ${isPlaying ? "mute" : "unmute"} sound`}
          </p>
        </div>

        <div className="select-none absolute flex flex-col gap-1 right-8 bottom-4">
          <div className="flex gap-1 text-[0.5rem] md:text-[1rem]">
            Check out my
            <a
              className="text-rose-800"
              href="https://marcmiango.vercel.app/"
              target="_blank"
            >
              portfolio
            </a>
            too!
          </div>
          <p className="hidden md:block text-[0.7rem]">
            Thanks for visiting! :D
          </p>
        </div>
      </div>
      <div className="md:hidden container max-w-full h-screen flex justify-center items-center">
        <p className="w-[80%]">
          {
            "Erm...Sorry, but this experience is best viewed on a larger screens. I also didn't plan on making it mobile friendly...my bad :p"
          }
        </p>
      </div>
    </AppContextProvider>
  );
}
