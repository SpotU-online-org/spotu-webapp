"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Megaphone, MapPin, Briefcase, Check, Loader2, AlertTriangle, Lock, Camera, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { linkButtonVariants } from "@/components/ui/link-button";
import { ALL_COUNTRIES } from "@/constants";
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

const COUNTRY_CODES = [
  { code: "+57", label: "🇨🇴 +57 Colombia" },
  { code: "+52", label: "🇲🇽 +52 México" },
  { code: "+1", label: "🇺🇸 +1 USA / Canadá" },
  { code: "+54", label: "🇦🇷 +54 Argentina" },
  { code: "+56", label: "🇨🇱 +56 Chile" },
  { code: "+51", label: "🇵🇪 +51 Perú" },
  { code: "+58", label: "🇻🇪 +58 Venezuela" },
  { code: "+593", label: "🇪🇨 +593 Ecuador" },
  { code: "+502", label: "🇬🇹 +502 Guatemala" },
  { code: "+503", label: "🇸🇻 +503 El Salvador" },
  { code: "+504", label: "🇭🇳 +504 Honduras" },
  { code: "+505", label: "🇳🇮 +505 Nicaragua" },
  { code: "+506", label: "🇨🇷 +506 Costa Rica" },
  { code: "+507", label: "🇵🇦 +507 Panamá" },
  { code: "+591", label: "🇧🇴 +591 Bolivia" },
  { code: "+595", label: "🇵🇾 +595 Paraguay" },
  { code: "+598", label: "🇺🇾 +598 Uruguay" },
  { code: "+34", label: "🇪🇸 +34 España" },
  { code: "+55", label: "🇧🇷 +55 Brasil" },
];

/** Split a full phone string (e.g. "+57 300 123 4567") into [code, number] */
function splitPhone(full: string): [string, string] {
  const match = COUNTRY_CODES.find((c) => full.startsWith(c.code));
  if (match) return [match.code, full.slice(match.code.length).trim()];
  return ["+57", full];
}

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
  const [whatsappCode, setWhatsappCode] = useState(() => splitPhone(profile.whatsapp ?? "")[0]);
  const [whatsappNumber, setWhatsappNumber] = useState(() => splitPhone(profile.whatsapp ?? "")[1]);
  const [phoneCode, setPhoneCode] = useState(() => splitPhone(profile.phone ?? "")[0]);
  const [phoneNumber, setPhoneNumber] = useState(() => splitPhone(profile.phone ?? "")[1]);
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
        phone: phoneNumber.trim() ? `${phoneCode} ${phoneNumber.trim()}` : null,
        whatsapp: whatsappNumber.trim() ? `${whatsappCode} ${whatsappNumber.trim()}` : null,
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
              <option value="">Selecciona un país</option>
              {ALL_COUNTRIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
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

        <Field label="WhatsApp">
          <div className="flex gap-2">
            <select
              value={whatsappCode}
              onChange={(e) => setWhatsappCode(e.target.value)}
              className="rounded-lg border bg-background px-2 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring transition-colors shrink-0"
            >
              {COUNTRY_CODES.map((c) => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
            <input
              type="tel"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="300 123 4567"
              className={inputCls}
            />
          </div>
        </Field>

        <Field label="Teléfono" hint="Este número se usa para llamadas">
          <div className="flex gap-2">
            <select
              value={phoneCode}
              onChange={(e) => setPhoneCode(e.target.value)}
              className="rounded-lg border bg-background px-2 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring transition-colors shrink-0"
            >
              {COUNTRY_CODES.map((c) => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="4 123 4567"
              className={inputCls}
            />
          </div>
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

      {/* Danger zone */}
      <DeleteAccountSection userId={userId} />
    </div>
  );
}

function DeleteAccountSection({ userId }: { userId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const CONFIRMATION_WORD = "ELIMINAR";

  async function handleDelete() {
    if (confirm !== CONFIRMATION_WORD) return;
    setLoading(true);
    try {
      const res = await fetch("/api/account/delete", { method: "DELETE" });
      if (!res.ok) throw new Error("server error");
      // Sign out locally and redirect to home
      const { createClient } = await import("@/lib/supabase/client");
      await createClient().auth.signOut();
      router.push("/");
    } catch {
      toast("No se pudo eliminar la cuenta. Contacta a admin@spotu.online.", "error");
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 space-y-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 shrink-0 text-destructive mt-0.5" />
        <div>
          <h2 className="text-sm font-semibold text-destructive">Eliminar cuenta</h2>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            Esta acción eliminará permanentemente tu cuenta, todas tus publicaciones, favoritos e interacciones.
            No se puede deshacer. Las suscripciones activas en Stripe deberán cancelarse desde el portal de suscripciones.
          </p>
        </div>
      </div>

      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-lg border border-destructive/40 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          Eliminar mi cuenta
        </button>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-foreground font-medium">
            Escribe <span className="font-mono font-bold">{CONFIRMATION_WORD}</span> para confirmar:
          </p>
          <input
            type="text"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder={CONFIRMATION_WORD}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-destructive/40 transition-colors"
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => { setOpen(false); setConfirm(""); }}
              className="flex-1 rounded-lg border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={confirm !== CONFIRMATION_WORD || loading}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white bg-destructive hover:bg-destructive/90 transition-colors",
                (confirm !== CONFIRMATION_WORD || loading) && "opacity-50 cursor-not-allowed"
              )}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Eliminar definitivamente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
