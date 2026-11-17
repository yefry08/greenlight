# Greenlight AI

**Evidence for Pristina's bus routes.** Open data and generative AI that show a
transit planner where homes are far from a bus stop, answer questions about it
in Albanian, Serbian, English or Spanish with every claim cited, and estimate
what a new service or smarter signals would change. It flags; it never
recommends.

Built for the **GenAI for Good Challenge: Cities Edition** (UNDP / IEEE),
Pristina's *Transit Route Planning* use case. The site is in English and
Albanian.

**Live: https://greenlight-ruddy.vercel.app** · Pristina's review map:
[#/transit/pristina](https://greenlight-ruddy.vercel.app/#/transit/pristina)

---

## What it does

| Part | What it shows | Where |
|---|---|---|
| **Bus coverage** | Every home in OpenStreetMap against every bus stop: who is within 400 m of a stop, and which areas are not | Transit tab, `#/transit/pristina` |
| **Route-review flags** | Areas of 250 m with 15 or more homes and no stop within 400 m, each linked to its OpenStreetMap evidence | Transit tab |
| **Ask the evidence** | Plain-language questions in Albanian, Serbian, English or Spanish, answered only from the numbered records, every claim cited and checked | Transit tab |
| **"If this area got a bus"** | Cars off the road, car-km and CO₂ avoided, from adjustable assumptions; the centre's response read from a traffic simulation | Transit tab |
| **Traffic twin** | Pristina's street network (1,420 streets, 59 signals) in the browser, fixed-time against adaptive signals | Your city tab |
| **Barcelona twin** | A recorded SUMO simulation of Barcelona's Eixample, two twins side by side | Home tab |

## Pristina in numbers

From OpenStreetMap (ODbL), read on 3 November 2026:

| | |
|---|---:|
| Homes | 27,640 |
| Bus stops | 312 |
| Bus routes | 35 |
| Homes within 400 m of a stop (straight line) | 21,666 (**78 %**) |
| Areas flagged for review | **135** |
| Homes in flagged areas | **4,728** |

**What the scenario found.** In Pristina's centre, waiting time is set by the
signals: adaptive signals cut stopped time by 36–55 % in the simulation, while
taking cars off the road for a new bus service gave no measurable change there.
Read over 3 seeds, 420 vehicles, 5 simulated minutes: small, and a simulation,
not a measurement.

## How the assistant stays honest

- **The whole evidence set, numbered.** [T] the totals, [G1…] the flagged
  areas, [R1…] the bus routes. It is small enough to send whole, so nothing is
  dropped by a ranking step the planner cannot see.
- **Answers only from those records.** The model is told to cite them, to say
  when they do not answer the question, and never to recommend a change.
- **Every citation is checked.** Real ones link to the map or to
  OpenStreetMap; an invented one is shown in red rather than silently removed.
- **The visitor's own model.** The API key stays in the browser's memory and
  goes only to the visitor's provider (`web/src/city/ai.js`). Nothing is
  stored or sent to us.
- **No personal data.** Homes and stops are OpenStreetMap features, counted by
  area.

## Limits

- OpenStreetMap is incomplete: a missing stop shows up as a gap, a missing
  building as a covered area that is not. Each flag links to its evidence so a
  planner can check it.
- Distance is a straight line, not a walking route.
- The traffic results are simulations on modelled demand, not counts from
  Pristina's streets.

## Running it

```bash
cd web
npm install
npm run dev
```

Open the address Vite prints and go to `#/transit/pristina`. The transit data
is baked into `web/public/transit/pristina.json`; nothing else is needed.

Production build (the same build Vercel runs, see `web/vercel.json`):

```bash
cd web
npm run build:pages
```

The Barcelona twin's live server (SUMO, Python) is documented in
[docs/BARCELONA_TWIN.md](docs/BARCELONA_TWIN.md), with its measured results,
seed validation and known limitations.

## Code

Greenlight AI shares its code with
[MainstreetAi](https://github.com/yefry08/MainstreetAi), the Latin American
sister project. The two sites differ only in `web/src/site.js`.

| Path | What |
|---|---|
| `web/src/transit/coverage.js` | Homes, stops and the flagged areas |
| `web/src/transit/assistant.js` | Evidence records, prompt, citation checks |
| `web/src/transit/scenario.js` | "If this area got a bus" |
| `web/scripts/bake-transit.mjs` | Builds `pristina.json` from OpenStreetMap |
| `web/scripts/bake-transit-sim.mjs` | The traffic response curve for the scenario |
| `server/` | The SUMO twins (Barcelona) |
