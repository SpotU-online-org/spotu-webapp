"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, X, ImagePlus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { linkButtonVariants } from "@/components/ui/link-button";
import { SPACE_CATEGORIES, AGENCY_SERVICES, PRICE_PERIODS, MARKETS, ALL_COUNTRIES } from "@/constants";
import { useToast } from "@/components/ui/toast";

const INDUSTRIES = [
  "Deportes", "Gastronomía", "Tecnología", "Moda", "Salud",
  "Educación", "Inmobiliario", "Entretenimiento", "Servicios", "Otro",
];

const inputCls =
  "w-full rounded-lg border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring transition-colors";

const MAX_COUNTRIES = 10;

function CountryMultiSelect({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (v: string) => void;
}) {
  const [search, setSearch] = useState("");
  const filtered = search.trim()
    ? ALL_COUNTRIES.filter((c) => c.label.toLowerCase().includes(search.toLowerCase()))
    : ALL_COUNTRIES;

  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">
        País / Países
        <span className="ml-1.5 text-xs font-normal text-muted-foreground">(máx. {MAX_COUNTRIES})</span>
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
          const disabled = !active && selected.length >= MAX_COUNTRIES;
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

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border bg-card p-6 space-y-5">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{title}</h2>
      {children}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function EditListingForm({ listing }: { listing: Record<string, any> }) {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const type = listing.type as string;

  const [title, setTitle] = useState<string>(listing.title ?? "");
  const [description, setDescription] = useState<string>(listing.description ?? "");
  const [spaceType, setSpaceType] = useState<string>(listing.space_type ?? "");
  const [spaceMedium, setSpaceMedium] = useState<string>(listing.space_medium ?? "");
  const [locationCity, setLocationCity] = useState<string>(listing.location_city ?? "");
  const [locationState, setLocationState] = useState<string>(listing.location_state ?? "");
  const [locationCountries, setLocationCountries] = useState<string[]>(
    listing.location_countries?.length > 0
      ? listing.location_countries
      : listing.location_country ? [listing.location_country] : []
  );
  const [isRemote, setIsRemote] = useState<boolean>(listing.is_remote ?? false);
  const [audienceSize, setAudienceSize] = useState<string>(listing.audience_size ?? "");
  const [availability, setAvailability] = useState<string>(listing.availability ?? "");
  const [industry, setIndustry] = useState<string>(listing.industry ?? "");
  const [priceMin, setPriceMin] = useState<string>(listing.price_min?.toString() ?? "");
  const [priceMax, setPriceMax] = useState<string>(listing.price_max?.toString() ?? "");
  const [pricePeriod, setPricePeriod] = useState<string>(listing.price_period ?? "");
  const [priceText, setPriceText] = useState<string>(listing.price_text ?? "");
  const [services, setServices] = useState<string[]>(listing.services ?? []);
  const [coverageAreas, setCoverageAreas] = useState<string[]>(listing.coverage_areas ?? []);
  const [whatsapp, setWhatsapp] = useState<string>(listing.whatsapp ?? "");
  const [emailContact, setEmailContact] = useState<string>(listing.email_contact ?? "");
  const [websiteUrl, setWebsiteUrl] = useState<string>(listing.website_url ?? "");
  const [tags, setTags] = useState<string[]>(listing.tags ?? []);
  const [tagInput, setTagInput] = useState("");

  // Images: keep existing, allow adding new, allow removing
  const [existingImages, setExistingImages] = useState<string[]>(listing.images ?? []);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);

  const MAX_TOTAL = 5;
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const remaining = MAX_TOTAL - existingImages.length - newFiles.length;
    if (remaining <= 0) return;
    const tooBig = files.filter((f) => f.size > MAX_FILE_SIZE);
    if (tooBig.length > 0) {
      toast(`Cada imagen debe pesar menos de 5 MB.`, "error");
    }
    const allowed = files.filter((f) => f.type.startsWith("image/") && f.size <= MAX_FILE_SIZE).slice(0, remaining);
    if (!allowed.length) return;
    setNewFiles((prev) => [...prev, ...allowed]);
    allowed.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => setNewPreviews((prev) => [...prev, ev.target?.result as string]);
      reader.readAsDataURL(file);
    });
  }

  function removeExisting(i: number) {
    setExistingImages((prev) => prev.filter((_, idx) => idx !== i));
  }

  function removeNew(i: number) {
    setNewFiles((prev) => prev.filter((_, idx) => idx !== i));
    setNewPreviews((prev) => prev.filter((_, idx) => idx !== i));
  }

  function toggleArr(arr: string[], setArr: (v: string[]) => void, val: string) {
    setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  }

  async function handleSave() {
    if (!title.trim() || title.trim().length < 3) {
      toast("El título debe tener al menos 3 caracteres.", "error");
      return;
    }
    if (!description.trim() || description.trim().length < 20) {
      toast("La descripción debe tener al menos 20 caracteres.", "error");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    // Upload new images
    const uploadedUrls: string[] = [];
    for (const file of newFiles) {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${listing.user_id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("listing-images")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (uploadError) {
        console.error("Upload error:", uploadError.message);
        continue;
      }
      const { data } = supabase.storage.from("listing-images").getPublicUrl(path);
      uploadedUrls.push(data.publicUrl);
    }

    const allImages = [...existingImages, ...uploadedUrls];

    const payload: Record<string, unknown> = {
      title: title.trim(),
      description: description.trim(),
      whatsapp: whatsapp.trim() || null,
      email_contact: emailContact.trim() || null,
      website_url: websiteUrl.trim() || null,
      images: allImages.length > 0 ? allImages : null,
      tags: tags.length > 0 ? tags : null,
      location_city: locationCity.trim() || null,
      location_state: locationState.trim() || null,
      location_country: locationCountries[0] ?? null,
      location_countries: locationCountries.length > 0 ? locationCountries : null,
      is_remote: isRemote,
      audience_size: audienceSize.trim() || null,
      availability: availability.trim() || null,
      industry: industry || null,
      price_min: priceMin ? parseInt(priceMin, 10) : null,
      price_max: priceMax ? parseInt(priceMax, 10) : null,
      price_period: pricePeriod || null,
      price_text: priceText.trim() || null,
    };

    if (type === "have_space") {
      payload.space_type = spaceType || null;
      payload.space_medium = spaceMedium || null;
    }
    if (type === "offer_service") {
      payload.services = services.length > 0 ? services : null;
      payload.coverage_areas = coverageAreas.length > 0 ? coverageAreas : null;
    }

    const { error } = await supabase
      .from("listings")
      .update(payload)
      .eq("id", listing.id);

    setLoading(false);

    if (error) {
      toast("No se pudo guardar. Intenta de nuevo.", "error");
    } else {
      toast("Publicación actualizada correctamente.", "success");
      router.push("/dashboard");
      router.refresh();
    }
  }

  const totalImages = existingImages.length + newFiles.length;

  return (
    <div className="space-y-6">
      {/* Basic info */}
      <Section title="Información básica">
        <Field label="Título *">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            className={cn(inputCls, title.trim().length > 0 && title.trim().length < 3 && "border-destructive/50")}
          />
        </Field>
        <Field label="Descripción *" hint={`${description.length}/1500`}>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            maxLength={1500}
            className={cn(inputCls + " resize-none", description.trim().length > 0 && description.trim().length < 20 && "border-destructive/50")}
          />
        </Field>
      </Section>

      {/* Space-specific fields */}
      {type === "have_space" && (
        <Section title="Tipo de espacio">
          <Field label="Medio">
            <div className="flex gap-3">
              {(["physical", "digital"] as const).map((m) => (
                <button key={m} type="button" onClick={() => setSpaceMedium(m)}
                  className={cn("flex-1 rounded-xl border-2 p-3 text-sm font-medium transition-colors",
                    spaceMedium === m ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/30")}>
                  {m === "physical" ? "🏙️ Físico" : "💻 Digital"}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Categoría">
            <div className="grid grid-cols-2 gap-2">
              {SPACE_CATEGORIES.map((c) => (
                <button key={c.value} type="button" onClick={() => setSpaceType(c.value)}
                  className={cn("rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                    spaceType === c.value ? "border-primary bg-primary/5 font-medium text-primary" : "border-border hover:border-primary/30")}>
                  {c.label}
                </button>
              ))}
            </div>
          </Field>
        </Section>
      )}

      {/* Agency-specific fields */}
      {type === "offer_service" && (
        <Section title="Servicios y cobertura">
          <Field label="Servicios">
            <div className="flex flex-wrap gap-2">
              {AGENCY_SERVICES.map((s) => {
                const active = services.includes(s.value);
                return (
                  <button key={s.value} type="button" onClick={() => toggleArr(services, setServices, s.value)}
                    className={cn("rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                      active ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/40 text-foreground")}>
                    {active && <Check className="mr-1.5 inline h-3 w-3" />}{s.label}
                  </button>
                );
              })}
            </div>
          </Field>
          <Field label="Mercados de cobertura">
            <div className="flex flex-wrap gap-2">
              {MARKETS.map((m) => {
                const active = coverageAreas.includes(m.value);
                return (
                  <button key={m.value} type="button" onClick={() => toggleArr(coverageAreas, setCoverageAreas, m.value)}
                    className={cn("rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                      active ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/40 text-foreground")}>
                    {active && <Check className="mr-1.5 inline h-3 w-3" />}{m.label}
                  </button>
                );
              })}
            </div>
          </Field>
        </Section>
      )}

      {/* Advertiser-specific */}
      {type === "want_to_advertise" && (
        <Section title="Industria">
          <Field label="Sector">
            <select value={industry} onChange={(e) => setIndustry(e.target.value)} className={inputCls}>
              <option value="">Seleccionar...</option>
              {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </Field>
        </Section>
      )}

      {/* Location */}
      {type !== "offer_service" && (
        <Section title="Ubicación y disponibilidad">
          <div className="flex items-center gap-2">
            <input id="is_remote" type="checkbox" checked={isRemote} onChange={(e) => setIsRemote(e.target.checked)}
              className="h-4 w-4 rounded border-border accent-primary" />
            <label htmlFor="is_remote" className="text-sm text-foreground">
              {type === "have_space" ? "Espacio digital (sin ubicación física fija)" : "Acepto publicidad en cualquier ubicación"}
            </label>
          </div>
          {!isRemote && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Ciudad">
                <input type="text" value={locationCity} onChange={(e) => setLocationCity(e.target.value)} maxLength={100} className={inputCls} />
              </Field>
              <Field label="Estado / Departamento">
                <input type="text" value={locationState} onChange={(e) => setLocationState(e.target.value)} maxLength={100} className={inputCls} />
              </Field>
            </div>
          )}
          <Field label="País">
            <CountryMultiSelect
              selected={locationCountries}
              onToggle={(v) => setLocationCountries((prev) => {
                if (prev.includes(v)) return prev.filter((c) => c !== v);
                if (prev.length >= MAX_COUNTRIES) return prev;
                return [...prev, v];
              })}
            />
          </Field>
          {type === "have_space" && (
            <>
              <Field label="Audiencia estimada">
                <input type="text" value={audienceSize} onChange={(e) => setAudienceSize(e.target.value)} maxLength={150} className={inputCls} />
              </Field>
              <Field label="Disponibilidad">
                <input type="text" value={availability} onChange={(e) => setAvailability(e.target.value)} maxLength={150} className={inputCls} />
              </Field>
            </>
          )}
        </Section>
      )}

      {/* Pricing */}
      <Section title="Precio">
        {type === "offer_service" ? (
          <Field label="Precio orientativo" hint='Ej: "Desde $500 USD/mes"'>
            <input type="text" value={priceText} onChange={(e) => setPriceText(e.target.value)} maxLength={100} className={inputCls} />
          </Field>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={type === "want_to_advertise" ? "Presupuesto mínimo (USD)" : "Precio mínimo (USD)"}>
                <input type="number" min="0" step="1" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} className={inputCls} />
              </Field>
              <Field label={type === "want_to_advertise" ? "Presupuesto máximo (USD)" : "Precio máximo (USD)"}>
                <input type="number" min="0" step="1" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} className={inputCls} />
              </Field>
            </div>
            <Field label="Período">
              <select value={pricePeriod} onChange={(e) => setPricePeriod(e.target.value)} className={inputCls}>
                <option value="">Sin período</option>
                {PRICE_PERIODS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </Field>
            <Field label="Texto de precio libre" hint='Ej: "Precio a convenir"'>
              <input type="text" value={priceText} onChange={(e) => setPriceText(e.target.value)} maxLength={100} className={inputCls} />
            </Field>
          </>
        )}
      </Section>

      {/* Images */}
      <Section title="Imágenes">
        {existingImages.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {existingImages.map((url, i) => (
              <div key={url} className="relative h-20 w-20 overflow-hidden rounded-lg border bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Imagen ${i + 1}`} className="h-full w-full object-cover" />
                <button type="button" onClick={() => removeExisting(i)}
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        {newPreviews.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {newPreviews.map((src, i) => (
              <div key={i} className="relative h-20 w-20 overflow-hidden rounded-lg border bg-muted ring-2 ring-primary/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Nueva ${i + 1}`} className="h-full w-full object-cover" />
                <button type="button" onClick={() => removeNew(i)}
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        {totalImages < MAX_TOTAL && (
          <>
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
            <button type="button" onClick={() => fileInputRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border py-6 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground">
              <ImagePlus className="h-5 w-5" />
              {totalImages === 0 ? "Agregar imágenes" : `Agregar más (${totalImages}/${MAX_TOTAL})`}
            </button>
          </>
        )}
        <p className="text-xs text-muted-foreground">Máx. 5 imágenes · 5 MB c/u</p>
      </Section>

      {/* Contact */}
      <Section title="Contacto">
        <Field label="WhatsApp" hint="Con código de país. Ej: +57 300 123 4567">
          <input type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} maxLength={20} className={inputCls} />
        </Field>
        <Field label="Correo electrónico">
          <input type="email" value={emailContact} onChange={(e) => setEmailContact(e.target.value)} maxLength={100} className={inputCls} />
        </Field>
        <Field label="Sitio web" hint="Opcional">
          <input type="url" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} maxLength={200} placeholder="https://tuempresa.com" className={inputCls} />
        </Field>
        <Field label="Palabras clave" hint={`Máximo 5 palabras clave para el buscador. Escribe y presiona Enter o coma. (${tags.length}/5)`}>
          <div className="space-y-2">
            {tags.length < 5 && (
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    const clean = tagInput.trim().toLowerCase().replace(/,/g, "").slice(0, 30);
                    if (clean.length > 1 && !tags.includes(clean)) setTags((prev) => [...prev, clean]);
                    setTagInput("");
                  }
                }}
                onBlur={() => {
                  const clean = tagInput.trim().toLowerCase().replace(/,/g, "").slice(0, 30);
                  if (clean.length > 1 && !tags.includes(clean)) setTags((prev) => [...prev, clean]);
                  setTagInput("");
                }}
                placeholder="Ej: vallas, estadio, Monterrey..."
                maxLength={32}
                className={inputCls}
              />
            )}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                    {tag}
                    <button type="button" onClick={() => setTags((prev) => prev.filter((t) => t !== tag))} className="hover:text-destructive transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </Field>
      </Section>

      {/* Save */}
      <button
        type="button"
        onClick={handleSave}
        disabled={loading || title.trim().length < 3 || description.trim().length < 20}
        className={cn(
          linkButtonVariants({ size: "lg" }),
          "w-full h-11",
          (loading || title.trim().length < 3 || description.trim().length < 20) && "opacity-50 cursor-not-allowed"
        )}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Guardar cambios"}
      </button>
    </div>
  );
}
