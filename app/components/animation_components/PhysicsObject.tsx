import React from "react";
import { useAppContext } from "@/app/hooks/useAppContext";

type physicsObjectProps = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
};

const Object = React.memo(({ x, y, radius, color }: physicsObjectProps) => {
  const objectShape = useAppContext().state.objectShape;

  function renderObject() {
    switch (objectShape) {
      case "orb": {
        return (
          <div
            className={``}
            style={{
              position: "absolute",
              left: `${x - radius}px`,
              top: `${y - radius}px`,
              width: `${radius * 2}px`,
              height: `${radius * 2}px`,
              borderRadius: "50%",
              backgroundColor: color,
            }}
          />
        );
      }
      case "cross": {
        return (
          <div
            className={`flex justify-center items-center`}
            style={{
              position: "absolute",
              left: `${x - radius}px`,
              top: `${y - radius}px`,
              width: `${radius * 2}px`,
              height: `${radius * 2}px`,
              borderRadius: "0%",
              backgroundColor: "transparent",
            }}
          >
            <div className="w-full h-1/3" style={{ backgroundColor: color }} />
            <div
              className="absolute w-1/3 h-full"
              style={{ backgroundColor: color }}
            />
          </div>
        );
      }
      case "box": {
        return (
          <div
            className={``}
            style={{
              position: "absolute",
              left: `${x - radius}px`,
              top: `${y - radius}px`,
              width: `${radius * 2}px`,
              height: `${radius * 2}px`,
              borderRadius: "0%",
              backgroundColor: color,
            }}
          />
        );
      }
    }
  }

  return renderObject();
});

export default Object;
