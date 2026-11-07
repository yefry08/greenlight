/**
 * What this site is. Greenlight AI shares its code with MainstreetAi
 * (github.com/yefry08/MainstreetAi); the two differ only here:
 *
 *   Greenlight AI (github.com/yefry08/greenlight, Vercel)
 *     The GenAI for Good Challenge: Cities Edition (UNDP / IEEE) -- Pristina's
 *     Transit Route Planning use case, with Barcelona's recorded traffic twin.
 *     English and Albanian.
 *   MainstreetAi  (github.com/yefry08/MainstreetAi, GitHub Pages)
 *     Latin America: open data and AI for climate. Spanish and English.
 *
 * Anything that would make one site show the other's content belongs in this
 * file, not in a component.
 */
import { CITIES, citySlug } from './city/cities.js'

const ONLY = ['pristina', 'barcelona']

export const SITE = {
  name: 'Greenlight AI',
  tagline: { en: 'Evidence for Pristina’s bus routes', sq: 'Dëshmi për linjat e autobusëve të Prishtinës' },
  langs: ['en', 'sq'],
  // The recorded SUMO twin of Barcelona's Eixample.
  scenes: ['barcelona'],
  // 'home' is Barcelona's scene; listing it here places it in the menu.
  tabs: ['transit', 'home', 'yours', 'how', 'research', 'contact'],
  cities: (c) => ONLY.includes(citySlug(c)),
  askLangs: ['sq', 'sr', 'en'],
  defaultCity: { transit: 'pristina', green: 'pristina' },
}

export const SITE_CITIES = CITIES.filter(SITE.cities)
export const hasScene = (key) => SITE.scenes.includes(key)
