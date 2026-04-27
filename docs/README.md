# SpotU — Carpeta de Documentación

Documentación del proyecto, organizada por audiencia.

---

## 📂 [partners/](partners/) — Documentación para compartir con socios

Bundle listo para enviar o presentar a potenciales socios, inversores y colaboradores. Empezar por [partners/README.md](partners/README.md).

| Documento | Descripción |
|-----------|-------------|
| [partners/SpotU_Presentacion.pptx](partners/SpotU_Presentacion.pptx) | Presentación visual de 14 slides |
| [partners/pitch.md](partners/pitch.md) | Pitch completo: problema, solución, mercado, modelo |
| [partners/team.md](partners/team.md) | Equipo fundador (Cesar + Tomás) y perfiles que buscamos |
| [partners/business_model.md](partners/business_model.md) | Tarifas, unit economics, proyecciones |
| [partners/market_study.md](partners/market_study.md) | Análisis de mercado y panorama competitivo |
| [partners/website_guide.md](partners/website_guide.md) | Cómo funciona spotu.online (sin tecnicismos) |
| [partners/branding.md](partners/branding.md) | Identidad visual y voz de marca |
| [partners/glossary.md](partners/glossary.md) | Glosario de términos (SMB, OOH, ARPU, etc.) |

---

## 📂 [internal/](internal/) — Documentación interna

Archivos de referencia y trabajo interno, no pensados para compartir con socios externos.

| Documento | Descripción |
|-----------|-------------|
| [internal/product_plan.md](internal/product_plan.md) | Plan técnico detallado y roadmap completo |
| [internal/pitch_legacy.md](internal/pitch_legacy.md) | Versión original del pitch (referencia histórica) |
| [internal/prompt_logo.txt](internal/prompt_logo.txt) | Prompt usado para generar el logo |

---

## 📂 [assets/](assets/) — Recursos gráficos

Logos en `.png` y screenshots del sitio (`site_*.png`, no trackeados en git).

---

## Scripts

| Script | Función |
|--------|---------|
| `build_presentation.js` | Genera `partners/SpotU_Presentacion.pptx` con PptxGenJS |
| `capture_screenshots.js` | Captura screenshots de spotu.online con Playwright |

```bash
node docs/capture_screenshots.js   # actualizar screenshots de spotu.online
node docs/build_presentation.js    # regenerar la presentación
```

---

**Fundador:** Cesar Emilio Castaño Marin · admin@spotu.online
