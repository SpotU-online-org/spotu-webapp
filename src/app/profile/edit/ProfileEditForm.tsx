"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Megaphone, MapPin, Briefcase, Check, Loader2, AlertTriangle, Lock, Camera } from "lucide-react";
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
  avatar_url: string | null;
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
  const avatarInputRef = useRef<HTMLInputElement>(null);

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
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile.avatar_url ?? null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
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

  function handleAvatarFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast("La imagen no puede superar 2 MB.", "error");
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function uploadAvatar(): Promise<string | null> {
    if (!avatarFile) return avatarUrl;
    setAvatarUploading(true);
    const supabase = createClient();
    const ext = avatarFile.name.split(".").pop() ?? "jpg";
    const path = `${userId}/avatar-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("avatars").upload(path, avatarFile, { upsert: true });
    setAvatarUploading(false);
    if (error) {
      toast("No se pudo subir la imagen. Intenta de nuevo.", "error");
      return avatarUrl;
    }
    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
    setAvatarUrl(publicUrl);
    setAvatarFile(null);
    return publicUrl;
  }

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
    const uploadedAvatarUrl = await uploadAvatar();
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
        avatar_url: uploadedAvatarUrl,
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

  const displaySrc = avatarPreview ?? avatarUrl;
  const initials = (profile.display_name ?? displayName ?? "?")[0]?.toUpperCase() ?? "?";

  return (
    <div className="space-y-6">
      {/* Avatar */}
      <div className="rounded-2xl border bg-card p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          Foto de perfil
        </h2>
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => avatarInputRef.current?.click()}
            className="relative group shrink-0 h-20 w-20 rounded-full overflow-hidden border-2 border-border focus:outline-none focus:ring-2 focus:ring-ring/50"
          >
            {displaySrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={displaySrc} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-primary/10 text-2xl font-bold text-primary">
                {initials}
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
              <Camera className="h-5 w-5 text-white" />
            </div>
          </button>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Haz clic en la imagen para cambiarla.</p>
            <p className="text-xs">JPG, PNG o WebP · Máximo 2 MB</p>
            {avatarFile && (
              <p className="text-xs text-primary font-medium">Nueva imagen seleccionada — se guardará al hacer clic en "Guardar cambios".</p>
            )}
          </div>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleAvatarFileChange}
          />
        </div>
      </div>

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
        disabled={loading || avatarUploading || !displayName.trim()}
        className={cn(
          linkButtonVariants({ size: "lg" }),
          "w-full h-11",
          (loading || avatarUploading || !displayName.trim()) && "opacity-50 cursor-not-allowed"
        )}
      >
        {(loading || avatarUploading) ? <Loader2 className="h-4 w-4 animate-spin" /> : "Guardar cambios"}
      </button>
    </div>
  );
}
