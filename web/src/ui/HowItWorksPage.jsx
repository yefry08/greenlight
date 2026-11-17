import { useCallback, useEffect, useRef, useState } from 'react'
import {
  AmbientLight, Color, DirectionalLight, Matrix4, PerspectiveCamera, Quaternion,
  Scene, SRGBColorSpace, Vector3, WebGLRenderer,
} from 'three'
import { animate } from 'animejs'
import { createTwins, compare } from '../city/sim'
import { N, SPACING, makeGrid, buildBlock } from '../city/miniCity'
import { useT } from '../i18n'

/**
 * "Cómo funciona": the mechanism, demonstrated in 3D rather than described.
 *
 * THIS IS A REAL SIMULATION, NOT AN ANIMATION OF ONE
 * Every car below is stepped by the same engine that runs the city view -- the
 * same queue discipline, the same two-group signal phasing, the same
 * measurements. Nothing is a scripted loop of pre-decided frames. That matters
 * because the claim of this project is that the difference between two signal
 * controllers is measurable, and a hand-drawn animation of that claim would be
 * a picture of the argument instead of the argument.
 *
 * IT NEEDS NOTHING. No API key, no Overpass, no network. The grid is synthetic
 * and built in the browser, so this section cannot fail in front of an audience
 * because a free service was busy -- which is exactly the risk the city view
 * carries and this one must not.
 *
 * WHY BOTH WORLDS SHARE ONE SCENE
 * Stage 3 places the two blocks side by side in the same 3D space rather than
 * in two canvases. One renderer, one frame, one camera -- so the two are
 * guaranteed to be drawn at the same instant. Two canvases can drift by a frame
 * and turn a fair comparison into a misleading one.
 *
 * THE DEMO CONTROLLER IS A RULE, NOT A MODEL, and the page says so. It reads
 * the same per-group queues and moves green the same way, so the mechanism is
 * identical -- but a model call needs a key and a round trip, and neither
 * belongs in an explainer.
 */

const stages = (tr) => [
  {
    n: '01',
    title: tr('The real network', null, 'Rrjeti i vërtetë'),
    body: tr('Streets, lanes and junctions. Those with more than two approaches have a traffic light, and each one alternates two groups of opposite directions.', null,
             'Rrugë, korsi dhe kryqëzime. Ato me më shumë se dy hyrje kanë semafor, dhe secili alternon dy grupe drejtimesh të kundërta.'),
    note: tr('Here the grid is synthetic; in the real app it comes from OpenStreetMap.', null,
             'Këtu rrjeti është sintetik; në aplikacionin real vjen nga OpenStreetMap.'),
  },
  {
    n: '02',
    title: tr('Two identical twins', null, 'Dy binjakë identikë'),
    body: tr('Same network, same cars, same seed. Both start at fixed time, so their numbers match to the last decimal.', null,
             'I njëjti rrjet, të njëjtat makina, e njëjta farë. Të dy nisin me orar fiks, ndaj shifrat e tyre përputhen deri në decimalen e fundit.'),
    note: tr('If they were not identical here, no later difference would prove anything.', null,
             'Nëse nuk do të ishin identikë këtu, asnjë ndryshim i mëvonshëm nuk do të provonte asgjë.'),
  },
  {
    n: '03',
    title: tr('The controller distributes green', null, 'Kontrolluesi shpërndan jeshilen'),
    body: tr('It reads how many cars are waiting in each group at each junction and moves seconds from the empty side to the full one, without extending the cycle. The orange ones are stopped.', null,
             'Lexon sa makina presin në çdo grup të çdo kryqëzimi dhe zhvendos sekonda nga ana bosh te ana e mbushur, pa e zgjatur ciklin. Ato portokalli janë të ndaluara.'),
    note: tr('In the demo a rule decides, not a model: a language model would need a key and network.', null,
             'Në demonstrim vendos një rregull, jo një model: një model gjuhësor do të kërkonte çelës dhe internet.'),
  },
]

const GAP = 40                       // separación entre los dos bloques en la escena

/**
 * The demo controller: the rule the prompt asks a model to follow.
 *
 * The deadband is load-bearing, not a detail. Retiming on any non-zero queue
 * means retiming on noise -- one car against none reads as a total imbalance --
 * and measured on two real cities that made the controlled twin WORSE. A
 * junction earns a decision only with enough traffic to measure and a gap wide
 * enough to be real.
 */
function decide(world) {
  const policy = {}
  let considered = 0
  for (const [id, q] of world.queues()) {
    if (q.total < 4 || Math.abs(q.byGroup[0] - q.byGroup[1]) < 3) continue
    const s = world.signals.find((z) => z.id === id)
    if (!s) continue
    considered++
    const sum = s.greens[0] + s.greens[1]
    const share = q.byGroup[0] / (q.byGroup[0] + q.byGroup[1])
    const a = Math.round(sum * Math.max(0.3, Math.min(0.7, share)))
    policy[id] = [a, sum - a]
  }
  return { policy, considered }
}

export default function HowItWorksPage() {
  const tr = useT()
  const STAGES = stages(tr)
  const [stage, setStage] = useState(0)
  const [stats, setStats] = useState(null)
  const [decisions, setDecisions] = useState(0)
  const [webglFailed, setWebglFailed] = useState(false)

  const mountRef = useRef(null)
  const gridRef = useRef(null)
  const twinsRef = useRef(null)
  const stageRef = useRef(0)
  const sceneRef = useRef(null)
  useEffect(() => { stageRef.current = stage }, [stage])

  if (!gridRef.current) {
    gridRef.current = makeGrid()
    twinsRef.current = createTwins(gridRef.current, { vehicles: 150, seed: 4242 })
  }

  const restart = useCallback(() => {
    twinsRef.current = createTwins(gridRef.current, { vehicles: 150, seed: 4242 })
    if (sceneRef.current) sceneRef.current.rebind(twinsRef.current)
    setStats(compare(twinsRef.current))
    setDecisions(0)
    setStage(0)
  }, [])

  // ---- three.js scene, built once ---------------------------------------
  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    let renderer
    try {
      renderer = new WebGLRenderer({ antialias: true, alpha: true })
    } catch {
      // A machine without WebGL should get the explanation, not a blank box.
      setWebglFailed(true)
      return
    }
    renderer.outputColorSpace = SRGBColorSpace
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    mount.appendChild(renderer.domElement)

    const scene = new Scene()
    scene.background = null
    scene.add(new AmbientLight(0xffffff, 1.5))
    const sun = new DirectionalLight(0xffffff, 1.6)
    sun.position.set(60, 90, 40)
    scene.add(sun)

    const grid = gridRef.current
    const span = (N - 1) * SPACING
    const fixed = buildBlock(grid, 150, 0)
    const ai = buildBlock(grid, 150, span + GAP)
    scene.add(fixed.group, ai.group)
    ai.group.visible = false               // sólo aparece en el paso 03

    const camera = new PerspectiveCamera(38, 1, 1, 2000)
    // Coordinates the camera is animated between. Framing one block for stages
    // 01-02, then pulling back to hold both for the comparison.
    const SHOT_ONE = { x: span / 2, y: 92, z: span + 78, tx: span / 2 }
    const SHOT_TWO = { x: span + GAP / 2, y: 150, z: span + 150, tx: span + GAP / 2 }
    const cam = { ...SHOT_ONE }

    const resize = () => {
      const w = mount.clientWidth || 800
      const h = mount.clientHeight || 420
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(mount)

    const mat = new Matrix4()
    const pos = new Vector3()
    const quat = new Quaternion()
    const one = new Vector3(1, 1, 1)
    const moving = new Color(0xded8d0)
    const stopped = new Color(0xd97757)

    const paint = (block, world) => {
      for (let i = 0; i < world.fleet.length; i++) {
        const v = world.fleet[i]
        const e = grid.edges[v.edge]
        if (!e) continue
        const f = (v.fwd ? v.pos : e.len - v.pos) / e.len
        pos.set(
          e.pts[0][0] + (e.pts[1][0] - e.pts[0][0]) * f,
          1.9,
          e.pts[0][1] + (e.pts[1][1] - e.pts[0][1]) * f,
        )
        mat.compose(pos, quat, one)
        block.cars.setMatrixAt(i, mat)
        block.cars.setColorAt(i, v.speed < 0.2 ? stopped : moving)
      }
      block.cars.instanceMatrix.needsUpdate = true
      if (block.cars.instanceColor) block.cars.instanceColor.needsUpdate = true

      world.signals.forEach((s, i) => {
        const m = block.signalMeshes[i]
        if (!m) return
        m.material.color.setHex(s.state === 0 ? 0x3fb34f : 0xf2b134)
        m.material.emissive.setHex(s.state === 0 ? 0x1a4a20 : 0x4a3a10)
      })
    }

    let alive = true
    let last = performance.now()
    let sinceDecision = 0
    let raf = 0

    setStats(compare(twinsRef.current))

    const tick = () => {
      if (!alive) return
      const now = performance.now()
      const dt = Math.min(0.35, (now - last) / 1000)
      last = now

      const st = stageRef.current
      const t = twinsRef.current

      if (st > 0) {
        t.fixed.step(dt)
        t.ai.step(dt)
        if (st === 2) {
          sinceDecision += dt
          if (sinceDecision > 2.2) {
            sinceDecision = 0
            const { policy, considered } = decide(t.ai)
            if (considered) {
              t.ai.applyPolicy(policy)
              setDecisions((d) => d + considered)
            }
          }
        }
        setStats(compare(t))
      }

      fixed.cars.visible = st > 0
      ai.group.visible = st === 2
      paint(fixed, t.fixed)
      if (st === 2) paint(ai, t.ai)

      camera.position.set(cam.x, cam.y, cam.z)
      camera.lookAt(cam.tx, 0, span / 2)
      renderer.render(scene, camera)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    sceneRef.current = {
      // anime.js drives the camera between shots. Tweening the numbers the
      // render loop already reads keeps three.js and the timeline from fighting
      // over who owns the camera.
      goTo: (st) => {
        const shot = st === 2 ? SHOT_TWO : SHOT_ONE
        animate(cam, { ...shot, duration: 900, ease: 'inOutQuad' })
      },
      rebind: (t) => { paint(fixed, t.fixed); paint(ai, t.ai) },
    }

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      ro.disconnect()
      renderer.dispose()
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
    }
  }, [])

  // Camera follows the stage.
  useEffect(() => { sceneRef.current?.goTo(stage) }, [stage])

  const s = STAGES[stage]
  const showCompare = stage === 2 && stats

  return (
    <div className="hw-page">
      <header className="hw-head">
        <h1>{tr('How it works')}</h1>
        <p>
          {tr('Three steps, all three running real in your browser. What you see below is not a video: it is the same simulation engine that powers the app, with no network and no API key.', null,
              'Tre hapa, të tre funksionojnë realisht në shfletuesin tënd. Ajo që sheh më poshtë nuk është video: është i njëjti motor simulimi që drejton aplikacionin, pa internet dhe pa çelës API.')}
        </p>
      </header>

      <ol className="hw-steps">
        {STAGES.map((x, i) => (
          <li key={x.n}>
            <button className={`hw-step ${i === stage ? 'on' : ''} ${i < stage ? 'done' : ''}`}
                    onClick={() => setStage(i)}>
              <span className="hw-n">{x.n}</span>
              <span className="hw-t">{x.title}</span>
            </button>
          </li>
        ))}
      </ol>

      <div ref={mountRef} className="hw-stage">
        {webglFailed && (
          <p className="hw-nogl">
            {tr('Your browser doesn’t have WebGL available, so the 3D scene cannot be rendered. The three steps are still explained below.', null,
                'Shfletuesi yt nuk ka WebGL, ndaj skena 3D nuk mund të shfaqet. Tre hapat shpjegohen gjithsesi më poshtë.')}
          </p>
        )}
        {stage === 2 && !webglFailed && (
          <div className="hw-tags">
            <span>{tr('Fixed time', null, 'Orar fiks')}</span>
            <span className="ai">{tr('Controlled', null, 'I kontrolluar')}</span>
          </div>
        )}
      </div>

      <div className="hw-explain">
        <p className="hw-body">{s.body}</p>
        <p className="hw-note">{s.note}</p>
      </div>

      {stats && (
        <div className="hw-metrics">
          {showCompare ? (
            <>
              <Cmp label={tr('Average speed')} b={stats.fixed.meanSpeedKmh}
                   a={stats.ai.meanSpeedKmh} d={stats.speed} unit=" km/h" />
              <Cmp label={tr('Queued now', null, 'Në radhë tani')} b={stats.fixed.queued} a={stats.ai.queued} d={stats.queued} />
              <Cmp label={tr('Junctions completed', null, 'Kryqëzime të kaluara')} b={stats.fixed.arrivals}
                   a={stats.ai.arrivals} d={stats.arrivals} />
              <div className="hw-metric">
                <span className="hw-metric-label">{tr('Retimed junctions', null, 'Kryqëzime të rirregulluara')}</span>
                <b className="hw-metric-solo">{decisions}</b>
              </div>
            </>
          ) : (
            <>
              <Solo label={tr('Vehicles', null, 'Automjete')} v={stats.fixed.vehicles} />
              <Solo label={tr('Moving', null, 'Në lëvizje')} v={stats.fixed.moving} />
              <Solo label={tr('Queued', null, 'Në radhë')} v={stats.fixed.queued} />
              <Solo label={tr('Average speed')} v={stats.fixed.meanSpeedKmh} unit=" km/h" />
            </>
          )}
        </div>
      )}

      <div className="hw-actions">
        {stage < 2
          ? <button className="tl-btn primary" onClick={() => setStage(stage + 1)}>
              {tr('Next step →', null, 'Hapi tjetër →')}
            </button>
          : <button className="tl-btn primary" onClick={restart}>{tr('Start over')}</button>}
        {stage > 0 && (
          <button className="tl-btn" onClick={() => setStage(stage - 1)}>{tr('← Previous step', null, '← Hapi i mëparshëm')}</button>
        )}
      </div>

      <p className="hw-foot">
        {tr('Both twins start from the same seed and carry the same traffic, so any difference between them is the controller and nothing else. On the Barcelona tab the same approach runs with SUMO, a full traffic simulator, and yields +41.1% network speed.', null,
            'Të dy binjakët nisin nga e njëjta farë dhe kanë të njëjtin trafik, ndaj çdo ndryshim mes tyre është kontrolluesi dhe asgjë tjetër. Në skedën e Barcelonës e njëjta qasje funksionon me SUMO, një simulator i plotë trafiku, dhe jep +41,1% shpejtësi rrjeti.')}
      </p>
    </div>
  )
}

function Solo({ label, v, unit = '' }) {
  return (
    <div className="hw-metric">
      <span className="hw-metric-label">{label}</span>
      <b className="hw-metric-solo">{v == null ? '–' : v.toFixed(unit ? 1 : 0)}{unit}</b>
    </div>
  )
}

function Cmp({ label, a, b, d, unit = '' }) {
  const f = (v) => (v == null ? '–' : v.toFixed(unit ? 1 : 0))
  return (
    <div className="hw-metric">
      <span className="hw-metric-label">{label}</span>
      <span className="hw-metric-pair">
        <b className="base">{f(b)}{unit}</b><i>→</i><b className="ai">{f(a)}{unit}</b>
      </span>
      <span className={`hw-metric-delta ${d ? (d.good ? 'good' : 'bad') : ''}`}>
        {d ? `${d.value > 0 ? '+' : ''}${d.value.toFixed(1)}%` : '–'}
      </span>
    </div>
  )
}
