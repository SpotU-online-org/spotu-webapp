"use client";

export function AnimatedGrid() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Floating gradient orbs */}
      <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-indigo/20 blur-[120px] animate-pulse" />
      <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-coral/15 blur-[120px] animate-pulse [animation-delay:2s]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-indigo/10 blur-[100px] animate-pulse [animation-delay:4s]" />

      {/* Radial fade */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0B0F1A_70%)]" />
    </div>
  );
}
