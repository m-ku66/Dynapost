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
  const { state, setState } = useAppContext();
  const gravity = 0.5;
  let repulsionRadius: number; // radius
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
    const centerX = width / 2; // Set to true center
    const centerY = height / 2;
    const cycleSpeed = 0.03; // Increase for tighter orbit
    repulsionRadius = 100;

    setObjectArray((prevObjects) => {
      return prevObjects.map((obj) => {
        let { x, y, vx, vy } = obj;
        const { radius } = obj;

        // Mouse repulsion logic
        if (isMouseInContainer.current) {
          const dx = x - mousePos.x;
          const dy = y - mousePos.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < repulsionRadius && distance > 0) {
            if (distance < repulsionRadius && distance > 0) {
              if (physicsState === "bounce") {
                repulsionRadius = 80;
                const force = repulsionStrength * (repulsionRadius - distance);

                // Apply stronger force upward for 'bounce' state
                vx += (dx * force) / 10000; // Minor horizontal influence
                vy -= Math.abs(dy * force) / 100; // Stronger upward force
              }
            }

            const force =
              (repulsionStrength * (repulsionRadius - distance)) / distance;
            vx += (dx * force) / 15;
            vy += (dy * force) / 15;
          }
        }

        // Apply orbital movement only after mouse influence
        if (physicsState === "cycle") {
          const angle = Math.atan2(y - centerY, x - centerX);
          vx += -Math.sin(angle) * cycleSpeed * (width / 100);
          vy += Math.cos(angle) * cycleSpeed * (height / 100);

          // Limit the orbit radius to prevent boundary collisions
          const maxOrbitRadius = Math.min(width, height) / 2 - radius * 2;
          const distFromCenter = Math.sqrt(
            (x - centerX) ** 2 + (y - centerY) ** 2
          );

          if (distFromCenter > maxOrbitRadius) {
            // Pull the object back toward the center
            vx -= ((x - centerX) / distFromCenter) * 0.05;
            vy -= ((y - centerY) / distFromCenter) * 0.05;
          }
        }

        // Apply additional physics for bounce and float states
        if (physicsState === "bounce") {
          vy += gravity;
        } else if (physicsState === "float") {
          vx += (Math.random() - 0.5) * 0.1;
          vy += (Math.random() - 0.5) * 0.1;
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
      onClick={() => {
        if (state.objectShape === "box") {
          setState({ ...state, objectShape: "orb" });
        } else if (state.objectShape === "orb") {
          setState({ ...state, objectShape: "cross" });
        } else if (state.objectShape === "cross") {
          setState({ ...state, objectShape: "box" });
        }
      }}
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
