"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { linkButtonVariants } from "@/components/ui/link-button";
import {
  SPACE_CATEGORIES,
  AGENCY_SERVICES,
  PRICE_PERIODS,
  MARKETS,
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
  location_city: string;
  location_state: string;
  location_country: string;
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

const textareaCls = inputCls + " resize-none";

export function PublishForm({ userId, profileType, defaultWhatsapp, defaultEmail }: PublishFormProps) {
  const router = useRouter();
  const steps = STEPS[profileType];
  const [step, setStep] = useState(0); // 0-indexed
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<FormData>({
    title: "",
    description: "",
    whatsapp: defaultWhatsapp ?? "",
    email_contact: defaultEmail ?? "",
    website_url: "",
    space_medium: "",
    space_type: "",
    location_city: "",
    location_state: "",
    location_country: "CO",
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
  });

  const set = (key: keyof FormData, value: FormData[keyof FormData]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleArr = (key: "services" | "specializations" | "coverage_areas", value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? (prev[key] as string[]).filter((v) => v !== value)
        : [...(prev[key] as string[]), value],
    }));
  };

  const canAdvance = (): boolean => {
    if (profileType === "space_owner") {
      if (step === 0) return !!form.space_type && !!form.space_medium;
      if (step === 1) return !!form.title.trim() && !!form.description.trim();
    }
    if (profileType === "agency") {
      if (step === 0) return !!form.title.trim() && form.services.length > 0;
      if (step === 1) return !!form.description.trim();
    }
    if (profileType === "advertiser") {
      if (step === 0) return !!form.space_type;
      if (step === 1) return !!form.title.trim() && !!form.description.trim();
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
    const payload = {
      user_id: userId,
      type: LISTING_TYPE[profileType],
      title: form.title.trim(),
      description: form.description.trim(),
      whatsapp: form.whatsapp.trim() || null,
      email_contact: form.email_contact.trim() || null,
      website_url: form.website_url.trim() || null,
      // Space fields
      space_type: form.space_type || null,
      space_medium: form.space_medium || null,
      location_city: form.location_city.trim() || null,
      location_state: form.location_state.trim() || null,
      location_country: form.location_country || "CO",
      is_remote: form.is_remote,
      audience_size: form.audience_size.trim() || null,
      availability: form.availability.trim() || null,
      price_min: form.price_min ? parseFloat(form.price_min) : null,
      price_max: form.price_max ? parseFloat(form.price_max) : null,
      price_period: form.price_period || null,
      // Agency fields
      services: form.services.length > 0 ? form.services : null,
      specializations: form.specializations.length > 0 ? form.specializations : null,
      coverage_areas: form.coverage_areas.length > 0 ? form.coverage_areas : null,
      price_text: form.price_text.trim() || null,
      // Advertiser fields
      industry: form.industry || null,
      status: "active",
    };

    const { data, error: insertError } = await supabase
      .from("listings")
      .insert(payload)
      .select("id")
      .single();

    if (insertError || !data) {
      setError("Error al publicar. Intenta de nuevo.");
      setLoading(false);
      return;
    }

    router.push(`/listing/${data.id}`);
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
                <Field label="Título" required>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => set("title", e.target.value)}
                    placeholder="Ej: Pantalla LED en estadio Monterrey"
                    maxLength={100}
                    className={inputCls}
                  />
                </Field>
                <Field label="Descripción" required hint="Dimensiones, horarios, condiciones, lo que sea relevante">
                  <textarea
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    placeholder="Detalla las características de tu espacio, ubicación exacta, condiciones de uso..."
                    rows={5}
                    className={textareaCls}
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
                <Field label="País">
                  <select value={form.location_country} onChange={(e) => set("location_country", e.target.value)} className={inputCls}>
                    {MARKETS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </select>
                </Field>
                <Field label="Audiencia estimada" hint="Ej: ~15,000 personas por evento">
                  <input type="text" value={form.audience_size} onChange={(e) => set("audience_size", e.target.value)} placeholder="~5,000 personas diarias" className={inputCls} />
                </Field>
                <Field label="Disponibilidad" hint="Ej: Disponible de lunes a viernes">
                  <input type="text" value={form.availability} onChange={(e) => set("availability", e.target.value)} placeholder="Disponible inmediatamente" className={inputCls} />
                </Field>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-foreground">Precio estimado</h2>
                <p className="text-sm text-muted-foreground">Opcional — puedes dejar libre para negociar directamente.</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Precio mínimo (USD)">
                    <input type="number" min="0" value={form.price_min} onChange={(e) => set("price_min", e.target.value)} placeholder="100" className={inputCls} />
                  </Field>
                  <Field label="Precio máximo (USD)">
                    <input type="number" min="0" value={form.price_max} onChange={(e) => set("price_max", e.target.value)} placeholder="500" className={inputCls} />
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
                <Field label="Nombre de la agencia o agente" required>
                  <input type="text" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Studio Creativo MKT" className={inputCls} />
                </Field>
                <Field label="Servicios" required>
                  <MultiChip options={AGENCY_SERVICES} selected={form.services} onToggle={(v) => toggleArr("services", v)} />
                </Field>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-foreground">Cuéntanos más</h2>
                <Field label="Descripción" required hint="Experiencia, enfoque, propuesta de valor">
                  <textarea value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Somos una agencia con 5 años de experiencia especializada en..." rows={5} className={textareaCls} />
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
                  <input type="text" value={form.price_text} onChange={(e) => set("price_text", e.target.value)} placeholder="Desde $500 USD/mes" className={inputCls} />
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
                <Field label="Tipo de espacio" required>
                  <div className="grid grid-cols-2 gap-2">
                    {SPACE_CATEGORIES.map((c) => (
                      <button key={c.value} type="button" onClick={() => set("space_type", c.value)}
                        className={cn("rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                          form.space_type === c.value ? "border-primary bg-primary/5 font-medium text-primary" : "border-border hover:border-primary/30"
                        )}>
                        {c.label}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-foreground">Describe lo que necesitas</h2>
                <Field label="Título" required>
                  <input type="text" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Busco espacio para campaña deportiva" className={inputCls} />
                </Field>
                <Field label="Descripción" required hint="Qué quieres anunciar, objetivo, contexto">
                  <textarea value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Somos una empresa de... y queremos publicitar..." rows={5} className={textareaCls} />
                </Field>
                <Field label="Industria / Sector">
                  <select value={form.industry} onChange={(e) => set("industry", e.target.value)} className={inputCls}>
                    <option value="">Seleccionar...</option>
                    {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
                  </select>
                </Field>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-foreground">Ubicación y presupuesto</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Ciudad donde quieres anunciar">
                    <input type="text" value={form.location_city} onChange={(e) => set("location_city", e.target.value)} placeholder="Medellín" className={inputCls} />
                  </Field>
                  <Field label="País">
                    <select value={form.location_country} onChange={(e) => set("location_country", e.target.value)} className={inputCls}>
                      {MARKETS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                    </select>
                  </Field>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Presupuesto mínimo (USD)">
                    <input type="number" min="0" value={form.price_min} onChange={(e) => set("price_min", e.target.value)} placeholder="100" className={inputCls} />
                  </Field>
                  <Field label="Presupuesto máximo (USD)">
                    <input type="number" min="0" value={form.price_max} onChange={(e) => set("price_max", e.target.value)} placeholder="1000" className={inputCls} />
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
            <h2 className="text-xl font-bold text-foreground">Datos de contacto</h2>
            <p className="text-sm text-muted-foreground">Necesitas al menos uno para que te puedan contactar.</p>
            <Field label="WhatsApp" hint='Incluye código de país. Ej: +57 300 123 4567'>
              <input type="tel" value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="+57 300 123 4567" className={inputCls} />
            </Field>
            <Field label="Correo electrónico">
              <input type="email" value={form.email_contact} onChange={(e) => set("email_contact", e.target.value)} placeholder="contacto@tuempresa.com" className={inputCls} />
            </Field>
            <Field label="Sitio web / portafolio" hint="Opcional">
              <input type="url" value={form.website_url} onChange={(e) => set("website_url", e.target.value)} placeholder="https://tuempresa.com" className={inputCls} />
            </Field>
          </div>
        )}

        {error && (
          <div className="mt-5 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex gap-3">
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
              "Publicar ahora"
            ) : (
              <>Siguiente <ArrowRight className="h-4 w-4" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
