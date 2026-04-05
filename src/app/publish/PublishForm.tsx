"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Loader2, Check, ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { linkButtonVariants } from "@/components/ui/link-button";
import {
  SPACE_CATEGORIES,
  AGENCY_SERVICES,
  PRICE_PERIODS,
  MARKETS,
  ALL_COUNTRIES,
} from "@/constants";

type ProfileType = "advertiser" | "space_owner" | "agency";

type PublishFormProps = {
  userId: string;
  profileType: ProfileType;
  defaultWhatsapp?: string | null;
  defaultEmail?: string | null;
};

type FormData = {
  // Shared
  title: string;
  description: string;
  whatsapp: string;
  email_contact: string;
  website_url: string;
  // Space
  space_medium: "physical" | "digital" | "";
  space_type: string;
  space_types: string[]; // multi-select for advertisers
  location_city: string;
  location_state: string;
  location_countries: string[]; // up to 10 countries
  is_remote: boolean;
  audience_size: string;
  availability: string;
  price_min: string;
  price_max: string;
  price_period: string;
  // Agency
  services: string[];
  specializations: string[];
  coverage_areas: string[];
  price_text: string;
  // Advertiser
  industry: string;
  // Audience
  audience_demographics: string;
  target_audience: string;
  // Publishing
  publish_status: "active" | "paused";
  // Keywords
  tags: string[];
};

const LISTING_TYPE: Record<ProfileType, "want_to_advertise" | "have_space" | "offer_service"> = {
  advertiser: "want_to_advertise",
  space_owner: "have_space",
  agency: "offer_service",
};

const STEPS: Record<ProfileType, { label: string }[]> = {
  space_owner: [
    { label: "Tipo de espacio" },
    { label: "Descripción" },
    { label: "Ubicación" },
    { label: "Precio" },
    { label: "Contacto" },
  ],
  agency: [
    { label: "Servicios" },
    { label: "Descripción" },
    { label: "Mercados" },
    { label: "Contacto" },
  ],
  advertiser: [
    { label: "Qué buscas" },
    { label: "Descripción" },
    { label: "Presupuesto" },
    { label: "Contacto" },
  ],
};

const INDUSTRIES = [
  "Deportes", "Gastronomía", "Tecnología", "Moda", "Salud",
  "Educación", "Inmobiliario", "Entretenimiento", "Servicios", "Otro",
];

function MultiChip({
  options,
  selected,
  onToggle,
}: {
  options: readonly { value: string; label: string }[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = selected.includes(o.value);
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onToggle(o.value)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background hover:border-primary/40 hover:bg-primary/5 text-foreground"
            )}
          >
            {active && <Check className="mr-1.5 inline h-3 w-3" />}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function TagInput({
  tags,
  onAdd,
  onRemove,
}: {
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
}) {
  const [input, setInput] = useState("");

  function commit() {
    const clean = input.trim().toLowerCase().replace(/,/g, "").slice(0, 30);
    if (clean.length > 1) onAdd(clean);
    setInput("");
  }

  return (
    <div className="space-y-2">
      {tags.length < 5 && (
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              commit();
            }
          }}
          onBlur={commit}
          placeholder="Ej: vallas, estadio, Monterrey..."
          maxLength={32}
          className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring transition-colors"
        />
      )}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
              {tag}
              <button type="button" onClick={() => onRemove(tag)} className="hover:text-destructive transition-colors">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  required,
  children,
  hint,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring transition-colors";

function CountryMultiSelect({
  selected,
  onToggle,
  max,
}: {
  selected: string[];
  onToggle: (v: string) => void;
  max: number;
}) {
  const [search, setSearch] = useState("");
  const filtered = search.trim()
    ? ALL_COUNTRIES.filter((c) => c.label.toLowerCase().includes(search.toLowerCase()))
    : ALL_COUNTRIES;

  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">
        País / Países
        <span className="ml-1.5 text-xs font-normal text-muted-foreground">(máx. {max})</span>
      </label>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {selected.map((code) => {
            const label = ALL_COUNTRIES.find((c) => c.value === code)?.label ?? code;
            return (
              <button
                key={code}
                type="button"
                onClick={() => onToggle(code)}
                className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
              >
                {label} ×
              </button>
            );
          })}
        </div>
      )}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar país..."
        className={inputCls + " mb-2"}
      />
      <div className="max-h-44 overflow-y-auto rounded-lg border bg-background">
        {filtered.length === 0 && (
          <p className="px-3 py-2 text-sm text-muted-foreground">Sin resultados</p>
        )}
        {filtered.map((c) => {
          const active = selected.includes(c.value);
          const disabled = !active && selected.length >= max;
          return (
            <button
              key={c.value}
              type="button"
              onClick={() => onToggle(c.value)}
              disabled={disabled}
              className={cn(
                "flex w-full items-center justify-between px-3 py-2 text-sm transition-colors",
                active ? "bg-primary/5 text-primary font-medium" : "hover:bg-muted text-foreground",
                disabled && "opacity-40 cursor-not-allowed"
              )}
            >
              {c.label}
              {active && <Check className="h-3.5 w-3.5 shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const textareaCls = inputCls + " resize-none";

export function PublishForm({ userId, profileType, defaultWhatsapp, defaultEmail }: PublishFormProps) {
  const router = useRouter();
  const steps = STEPS[profileType];
  const [step, setStep] = useState(0); // 0-indexed
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormData>({
    title: "",
    description: "",
    whatsapp: defaultWhatsapp ?? "",
    email_contact: defaultEmail ?? "",
    website_url: "",
    space_medium: "",
    space_type: "",
    space_types: [],
    location_city: "",
    location_state: "",
    location_countries: [],
    is_remote: false,
    audience_size: "",
    availability: "",
    price_min: "",
    price_max: "",
    price_period: "",
    services: [],
    specializations: [],
    coverage_areas: [],
    price_text: "",
    industry: "",
    audience_demographics: "",
    target_audience: "",
    publish_status: "active",
    tags: [],
  });

  const set = (key: keyof FormData, value: FormData[keyof FormData]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
  const MAX_IMAGES = 5;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const remaining = MAX_IMAGES - selectedFiles.length;
    if (remaining <= 0) return;

    const tooBig = files.filter((f) => f.size > MAX_FILE_SIZE);
    if (tooBig.length > 0) {
      setError(`Cada imagen debe pesar menos de 5 MB. ${tooBig.map((f) => f.name).join(", ")} ${tooBig.length === 1 ? "es" : "son"} demasiado pesada(s).`);
    }

    const allowed = files
      .filter((f) => f.type.startsWith("image/") && f.size <= MAX_FILE_SIZE)
      .slice(0, remaining);
    if (allowed.length === 0) return;

    setSelectedFiles((prev) => [...prev, ...allowed].slice(0, MAX_IMAGES));
    allowed.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFilePreviews((prev) => [...prev, ev.target?.result as string].slice(0, MAX_IMAGES));
      };
      reader.readAsDataURL(file);
    });
  }

  function removeFile(index: number) {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setFilePreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function uploadImages(): Promise<string[]> {
    if (selectedFiles.length === 0) return [];
    const supabase = createClient();
    const urls: string[] = [];
    for (const file of selectedFiles) {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("listing-images")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (uploadError) {
        console.error("Image upload error:", uploadError.message);
        continue;
      }
      const { data } = supabase.storage.from("listing-images").getPublicUrl(path);
      urls.push(data.publicUrl);
    }
    return urls;
  }

  const MAX_COUNTRIES = 10;

  const toggleArr = (key: "services" | "specializations" | "coverage_areas" | "space_types" | "location_countries", value: string) => {
    setForm((prev) => {
      const arr = prev[key] as string[];
      if (arr.includes(value)) return { ...prev, [key]: arr.filter((v) => v !== value) };
      // Enforce max 10 for countries
      if (key === "location_countries" && arr.length >= MAX_COUNTRIES) return prev;
      return { ...prev, [key]: [...arr, value] };
    });
  };

  const canAdvance = (): boolean => {
    if (profileType === "space_owner") {
      if (step === 0) return !!form.space_type && !!form.space_medium;
      if (step === 1) return form.title.trim().length >= 3 && form.description.trim().length >= 20;
    }
    if (profileType === "agency") {
      if (step === 0) return form.title.trim().length >= 3 && form.services.length > 0;
      if (step === 1) return form.description.trim().length >= 20;
    }
    if (profileType === "advertiser") {
      if (step === 0) return form.space_types.length > 0;
      if (step === 1) return form.title.trim().length >= 3 && form.description.trim().length >= 20;
    }
    return true;
  };

  const canSubmit = (): boolean => {
    return !!(form.whatsapp.trim() || form.email_contact.trim());
  };

  async function handleSubmit() {
    if (!canSubmit()) {
      setError("Debes proporcionar al menos un método de contacto (WhatsApp o correo).");
      return;
    }
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const imageUrls = await uploadImages();
    const listingType = LISTING_TYPE[profileType];
    const payload = {
      user_id: userId,
      type: listingType,
      title: form.title.trim(),
      description: form.description.trim(),
      whatsapp: form.whatsapp.trim() || null,
      email_contact: form.email_contact.trim() || null,
      website_url: form.website_url.trim() || null,
      // Space fields
      space_type: profileType === "advertiser"
        ? (form.space_types[0] || null)
        : (form.space_type || null),
      space_medium: form.space_medium || null,
      location_city: form.location_city.trim() || null,
      location_state: form.location_state.trim() || null,
      location_country: form.location_countries[0] ?? null,
      location_countries: form.location_countries.length > 0 ? form.location_countries : null,
      is_remote: form.is_remote,
      audience_size: form.audience_size.trim() || null,
      availability: form.availability.trim() || null,
      price_min: form.price_min ? parseInt(form.price_min, 10) : null,
      price_max: form.price_max ? parseInt(form.price_max, 10) : null,
      price_period: form.price_period || null,
      // Agency/advertiser fields
      services: profileType === "advertiser"
        ? (form.space_types.length > 1 ? form.space_types : null)
        : (form.services.length > 0 ? form.services : null),
      specializations: form.specializations.length > 0 ? form.specializations : null,
      coverage_areas: form.coverage_areas.length > 0 ? form.coverage_areas : null,
      price_text: form.price_text.trim() || null,
      industry: form.industry || null,
      audience_demographics: form.audience_demographics.trim() || null,
      target_audience: form.target_audience.trim() || null,
      images: imageUrls.length > 0 ? imageUrls : null,
      tags: form.tags.length > 0 ? form.tags : null,
      // If user chose paused, save as paused (no billing); if active, billing flow handles it
      status: form.publish_status === "paused" ? "paused" : "active",
      billing_status: form.publish_status === "paused" ? "trial" : "trial",
    };

    const { data: inserted, error: insertError } = await supabase
      .from("listings")
      .insert(payload)
      .select("id")
      .single();

    if (insertError || !inserted) {
      setError("Error al publicar. Intenta de nuevo.");
      setLoading(false);
      return;
    }

    // If user chose to publish as paused — just go to dashboard
    if (form.publish_status === "paused") {
      router.push("/dashboard?published=1");
      return;
    }

    // If user chose to publish as active — initiate billing checkout
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId: inserted.id, mode: "subscription" }),
    });
    const data = await res.json();

    if (data.pioneer) {
      // Pioneer users skip payment — listing already set active by checkout API
      router.push("/dashboard?published=1");
      return;
    }

    if (data.url) {
      window.location.href = data.url;
      return;
    }

    // Fallback — checkout failed but listing was created
    router.push("/dashboard?published=1");
  }

  const isLastStep = step === steps.length - 1;

  return (
    <div className="w-full max-w-xl">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center gap-1.5">
          {steps.map((s, i) => (
            <div key={s.label} className="flex items-center gap-1.5">
              <div className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-colors",
                i < step ? "bg-primary/20 text-primary" :
                i === step ? "bg-primary text-primary-foreground" :
                "bg-muted text-muted-foreground"
              )}>
                {i < step ? <Check className="h-3 w-3" /> : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={cn("h-px flex-1 w-6", i < step ? "bg-primary/40" : "bg-border")} />
              )}
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Paso {step + 1} de {steps.length} — <span className="font-medium text-foreground">{steps[step].label}</span>
        </p>
      </div>

      <div className="rounded-2xl border bg-card p-8 shadow-sm">
        {/* ──────── SPACE OWNER STEPS ──────── */}
        {profileType === "space_owner" && (
          <>
            {step === 0 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-foreground">¿Qué tipo de espacio tienes?</h2>
                <Field label="Medio" required>
                  <div className="flex gap-3">
                    {(["physical", "digital"] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => set("space_medium", m)}
                        className={cn(
                          "flex-1 rounded-xl border-2 p-3 text-sm font-medium transition-colors",
                          form.space_medium === m
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border hover:border-primary/30"
                        )}
                      >
                        {m === "physical" ? "🏙️ Físico" : "💻 Digital"}
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label="Categoría" required>
                  <div className="grid grid-cols-2 gap-2">
                    {SPACE_CATEGORIES.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => set("space_type", c.value)}
                        className={cn(
                          "rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                          form.space_type === c.value
                            ? "border-primary bg-primary/5 font-medium text-primary"
                            : "border-border hover:border-primary/30"
                        )}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-foreground">Describe tu espacio</h2>
                <Field label="Título" required hint={form.title.trim().length < 3 && form.title.length > 0 ? `Mínimo 3 caracteres (${form.title.trim().length}/3)` : undefined}>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => set("title", e.target.value)}
                    placeholder="Ej: Pantalla LED en estadio Monterrey"
                    maxLength={100}
                    className={cn(inputCls, form.title.trim().length > 0 && form.title.trim().length < 3 && "border-destructive/50 focus:ring-destructive/30")}
                  />
                </Field>
                <Field label="Descripción" required hint={form.description.trim().length < 20 && form.description.length > 0 ? `Mínimo 20 caracteres (${form.description.trim().length}/20)` : `Dimensiones, horarios, condiciones, lo que sea relevante (${form.description.length}/1500)`}>
                  <textarea
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    placeholder="Detalla las características de tu espacio, ubicación exacta, condiciones de uso..."
                    rows={5}
                    maxLength={1500}
                    className={cn(textareaCls, form.description.trim().length > 0 && form.description.trim().length < 20 && "border-destructive/50 focus:ring-destructive/30")}
                  />
                </Field>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-foreground">Ubicación y disponibilidad</h2>
                <div className="flex items-center gap-2">
                  <input
                    id="is_remote"
                    type="checkbox"
                    checked={form.is_remote}
                    onChange={(e) => set("is_remote", e.target.checked)}
                    className="h-4 w-4 rounded border-border accent-primary"
                  />
                  <label htmlFor="is_remote" className="text-sm text-foreground">
                    Espacio digital (sin ubicación física fija)
                  </label>
                </div>
                {!form.is_remote && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Ciudad">
                      <input type="text" value={form.location_city} onChange={(e) => set("location_city", e.target.value)} placeholder="Monterrey" className={inputCls} />
                    </Field>
                    <Field label="Estado / Departamento">
                      <input type="text" value={form.location_state} onChange={(e) => set("location_state", e.target.value)} placeholder="Nuevo León" className={inputCls} />
                    </Field>
                  </div>
                )}
                <CountryMultiSelect
                  selected={form.location_countries}
                  onToggle={(v) => toggleArr("location_countries", v)}
                  max={MAX_COUNTRIES}
                />
                <Field label="Audiencia estimada" hint="Ej: ~15,000 personas por evento">
                  <input type="text" value={form.audience_size} onChange={(e) => set("audience_size", e.target.value)} placeholder="~5,000 personas diarias" maxLength={150} className={inputCls} />
                </Field>
                <Field label="Perfil del público" hint="Opcional — rango de edad, intereses, características principales">
                  <input type="text" value={form.audience_demographics} onChange={(e) => set("audience_demographics", e.target.value)} placeholder="Ej: Jóvenes 18-35 años, afición al deporte" maxLength={200} className={inputCls} />
                </Field>
                <Field label="Disponibilidad" hint="Ej: Disponible de lunes a viernes">
                  <input type="text" value={form.availability} onChange={(e) => set("availability", e.target.value)} placeholder="Disponible inmediatamente" maxLength={150} className={inputCls} />
                </Field>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-foreground">Precio estimado</h2>
                <p className="text-sm text-muted-foreground">Opcional — puedes dejar libre para negociar directamente.</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Precio mínimo (USD)">
                    <input type="number" min="0" step="1" value={form.price_min} onChange={(e) => set("price_min", e.target.value)} placeholder="100" className={inputCls} />
                  </Field>
                  <Field label="Precio máximo (USD)">
                    <input type="number" min="0" step="1" value={form.price_max} onChange={(e) => set("price_max", e.target.value)} placeholder="500" className={inputCls} />
                  </Field>
                </div>
                <Field label="Período">
                  <select value={form.price_period} onChange={(e) => set("price_period", e.target.value)} className={inputCls}>
                    <option value="">Seleccionar...</option>
                    {PRICE_PERIODS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </Field>
              </div>
            )}
          </>
        )}

        {/* ──────── AGENCY STEPS ──────── */}
        {profileType === "agency" && (
          <>
            {step === 0 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-foreground">¿Qué servicios ofreces?</h2>
                <Field label="Nombre de la agencia o agente" required hint={form.title.trim().length > 0 && form.title.trim().length < 3 ? `Mínimo 3 caracteres (${form.title.trim().length}/3)` : undefined}>
                  <input type="text" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Studio Creativo MKT" maxLength={100} className={cn(inputCls, form.title.trim().length > 0 && form.title.trim().length < 3 && "border-destructive/50")} />
                </Field>
                <Field label="Servicios" required>
                  <MultiChip options={AGENCY_SERVICES} selected={form.services} onToggle={(v) => toggleArr("services", v)} />
                </Field>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-foreground">Cuéntanos más</h2>
                <Field label="Descripción" required hint={form.description.trim().length > 0 && form.description.trim().length < 20 ? `Mínimo 20 caracteres (${form.description.trim().length}/20)` : `Experiencia, enfoque, propuesta de valor (${form.description.length}/1500)`}>
                  <textarea value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Somos una agencia con 5 años de experiencia especializada en..." rows={5} maxLength={1500} className={cn(textareaCls, form.description.trim().length > 0 && form.description.trim().length < 20 && "border-destructive/50")} />
                </Field>
                <Field label="Industrias de especialización" hint="Opcional">
                  <div className="flex flex-wrap gap-2">
                    {INDUSTRIES.map((ind) => (
                      <button
                        key={ind}
                        type="button"
                        onClick={() => toggleArr("specializations", ind)}
                        className={cn(
                          "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                          form.specializations.includes(ind)
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:border-primary/40 text-foreground"
                        )}
                      >
                        {form.specializations.includes(ind) && <Check className="mr-1.5 inline h-3 w-3" />}
                        {ind}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-foreground">Mercados y precio</h2>
                <Field label="¿Dónde operas?" hint="Selecciona todos los mercados">
                  <MultiChip
                    options={MARKETS}
                    selected={form.coverage_areas}
                    onToggle={(v) => toggleArr("coverage_areas", v)}
                  />
                </Field>
                <div className="flex items-center gap-2">
                  <input id="is_remote2" type="checkbox" checked={form.is_remote} onChange={(e) => set("is_remote", e.target.checked)} className="h-4 w-4 rounded border-border accent-primary" />
                  <label htmlFor="is_remote2" className="text-sm text-foreground">Trabajo de forma remota / 100% digital</label>
                </div>
                <Field label="Precio orientativo" hint='Ej: "Desde $500 USD/mes" o "Cotización a medida"'>
                  <input type="text" value={form.price_text} onChange={(e) => set("price_text", e.target.value)} placeholder="Desde $500 USD/mes" maxLength={100} className={inputCls} />
                </Field>
              </div>
            )}
          </>
        )}

        {/* ──────── ADVERTISER STEPS ──────── */}
        {profileType === "advertiser" && (
          <>
            {step === 0 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-foreground">¿Qué tipo de publicidad buscas?</h2>
                <Field label="Tipos de espacio" required hint="Puedes seleccionar varios">
                  <div className="grid grid-cols-2 gap-2">
                    {SPACE_CATEGORIES.map((c) => {
                      const active = form.space_types.includes(c.value);
                      return (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => toggleArr("space_types", c.value)}
                          className={cn(
                            "flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                            active ? "border-primary bg-primary/5 font-medium text-primary" : "border-border hover:border-primary/30"
                          )}
                        >
                          {active && <Check className="h-3.5 w-3.5 shrink-0" />}
                          {c.label}
                        </button>
                      );
                    })}
                  </div>
                </Field>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-foreground">Describe lo que necesitas</h2>
                <Field label="Título" required hint={form.title.trim().length > 0 && form.title.trim().length < 3 ? `Mínimo 3 caracteres (${form.title.trim().length}/3)` : undefined}>
                  <input type="text" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Busco espacio para campaña deportiva" maxLength={100} className={cn(inputCls, form.title.trim().length > 0 && form.title.trim().length < 3 && "border-destructive/50")} />
                </Field>
                <Field label="Descripción" required hint={form.description.trim().length > 0 && form.description.trim().length < 20 ? `Mínimo 20 caracteres (${form.description.trim().length}/20)` : `Qué quieres anunciar, objetivo, contexto (${form.description.length}/1500)`}>
                  <textarea value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Somos una empresa de... y queremos publicitar..." rows={5} maxLength={1500} className={cn(textareaCls, form.description.trim().length > 0 && form.description.trim().length < 20 && "border-destructive/50")} />
                </Field>
                <Field label="Industria / Sector">
                  <select value={form.industry} onChange={(e) => set("industry", e.target.value)} className={inputCls}>
                    <option value="">Seleccionar...</option>
                    {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
                  </select>
                </Field>
                <Field label="Público objetivo" hint="Opcional — rango de edad, intereses, perfil del cliente que quieres alcanzar">
                  <input type="text" value={form.target_audience} onChange={(e) => set("target_audience", e.target.value)} placeholder="Ej: Hombres 25-45 años, nivel socioeconómico medio-alto" maxLength={200} className={inputCls} />
                </Field>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-foreground">Ubicación y presupuesto</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Ciudad donde quieres anunciar">
                    <input type="text" value={form.location_city} onChange={(e) => set("location_city", e.target.value)} placeholder="Medellín" maxLength={100} className={inputCls} />
                  </Field>
                  <CountryMultiSelect
                    selected={form.location_countries}
                    onToggle={(v) => toggleArr("location_countries", v)}
                    max={MAX_COUNTRIES}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Presupuesto mínimo (USD)">
                    <input type="number" min="0" step="1" value={form.price_min} onChange={(e) => set("price_min", e.target.value)} placeholder="100" className={inputCls} />
                  </Field>
                  <Field label="Presupuesto máximo (USD)">
                    <input type="number" min="0" step="1" value={form.price_max} onChange={(e) => set("price_max", e.target.value)} placeholder="1000" className={inputCls} />
                  </Field>
                </div>
                <Field label="Período">
                  <select value={form.price_period} onChange={(e) => set("price_period", e.target.value)} className={inputCls}>
                    <option value="">Seleccionar...</option>
                    {PRICE_PERIODS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </Field>
              </div>
            )}
          </>
        )}

        {/* ──────── CONTACT STEP (last step, all types) ──────── */}
        {step === steps.length - 1 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-foreground">Imágenes y contacto</h2>

            {/* Images */}
            <Field
              label="Imágenes"
              hint={
                profileType === "space_owner"
                  ? "Fotos del espacio, mockups, etc. Máx. 5 imágenes · 5 MB c/u."
                  : profileType === "agency"
                  ? "Logo, portafolio o casos de éxito. Máx. 5 imágenes · 5 MB c/u."
                  : "Logo o material de tu marca. Máx. 5 imágenes · 5 MB c/u. Opcional."
              }
            >
              <div className="space-y-3">
                {/* Previews */}
                {filePreviews.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {filePreviews.map((src, i) => (
                      <div key={i} className="relative h-20 w-20 overflow-hidden rounded-lg border bg-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt={`Imagen ${i + 1}`} className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {selectedFiles.length < 5 && (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border py-6 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                    >
                      <ImagePlus className="h-5 w-5" />
                      {selectedFiles.length === 0 ? "Agregar imágenes" : `Agregar más (${selectedFiles.length}/5)`}
                    </button>
                  </>
                )}
              </div>
            </Field>

            <div className="border-t pt-4">
              <p className="mb-4 text-sm font-medium text-foreground">Datos de contacto</p>
              <p className="mb-4 text-xs text-muted-foreground">Necesitas al menos uno para que te puedan contactar.</p>
            </div>

            <Field label="WhatsApp" hint="Incluye código de país. Ej: +57 300 123 4567">
              <input type="tel" value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="+57 300 123 4567" maxLength={20} className={inputCls} />
            </Field>
            <Field label="Correo electrónico">
              <input type="email" value={form.email_contact} onChange={(e) => set("email_contact", e.target.value)} placeholder="contacto@tuempresa.com" maxLength={100} className={inputCls} />
            </Field>
            <Field label="Sitio web / portafolio" hint="Opcional">
              <input type="url" value={form.website_url} onChange={(e) => set("website_url", e.target.value)} placeholder="https://tuempresa.com" maxLength={200} className={inputCls} />
            </Field>

            <Field
              label="Palabras clave"
              hint={`Máximo 5 palabras clave para que te encuentren en el buscador. Escribe y presiona Enter o coma. (${form.tags.length}/5)`}
            >
              <TagInput
                tags={form.tags}
                onAdd={(tag) => {
                  if (form.tags.length < 5 && !form.tags.includes(tag)) {
                    set("tags", [...form.tags, tag]);
                  }
                }}
                onRemove={(tag) => set("tags", form.tags.filter((t) => t !== tag))}
              />
            </Field>
          </div>
        )}

        {error && (
          <div className="mt-5 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Publish status toggle — only on last step */}
        {isLastStep && (
          <div className="mt-6 rounded-xl border bg-muted/40 p-4">
            <p className="mb-3 text-sm font-medium text-foreground">¿Cuándo publicar?</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => set("publish_status", "active")}
                className={cn(
                  "flex-1 rounded-lg border-2 p-3 text-sm font-medium transition-colors text-left",
                  form.publish_status === "active"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:border-primary/30 text-foreground"
                )}
              >
                <span className="block font-semibold">Publicar activa</span>
                <span className="block text-xs mt-0.5 opacity-75">Visible de inmediato. El periodo de facturación inicia ahora.</span>
              </button>
              <button
                type="button"
                onClick={() => set("publish_status", "paused")}
                className={cn(
                  "flex-1 rounded-lg border-2 p-3 text-sm font-medium transition-colors text-left",
                  form.publish_status === "paused"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:border-primary/30 text-foreground"
                )}
              >
                <span className="block font-semibold">Guardar en pausa</span>
                <span className="block text-xs mt-0.5 opacity-75">Puedes activarla luego desde tu dashboard.</span>
              </button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-6 flex gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={() => { setStep((s) => s - 1); setError(null); }}
              className={cn(linkButtonVariants({ variant: "outline", size: "lg" }), "gap-2")}
            >
              <ArrowLeft className="h-4 w-4" /> Atrás
            </button>
          )}

          <button
            type="button"
            onClick={isLastStep ? handleSubmit : () => setStep((s) => s + 1)}
            disabled={isLastStep ? (!canSubmit() || loading) : !canAdvance()}
            className={cn(
              linkButtonVariants({ size: "lg" }),
              "flex-1 gap-2",
              (isLastStep ? (!canSubmit() || loading) : !canAdvance()) && "opacity-50 cursor-not-allowed"
            )}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isLastStep ? (
              form.publish_status === "paused" ? "Guardar publicación" : "Publicar ahora"
            ) : (
              <>Siguiente <ArrowRight className="h-4 w-4" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
