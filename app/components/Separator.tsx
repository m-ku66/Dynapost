"use client";
type SeparatorProps = {
  height: number;
};

export default function Separator({ height }: SeparatorProps) {
  return (
    <div
      style={{ height: `${height}rem` }}
      className={`expand-from-center3 w-full bg-black my-4`}
    ></div>
  );
}
