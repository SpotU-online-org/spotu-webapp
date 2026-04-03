"use client";

export function AnimatedGrid() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle, oklch(0.457 0.24 277) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Soft gradient orbs */}
      <div className="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-primary/[0.06] blur-[100px] animate-float-slow" />
      <div className="absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-coral/[0.05] blur-[100px] animate-float-slow [animation-delay:3s]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-emerald/[0.04] blur-[80px] animate-float [animation-delay:1.5s]" />
    </div>
  );
}
