// declaring container props
type containerProps = {
  width: number;
  height: number;
  objectCount: number;
};

// declaring props for inital objects in the container
// these props mirror the props of the PhysicsObject component
type initObjectProps = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
};
