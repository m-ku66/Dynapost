"use client";
type SeparatorProps = {
  height: number;
};

export default function Separator({ height }: SeparatorProps) {
  return (
    <div
      style={{ height: `${height}rem` }}
      className={`w-full bg-black my-4`}
    ></div>
  );
}
