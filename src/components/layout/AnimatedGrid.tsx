"use client";

export function AnimatedGrid() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Floating gradient orbs */}
      <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-indigo/20 blur-[140px] animate-pulse" />
      <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-coral/12 blur-[140px] animate-pulse [animation-delay:2s]" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full bg-indigo/10 blur-[120px] animate-pulse [animation-delay:4s]" />

      {/* Radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0C0F1A_70%)]" />
    </div>
  );
}
