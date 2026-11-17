import { useState } from 'react'
import { useT } from '../i18n'

/**
 * Contact: bio, links, and a message form.
 *
 * WHY mailto: AND NOT A FORM SERVICE
 * This page is statically hosted -- GitHub Pages, or a prebuilt Vercel upload.
 * There is no backend to POST to. The two options are a third-party form
 * service (Formspree, Getform) or mailto:.
 *
 * mailto: wins here on the criterion that matters for a demo: it cannot break.
 * No account, no API key committed to a public repo, no free-tier submission
 * cap to hit mid-demo, no third party seeing messages, and nothing to configure
 * before the link works. Its real cost is that it needs a mail client
 * configured, so the address is also shown in full and is copyable -- someone
 * without a mail handler is never left with a dead button.
 *
 * A form service would be the right call for a production contact page with
 * real inbound volume. It is the wrong call for a page whose contact form may
 * be used five times.
 */

const EMAIL = 'yefrynunez45@gmail.com'

const LINKS = [
  { label: 'GitHub', href: 'https://github.com/yefry08', handle: '@yefry08' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/yefrynunez/', handle: 'yefrynunez' },
  { label: 'This project', href: 'https://github.com/yefry08/greenlight', handle: 'greenlight' },
]

export default function Contact() {
  const tr = useT()
  const [subject, setSubject] = useState('Greenlight AI')
  const [body, setBody] = useState('')
  const [copied, setCopied] = useState(false)

  const mailto =
    `mailto:${EMAIL}?subject=${encodeURIComponent(subject || 'Greenlight AI')}` +
    `&body=${encodeURIComponent(body)}`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // Clipboard is blocked in some contexts; the address is on screen anyway.
      setCopied(false)
    }
  }

  return (
    <div className="contact-page">
      <div className="contact-grid">
        <section className="contact-bio glass">
          <h1>Yefry Núñez</h1>
          <p className="contact-role">
            {tr('Machine Learning Engineer · Founder, AI Safety Dominicana', null, 'Inxhinier i Mësimit Automatik · Themelues, AI Safety Dominicana')}
          </p>
          <p>
            {tr('I build machine-learning systems and work on making them safe to deploy. AI Safety Dominicana is my effort to grow that conversation in the Dominican Republic and the wider Caribbean, where very little of it is happening in Spanish.', null,
                'Ndërtoj sisteme të mësimit automatik dhe punoj që ato të jenë të sigurta për t’u përdorur. AI Safety Dominicana është përpjekja ime për ta zgjeruar këtë bisedë në Republikën Domenikane dhe në Karaibe, ku shumë pak prej saj zhvillohet në spanjisht.')}
          </p>
          <p>
            {tr('Greenlight AI came out of a question worth asking directly: how much congestion can you remove from a city, and how many people can you bring within reach of a bus, without laying any new concrete? It reads every home and stop in Pristina from open data, and runs identical traffic simulations that differ only in who controls the traffic lights.', null,
                'Greenlight AI lindi nga një pyetje që ia vlen të bëhet drejtpërdrejt: sa mbingarkesë mund të hiqet nga një qytet, dhe sa njerëz mund të afrohen me një autobus, pa hedhur asnjë beton të ri? Lexon çdo banesë dhe stacion në Prishtinë nga të dhëna të hapura, dhe nis simulime identike trafiku që ndryshojnë vetëm te kush drejton semaforët.')}
          </p>

          <div className="contact-links">
            {LINKS.map((l) => (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer"
                 className="contact-link">
                <span className="contact-link-label">{l.label === 'This project' ? tr('This project', null, 'Ky projekt') : l.label}</span>
                <span className="contact-link-handle">{l.handle}</span>
              </a>
            ))}
          </div>
        </section>

        <section className="contact-form glass">
          <h2>{tr('Send a message', null, 'Dërgo një mesazh')}</h2>

          <label className="contact-field">
            <span>{tr('Subject', null, 'Tema')}</span>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={tr('What is this about?', null, 'Për çfarë bëhet fjalë?')}
            />
          </label>

          <label className="contact-field">
            <span>{tr('Message', null, 'Mesazhi')}</span>
            <textarea
              rows={7}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={tr('Write your message here…', null, 'Shkruaj mesazhin këtu…')}
            />
          </label>

          <a className={`contact-send ${body.trim() ? '' : 'disabled'}`}
             href={body.trim() ? mailto : undefined}>
            {tr('Open in mail app', null, 'Hape në aplikacionin e postës')}
          </a>

          {/* The form composes a message; it does not send one. Saying so
              prevents someone typing, clicking, and assuming it went. */}
          <p className="contact-hint">
            {tr('This opens your mail app with the message ready — it does not send it from the page. No backend, so nothing is stored or forwarded anywhere.', null,
                'Kjo hap aplikacionin e postës me mesazhin gati — nuk e dërgon nga faqja. Pa server, ndaj asgjë nuk ruhet as nuk përcillet askund.')}
          </p>

          <button className="contact-copy" onClick={copy}>
            {copied ? tr('Copied', null, 'U kopjua') : EMAIL}
          </button>
        </section>
      </div>
    </div>
  )
}
