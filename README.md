<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AI Studio – Celestia Matrix

Dieses Repo enthält eine Vite/React-App für die astrologische Fusion (Western + Ba Zi), den KI-Symbol-Generator sowie das Kosmische Wetter.

## Lokale Entwicklung

**Voraussetzungen:** Node.js 20+

1. Abhängigkeiten installieren:
   ```bash
   npm install
   ```
2. Umgebungsvariablen setzen (siehe `.env.local` oder `.env`):
   ```bash
   VITE_GEMINI_API_KEY=your-gemini-api-key
   VITE_SUPABASE_URL=https://<project>.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_COSMIC_ENGINE_URL=https://osmic-cloud-engine.fly.dev
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```
3. App starten:
   ```bash
   npm run dev
   ```

## Automatische Tests

```bash
npm run test
```

## GitHub Actions (CI)

Es gibt eine CI-Pipeline unter `.github/workflows/ci.yml`, die Tests und den Build ausführt.

## Deployment auf Vercel

1. Repo in Vercel importieren (https://vercel.com/dyai2025s-projects).
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. Relevante Umgebungsvariablen in Vercel setzen (siehe oben).

## Integrationen

### Supabase

Die App enthält eine vorbereitete Supabase-Client-Initialisierung (`services/supabaseClient.ts`). Falls `VITE_SUPABASE_URL` oder `VITE_SUPABASE_ANON_KEY` fehlen, wird der Client nicht erstellt.

### Cosmic Engine

Die Basis-URL der Cosmic Engine ist konfigurierbar (`VITE_COSMIC_ENGINE_URL`) und wird standardmäßig auf `https://osmic-cloud-engine.fly.dev` gesetzt. Der URL-Builder ist in `services/cosmicEngineService.ts` vorbereitet.

### Symbol Creator (Gemini)

Der Symbol-Generator verwendet Gemini (`services/geminiService.ts`) und nutzt `VITE_GEMINI_API_KEY` als API-Key.

### Stripe (Vorbereitung)

Die Stripe-Integration ist vorbereitet (`services/stripeService.ts`) und erwartet einen Vercel-API-Endpoint `/api/stripe/checkout`, der später die Checkout-Session erstellt. Client-seitig wird `VITE_STRIPE_PUBLISHABLE_KEY` genutzt.
