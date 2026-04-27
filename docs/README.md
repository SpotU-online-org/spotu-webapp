# SpotU — Documentos del Negocio

Recursos para entender, presentar e invertir en SpotU.

## Índice

| Documento | Descripción | Audiencia |
|-----------|-------------|-----------|
| [pitch.md](pitch.md) | Presentación completa del negocio — problema, solución, mercado, modelo y tracción | Socios, inversores, colaboradores |
| [market_study.md](market_study.md) | Análisis de mercado, tamaño, competencia y oportunidad | Inversores, socios estratégicos |
| [business_model.md](business_model.md) | Cómo gana dinero SpotU — precios, unit economics, proyecciones | Inversores, socios de negocio |
| [website_guide.md](website_guide.md) | Cómo funciona spotu.online — guía sin tecnicismos | Amigos, familia, cualquier persona |
| [branding.md](branding.md) | Identidad visual, paleta de colores, tipografía y voz de marca | Diseñadores, colaboradores de marketing |
| [glossary.md](glossary.md) | Glosario de términos: SMB, OOH, DOOH, MRR, ARPU, etc. | Cualquier persona que lea otro doc y necesite contexto |
| [product_plan.md](product_plan.md) | Plan técnico y roadmap completo del producto | Cofounders técnicos, CTOs |
| [SpotU_Presentacion.pptx](SpotU_Presentacion.pptx) | Presentación visual de 13 slides (PowerPoint) | Reuniones con socios e inversores |

## Cómo regenerar la presentación

```bash
node docs/capture_screenshots.js   # captura nuevos screenshots de spotu.online
node docs/build_presentation.js    # genera SpotU_Presentacion.pptx
```

Los logos en PNG están en `docs/assets/`. Los screenshots del sitio (`site_*.png`) se regeneran y no se trackean en git.

---

**Fundador:** Cesar Emilio Castaño Marin
**Sitio web:** [spotu.online](https://spotu.online)
**Correo:** admin@spotu.online
