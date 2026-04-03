import Link from "next/link";
import { MapPin, Briefcase, Megaphone, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

type ListingCardProps = {
  id: string;
  type: "want_to_advertise" | "have_space" | "offer_service";
  title: string;
  description: string;
  locationCity: string | null;
  locationState: string | null;
  locationCountry: string;
  isRemote: boolean;
  priceMin: number | null;
  priceMax: number | null;
  pricePeriod: string | null;
  priceText: string | null;
  images: string[];
  viewsCount: number;
  authorName: string;
};

const TYPE_CONFIG = {
  have_space: {
    label: "Espacio",
    color: "bg-[oklch(0.702_0.183_56.823)]/10 text-[oklch(0.702_0.183_56.823)]",
    Icon: MapPin,
  },
  want_to_advertise: {
    label: "Solicitud",
    color: "bg-primary/10 text-primary",
    Icon: Megaphone,
  },
  offer_service: {
    label: "Agencia",
    color: "bg-[oklch(0.696_0.17_162.48)]/10 text-[oklch(0.696_0.17_162.48)]",
    Icon: Briefcase,
  },
} as const;

const PERIOD_LABELS: Record<string, string> = {
  day: "día",
  week: "semana",
  month: "mes",
  campaign: "campaña",
};

function formatPrice(min: number | null, max: number | null, period: string | null, text: string | null): string | null {
  if (text) return text;
  if (!min && !max) return null;
  const period_label = period ? `/${PERIOD_LABELS[period] ?? period}` : "";
  if (min && max) return `$${min.toLocaleString()} – $${max.toLocaleString()} USD${period_label}`;
  if (min) return `Desde $${min.toLocaleString()} USD${period_label}`;
  if (max) return `Hasta $${max.toLocaleString()} USD${period_label}`;
  return null;
}

export function ListingCard({
  id,
  type,
  title,
  description,
  locationCity,
  locationState,
  locationCountry,
  isRemote,
  priceMin,
  priceMax,
  pricePeriod,
  priceText,
  images,
  authorName,
}: ListingCardProps) {
  const config = TYPE_CONFIG[type];
  const price = formatPrice(priceMin, priceMax, pricePeriod, priceText);
  const location = isRemote
    ? "Remoto / Digital"
    : [locationCity, locationState, locationCountry].filter(Boolean).join(", ");

  return (
    <Link
      href={`/listing/${id}`}
      className="group flex flex-col rounded-2xl border bg-card transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 overflow-hidden"
    >
      {/* Image area */}
      <div className="relative aspect-[16/9] bg-muted overflow-hidden">
        {images.length > 0 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={images[0]}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <config.Icon className="h-10 w-10 text-muted-foreground/30" />
          </div>
        )}
        <span className={cn("absolute top-3 left-3 rounded-full px-2.5 py-1 text-xs font-semibold", config.color)}>
          {config.label}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2 flex-1">
          {description}
        </p>

        <div className="mt-4 space-y-1.5">
          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {isRemote ? <Globe className="h-3.5 w-3.5 shrink-0" /> : <MapPin className="h-3.5 w-3.5 shrink-0" />}
            <span className="truncate">{location || "Sin ubicación"}</span>
          </div>

          {/* Price */}
          {price && (
            <p className="text-sm font-semibold text-primary">{price}</p>
          )}
        </div>

        <div className="mt-3 border-t pt-3 flex items-center justify-between">
          <span className="text-xs text-muted-foreground truncate">{authorName}</span>
          <span className="text-xs font-medium text-primary shrink-0">Ver más →</span>
        </div>
      </div>
    </Link>
  );
}
