"use client";

import { MessageCircle, Phone, Mail, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { linkButtonVariants } from "@/components/ui/link-button";
import { cn } from "@/lib/utils";

type Props = {
  listingId: string;
  whatsappUrl: string | null;
  callNumber: string | null;
  emailUrl: string | null;
  websiteUrl: string | null;
};

export function ContactButtons({ listingId, whatsappUrl, callNumber, emailUrl, websiteUrl }: Props) {
  function track() {
    const supabase = createClient();
    supabase.rpc("increment_contacts", { listing_id: listingId }).then(() => {});
  }

  const hasContact = whatsappUrl || callNumber || emailUrl;

  return (
    <div className="space-y-3">
      {whatsappUrl && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={track}
          className={cn(linkButtonVariants({ size: "lg" }), "w-full gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] border-transparent")}
        >
          <MessageCircle className="h-4 w-4" /> Contactar por WhatsApp
        </a>
      )}
      {callNumber && (
        <a
          href={`tel:${callNumber}`}
          onClick={track}
          className={cn(linkButtonVariants({ variant: "outline", size: "lg" }), "w-full gap-2.5")}
        >
          <Phone className="h-4 w-4" /> Llamar
        </a>
      )}
      {emailUrl && (
        <a
          href={emailUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={track}
          className={cn(linkButtonVariants({ variant: "outline", size: "lg" }), "w-full gap-2.5")}
        >
          <Mail className="h-4 w-4" /> Enviar correo
        </a>
      )}
      {websiteUrl && (
        <a
          href={websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(linkButtonVariants({ variant: "outline", size: "lg" }), "w-full gap-2.5")}
        >
          <ExternalLink className="h-4 w-4" /> Visitar sitio web
        </a>
      )}
      {!hasContact && (
        <p className="text-sm text-muted-foreground">Sin datos de contacto.</p>
      )}
    </div>
  );
}
