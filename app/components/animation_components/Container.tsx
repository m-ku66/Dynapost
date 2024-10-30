import React, { useEffect, useRef, useState, useCallback } from "react";
import PhysicsObject from "./PhysicsObject";
import { useAppContext } from "@/app/hooks/useAppContext";

type containerProps = {
  width: number;
  height: number;
  objectCount: number;
  maxSize?: number;
};

type initObjectProps = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
};

const Container = ({
  width,
  height,
  objectCount,
  maxSize = 10,
}: containerProps) => {
  const [objectArray, setObjectArray] = useState<initObjectProps[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const isMouseInContainer = useRef(false);
  const requestRef = useRef<number | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { physicsState } = useAppContext().state;
  const gravity = 0.5;
  const repulsionRadius = 100; // radius
  const repulsionStrength = 0.1; // strength

  // Initialize objects
  useEffect(() => {
    const initialObjects = Array.from({ length: objectCount }, () => ({
      x: Math.random() * (width - maxSize) + maxSize,
      y: Math.random() * (height - maxSize) + maxSize,
      vx: (Math.random() - 0.5) * 5,
      vy: (Math.random() - 0.5) * 5,
      radius: Math.round(Math.random() * (maxSize - maxSize / 2) + maxSize / 2),
      color: "black",
    }));
    setObjectArray(initialObjects);
  }, [width, height, objectCount, maxSize]);

  // Main animation loop with unified physics calculations
  const animate = useCallback(() => {
    setObjectArray((prevObjects) => {
      return prevObjects.map((obj) => {
        let { x, y, vx, vy, radius } = obj;

        // Mouse repulsion
        if (isMouseInContainer.current) {
          const dx = x - mousePos.x;
          const dy = y - mousePos.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < repulsionRadius && distance > 0) {
            const force =
              (repulsionStrength * (repulsionRadius - distance)) / distance;
            vx += (dx * force) / 15;
            vy += (dy * force) / 15;

            if (physicsState === "bounce") {
              vy -= force * 1.5; // Extra upward force in bounce mode
            }
          }
        }

        // Apply state-specific physics
        switch (physicsState) {
          case "bounce":
            vy += gravity;
            break;
          case "float":
          case "cycle":
            // Optional: Add subtle ambient motion
            vx += (Math.random() - 0.5) * 0.1;
            vy += (Math.random() - 0.5) * 0.1;
            break;
        }

        // Update position
        x += vx;
        y += vy;

        // Boundary collisions
        if (x <= radius) {
          x = radius;
          vx *= -0.8;
        } else if (x >= width - radius) {
          x = width - radius;
          vx *= -0.8;
        }

        if (y <= radius) {
          y = radius;
          vy *= -0.8;
        } else if (y >= height - radius) {
          y = height - radius;
          vy *= -0.8;

          // Special handling for bounce mode
          if (physicsState === "bounce" && Math.abs(vy) < 0.5) {
            vy = 0;
          }
        }

        // Apply friction based on physics state
        const frictionFactor = physicsState === "bounce" ? 0.99 : 0.995;
        vx *= frictionFactor;
        vy *= frictionFactor;

        return { ...obj, x, y, vx, vy };
      });
    });

    requestRef.current = requestAnimationFrame(animate);
  }, [width, height, mousePos, physicsState]);

  // Setup and cleanup effect
  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current !== undefined) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate]);

  return (
    <div
      ref={containerRef}
      className="relative border border-1 border-black"
      style={{ width: width, height: height, overflow: "hidden" }}
      onMouseMove={(event) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          setMousePos({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
          });
        }
      }}
      onMouseEnter={() => {
        isMouseInContainer.current = true;
      }}
      onMouseLeave={() => {
        isMouseInContainer.current = false;
      }}
    >
      {objectArray.map((obj, index) => (
        <PhysicsObject key={index} {...obj} />
      ))}
    </div>
  );
};

export default Container;
