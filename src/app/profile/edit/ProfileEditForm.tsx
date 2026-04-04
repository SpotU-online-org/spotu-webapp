"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Megaphone, MapPin, Briefcase, Check, Loader2, AlertTriangle, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { linkButtonVariants } from "@/components/ui/link-button";
import { MARKETS } from "@/constants";
import { useToast } from "@/components/ui/toast";

type Role = "advertiser" | "space_owner" | "agency";

const ROLE_CONFIG: Record<Role, { Icon: React.ElementType; label: string; listingType: string; color: string; bg: string; border: string; ring: string }> = {
  advertiser: {
    Icon: Megaphone,
    label: "Anunciante",
    listingType: "want_to_advertise",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/30",
    ring: "ring-primary/20",
  },
  space_owner: {
    Icon: MapPin,
    label: "Espacio publicitario",
    listingType: "have_space",
    color: "text-[oklch(0.702_0.183_56.823)]",
    bg: "bg-[oklch(0.702_0.183_56.823)]/10",
    border: "border-[oklch(0.702_0.183_56.823)]/30",
    ring: "ring-[oklch(0.702_0.183_56.823)]/20",
  },
  agency: {
    Icon: Briefcase,
    label: "Agencia de marketing",
    listingType: "offer_service",
    color: "text-[oklch(0.696_0.17_162.48)]",
    bg: "bg-[oklch(0.696_0.17_162.48)]/10",
    border: "border-[oklch(0.696_0.17_162.48)]/30",
    ring: "ring-[oklch(0.696_0.17_162.48)]/20",
  },
};

type Profile = {
  display_name: string | null;
  company_name: string | null;
  bio: string | null;
  website: string | null;
  phone: string | null;
  whatsapp: string | null;
  email_contact: string | null;
  city: string | null;
  country: string | null;
  type: string | null;
  types: string[] | null;
};

const inputCls =
  "w-full rounded-lg border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring transition-colors";

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function ProfileEditForm({ userId, profile }: { userId: string; profile: Profile }) {
  const router = useRouter();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState(profile.display_name ?? "");
  const [companyName, setCompanyName] = useState(profile.company_name ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [website, setWebsite] = useState(profile.website ?? "");
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [whatsapp, setWhatsapp] = useState(profile.whatsapp ?? "");
  const [emailContact, setEmailContact] = useState(profile.email_contact ?? "");
  const [city, setCity] = useState(profile.city ?? "");
  const [country, setCountry] = useState(profile.country ?? "CO");
  const [types, setTypes] = useState<Role[]>(
    (profile.types as Role[] | null) ?? ([profile.type as Role].filter(Boolean))
  );
  const [loading, setLoading] = useState(false);
  const [listingCounts, setListingCounts] = useState<Record<Role, number>>({
    advertiser: 0,
    space_owner: 0,
    agency: 0,
  });

  // Pre-load listing counts so we can disable toggles inline
  useEffect(() => {
    const supabase = createClient();
    Promise.all(
      (Object.entries(ROLE_CONFIG) as [Role, typeof ROLE_CONFIG[Role]][]).map(async ([role, cfg]) => {
        const { count } = await supabase
          .from("listings")
          .select("id", { count: "exact", head: true })
          .eq("user_id", userId)
          .eq("type", cfg.listingType)
          .in("status", ["active", "paused"]);
        return [role, count ?? 0] as [Role, number];
      })
    ).then((entries) =>
      setListingCounts(Object.fromEntries(entries) as Record<Role, number>)
    );
  }, [userId]);

  function toggleRole(role: Role) {
    setTypes((prev) => {
      if (prev.includes(role)) {
        if (prev.length === 1) return prev; // must keep at least one
        if (listingCounts[role] > 0) return prev; // blocked — has active listings
        return prev.filter((r) => r !== role);
      }
      return [...prev, role];
    });
  }

  async function handleSave() {
    if (!displayName.trim()) {
      toast("El nombre es obligatorio.", "error");
      return;
    }
    if (types.length === 0) {
      toast("Debes pertenecer a al menos un tipo de cuenta.", "error");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName.trim(),
        company_name: companyName.trim() || null,
        bio: bio.trim() || null,
        website: website.trim() || null,
        phone: phone.trim() || null,
        whatsapp: whatsapp.trim() || null,
        email_contact: emailContact.trim() || null,
        city: city.trim() || null,
        country: country || "CO",
        type: types[0],
        types,
      })
      .eq("id", userId);

    setLoading(false);

    if (error) {
      toast("No se pudo guardar el perfil. Intenta de nuevo.", "error");
    } else {
      toast("Perfil actualizado correctamente.", "success");
      router.refresh();
    }
  }

  return (
    <div className="space-y-6">
      {/* Personal info */}
      <div className="rounded-2xl border bg-card p-6 space-y-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Información personal
        </h2>

        <Field label="Nombre completo o comercial *">
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Tu nombre o el de tu empresa"
            className={inputCls}
          />
        </Field>

        <Field label="Empresa / Marca">
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Nombre de tu empresa (opcional)"
            className={inputCls}
          />
        </Field>

        <Field label="Descripción / Bio" hint="Cuéntale a los demás sobre ti o tu empresa">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Breve descripción..."
            rows={3}
            className={inputCls + " resize-none"}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Ciudad">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Medellín"
              className={inputCls}
            />
          </Field>
          <Field label="País">
            <select value={country} onChange={(e) => setCountry(e.target.value)} className={inputCls}>
              {MARKETS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </Field>
        </div>
      </div>

      {/* Contact */}
      <div className="rounded-2xl border bg-card p-6 space-y-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Contacto
        </h2>

        <Field label="Correo de contacto">
          <input
            type="email"
            value={emailContact}
            onChange={(e) => setEmailContact(e.target.value)}
            placeholder="contacto@tuempresa.com"
            className={inputCls}
          />
        </Field>

        <Field label="WhatsApp" hint="Con código de país. Ej: +57 300 123 4567">
          <input
            type="tel"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="+57 300 123 4567"
            className={inputCls}
          />
        </Field>

        <Field label="Teléfono">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+57 4 123 4567"
            className={inputCls}
          />
        </Field>

        <Field label="Sitio web / Portafolio">
          <input
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://tuempresa.com"
            className={inputCls}
          />
        </Field>
      </div>

      {/* Roles */}
      <div className="rounded-2xl border bg-card p-6 space-y-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Tipo de cuenta
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Puedes pertenecer a varios tipos. Para quitar un tipo debes primero despublicar sus publicaciones activas.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {(Object.entries(ROLE_CONFIG) as [Role, typeof ROLE_CONFIG[Role]][]).map(([role, cfg]) => {
            const active = types.includes(role);
            const hasListings = listingCounts[role] > 0;
            const isOnlyRole = active && types.length === 1;
            const blocked = active && (hasListings || isOnlyRole);

            return (
              <button
                key={role}
                type="button"
                onClick={() => toggleRole(role)}
                disabled={blocked}
                title={
                  isOnlyRole
                    ? "Debes tener al menos un tipo de cuenta"
                    : hasListings && active
                    ? `Tienes ${listingCounts[role]} publicación(es) activa(s) como ${cfg.label}. Despublícalas primero.`
                    : undefined
                }
                className={cn(
                  "flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all duration-200",
                  active
                    ? `${cfg.border} bg-card ring-2 ${cfg.ring} shadow-sm`
                    : "border-border hover:border-border/80 hover:bg-muted/40",
                  blocked && "opacity-60 cursor-not-allowed"
                )}
              >
                <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", cfg.bg)}>
                  <cfg.Icon className={cn("h-5 w-5", cfg.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn("font-semibold", active ? "text-foreground" : "text-muted-foreground")}>
                    {cfg.label}
                  </p>
                  {blocked && hasListings && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {listingCounts[role]} publicación(es) activa(s) — despublícalas para quitar este tipo
                    </p>
                  )}
                </div>
                <div className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
                  active ? "border-transparent bg-primary" : "border-border"
                )}>
                  {active && (
                    blocked ? (
                      <Lock className="h-3 w-3 text-white" />
                    ) : (
                      <Check className="h-3 w-3 text-white" />
                    )
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Save */}
      <button
        type="button"
        onClick={handleSave}
        disabled={loading || !displayName.trim()}
        className={cn(
          linkButtonVariants({ size: "lg" }),
          "w-full h-11",
          (loading || !displayName.trim()) && "opacity-50 cursor-not-allowed"
        )}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Guardar cambios"}
      </button>
    </div>
  );
}
