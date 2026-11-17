/**
 * Research: the agent-simulation work this project takes inspiration from.
 *
 * WHAT THIS SECTION CLAIMS, AND WHAT IT MUST NOT
 * Every entry here is cited as PRECEDENT -- evidence that large-scale AI agent
 * simulation is an active, validated research field. None of it is used by
 * this project. MainstreetAi runs SUMO with a rule-based adaptive controller;
 * it shares no code, no models and no architecture with anything below.
 *
 * That distinction is the whole reason the section is worded carefully. A
 * reader skimming cards on a project's own site will assume anything listed is
 * a dependency unless told otherwise, and implying a tie to published research
 * that does not exist would be a straightforward misrepresentation of the
 * work. So the framing is stated once at the top, and each card carries its
 * own "why it is relevant" rather than a bare citation that invites the reader
 * to guess at the connection.
 *
 * LINKS
 * Only URLs that are actually known appear here. Everything else carries an
 * explicit placeholder, because a plausible-looking wrong link is worse than a
 * visibly missing one: nobody checks a URL that looks right.
 */

import { assetUrl } from '../data/assetUrl'
import { useT } from '../i18n'

const precedents = (tr) => [
  {
    name: 'Simile',
    kind: tr('Platform', null, 'Platformë'),
    what: tr('An AI-powered human population simulation platform for market research and social science, validated weekly against thousands of real-world evaluations.', null,
             'Një platformë me IA që simulon popullsi njerëzore për kërkime tregu dhe shkenca sociale, e verifikuar çdo javë me mijëra vlerësime reale.'),
    why: tr('A success case for AI agent simulation at scale, held to continuous real-world validation rather than to a benchmark alone.', null,
            'Një rast suksesi i simulimit me agjentë IA në shkallë të gjerë, i verifikuar vazhdimisht me botën reale dhe jo vetëm me një test.'),
    href: 'https://www.simile.com',
  },
  {
    name: 'MAWM — Multilingual Agent-based World Modeling',
    kind: tr('Research framework · COLM 2026', null, 'Kuadër kërkimor · COLM 2026'),
    what: tr('Simulates multilingual societies with generative agents to study opinion dynamics and how information diffuses across cultures.', null,
             'Simulon shoqëri shumëgjuhëshe me agjentë gjenerues për të studiuar dinamikën e opinioneve dhe si përhapet informacioni mes kulturave.'),
    why: tr('World-modeling with AI agents pointed at a complex social phenomenon, where the behaviour of interest emerges from the population rather than being scripted.', null,
            'Modelim i botës me agjentë IA për një dukuri komplekse shoqërore, ku sjellja që na intereson lind nga popullsia në vend që të jetë e programuar.'),
    href: null,
  },
  {
    name: 'MicroVerse / MatrAIx',
    kind: tr('Experiment', null, 'Eksperiment'),
    what: tr('Measures "identity drift" in AI agents across long-running simulations under resource scarcity.', null,
             'Mat “zhvendosjen e identitetit” te agjentët IA në simulime të gjata me burime të pakta.'),
    why: tr('The one on this list that is a caution rather than an encouragement. Anything orchestrating a city runs continuously for days, and an autonomous agent that drifts over time is a failure mode a traffic controller cannot afford.', null,
            'I vetmi në këtë listë që është paralajmërim dhe jo inkurajim. Çdo gjë që drejton një qytet punon pa ndërprerje për ditë, dhe një agjent autonom që zhvendoset me kohën është një dështim që një kontrollues trafiku nuk e përballon dot.'),
    href: null,
  },
  {
    name: tr('Generative agent societies', null, 'Shoqëri agjentësh gjenerues'),
    kind: tr('Research lineage', null, 'Linjë kërkimore'),
    what: tr('Stanford’s Generative Agents (“Smallville”) and the body of work since on simulating societies with language models.', null,
             'Generative Agents i Stanfordit (“Smallville”) dhe puna e mëpasshme për simulimin e shoqërive me modele gjuhësore.'),
    why: tr('The lineage that made it credible to model a complex urban system with agents at all, rather than only with equations.', null,
            'Linja që e bëri të besueshëm modelimin e një sistemi kompleks urban me agjentë, e jo vetëm me ekuacione.'),
    href: 'https://arxiv.org/abs/2304.03442',
  },
]

/**
 * The diagram rides beside the header rather than below the cards. That puts
 * this project's own architecture next to the line saying none of the cited
 * work is used by it, so the heading on the figure has to carry the attribution
 * on its own -- it is the only thing telling a skimming reader that the diagram
 * is ours and the cards are not.
 */
export default function Research() {
  const tr = useT()
  return (
    <section className="research">
      <div className="research-top">
        <header className="research-head">
          <p className="research-eyebrow">{tr('Research')}</p>
          <h1>{tr('Precedent, not architecture', null, 'Precedent, jo arkitekturë')}</h1>
          <p className="research-lede">
            {tr('Work that shows large-scale AI agent simulation is an active and validated field. It is cited here as inspiration and context.', null,
                'Punë që tregon se simulimi me agjentë IA në shkallë të gjerë është një fushë aktive dhe e verifikuar. Citohet këtu si frymëzim dhe kontekst.')}
          </p>
          <p className="research-disclaimer glass">
            <strong>{tr('None of this is used by Greenlight AI.', null, 'Asgjë nga këto nuk përdoret nga Greenlight AI.')}</strong>{' '}
            {tr('This project runs SUMO with a rule-based adaptive signal controller, and shares no code, models or technical architecture with the work below. These are references that shaped how the problem was framed — nothing more.', null,
                'Ky projekt përdor SUMO me një kontrollues adaptiv semaforësh me rregulla, dhe nuk ndan kod, modele apo arkitekturë teknike me punën më poshtë. Janë referenca që ndihmuan të formulohej problemi — asgjë më shumë.')}
          </p>
        </header>

        {/* No loading="lazy": this is above the fold now and the largest element
            on the page, so deferring it would hold back the very thing the load
            is waiting on. */}
        <figure className="pipeline-fig">
          <img
            src={assetUrl('img/pipeline-diagram.png')}
            alt="Three-phase pipeline. Phase 1, data layer: OpenStreetMap and
                 Overture feed city2graph, open data and sensors, and the SUMO
                 simulation engine. Phase 2, visual layer: a prettymaps
                 illustrated basemap with a pixel-art simulation overlaid on the
                 same coordinates. Phase 3, AI orchestration: queue length, bus
                 proximity and time-of-day demand drive signal retiming and bus
                 green waves, measured as CO2 reduction, minutes saved and
                 transit punctuality."
            width="1440"
            height="1446"
            decoding="async"
          />
          <figcaption>
            <h3>{tr('AI Traffic Orchestration — Technical Pipeline', null, 'Orkestrimi i trafikut me IA — rrjedha teknike')}</h3>
            <p>
              {tr('Greenlight AI’s own pipeline, as designed. Running today: Barcelona, Shibuya and Midtown Manhattan have full SUMO networks and recorded twins — +41.1%, +36.0% and +34.6% network speed against fixed-time control. The remaining districts have illustrated basemaps only. Demand is a calibrated synthetic profile rather than a live municipal feed, and the road graph is built by netconvert from OSM, with city2graph supplying the transit layer.', null,
                  'Rrjedha e vetë Greenlight AI, siç është projektuar. Funksionon sot: Barcelona, Shibuya dhe Midtown Manhattan kanë rrjete të plota SUMO dhe binjakë të regjistruar — +41,1%, +36,0% dhe +34,6% shpejtësi rrjeti krahasuar me orarin fiks. Lagjet e tjera kanë vetëm harta bazë të ilustruara. Kërkesa është një profil sintetik i kalibruar, jo të dhëna të drejtpërdrejta bashkiake, dhe grafi i rrugëve ndërtohet me netconvert nga OSM, me city2graph për shtresën e transportit.')}
            </p>
          </figcaption>
        </figure>
      </div>

      <ul className="research-grid">
        {precedents(tr).map((p) => (
          <li className="research-card glass" key={p.name}>
            <div className="research-kind">{p.kind}</div>
            <h2 className="research-name">{p.name}</h2>
            <p className="research-what">{p.what}</p>
            <p className="research-why">
              <span className="research-why-label">{tr('Why it is here', null, 'Pse është këtu')}</span>
              {p.why}
            </p>
            {p.href ? (
              <a className="research-link" href={p.href}
                 target="_blank" rel="noopener noreferrer">
                {p.href.replace(/^https?:\/\//, '')} ↗
              </a>
            ) : (
              // Deliberately visible. A missing link that looks missing gets
              // filled in; an invented one that looks plausible never does.
              <span className="research-link missing">{tr('Link to add', null, 'Lidhje për t’u shtuar')}</span>
            )}
          </li>
        ))}
      </ul>

      <p className="research-foot">
        {tr('Greenlight AI compares two SUMO simulations of Barcelona running identical demand, differing only in who controls the traffic lights. The agent work above informs how that question is framed; it does not run underneath it.', null,
            'Greenlight AI krahason dy simulime SUMO të Barcelonës me të njëjtën kërkesë, që ndryshojnë vetëm te kush drejton semaforët. Puna me agjentë më lart ndikon në mënyrën si shtrohet pyetja; nuk funksionon nën të.')}
      </p>

    </section>
  )
}
