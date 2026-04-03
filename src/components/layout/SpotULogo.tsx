import Image from "next/image";

type SpotULogoProps = {
  variant?: "full" | "horizontal" | "icon";
  className?: string;
  width?: number;
  height?: number;
};

export function SpotULogo({
  variant = "horizontal",
  className,
  width,
  height,
}: SpotULogoProps) {
  const variants = {
    full: { src: "/logos/logo-full.svg", w: width ?? 180, h: height ?? 180 },
    horizontal: {
      src: "/logos/logo-horizontal.svg",
      w: width ?? 140,
      h: height ?? 40,
    },
    icon: { src: "/logos/icon.svg", w: width ?? 40, h: height ?? 40 },
  };

  const { src, w, h } = variants[variant];

  return (
    <Image
      src={src}
      alt="SpotU"
      width={w}
      height={h}
      className={className}
      priority
    />
  );
}
