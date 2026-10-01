# web-frealvision

Web realitního makléře Františka Kroupy (F·Real Vision s.r.o.).
Next.js 16 · React 19 · Tailwind v4 · nabídky z Nemo1.

```bash
npm ci
npm run dev        # http://localhost:3000, bez Nemo1 běží na ukázkových datech
npm run check      # tsc + lint + testy + slugy + obsah
npm run build
npm run check:feed # ověří napojení na Nemo1 (čte .env.local)
```

- Co chybí do spuštění: `docs/stav-prace.md`
- Napojení na Nemo1: `docs/napojeni-nemo1.md`
- Pravidla pro úpravy: `CLAUDE.md`
