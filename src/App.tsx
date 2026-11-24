import {
  DataTable,
  Link,
  Tabs,
  Tag,
  type DataTableColumn,
} from '@stillxp/react';
import {
  background,
  buttonCodeConnect,
  buttonFigmaMap,
  caseStudies,
  caseStudyPath,
  deepDives,
  findCaseStudy,
  experience,
  lockIn,
  person,
  type FigmaMapRow,
  type MapStatus,
} from './content';
import { Footer, Header } from './SiteChrome';

function Hero() {
  return (
    <section className="hero container" aria-labelledby="hero-title">
      <p className="ds-text-overline eyebrow">
        {person.role} · {person.location}
      </p>
      <div className="hero__heading">
        <h1 id="hero-title" className="ds-text-display hero__title">
          {person.name}
        </h1>
        <p className="ds-text-heading-lg hero__tagline">{person.headline}</p>
      </div>
      <p className="ds-text-body-lg hero__intro">{person.intro}</p>
    </section>
  );
}

const statusTone: Record<MapStatus, 'success' | 'warning' | 'neutral' | 'info'> = {
  aligned: 'success',
  differs: 'warning',
  'code-only': 'neutral',
  'figma-only': 'info',
};

const mapColumns: DataTableColumn<FigmaMapRow>[] = [
  { key: 'code', header: 'Code prop', isRowHeader: true, cell: (r) => <code>{r.code}</code> },
  { key: 'figma', header: 'Figma property', cell: (r) => <code>{r.figma}</code> },
  { key: 'status', header: 'Status', cell: (r) => <Tag size="sm" tone={statusTone[r.status]}>{r.status}</Tag> },
  { key: 'note', header: 'Note' },
];

function FigmaMap() {
  return (
    <div className="dive__visual">
      <DataTable
        caption="Button: Figma props map (excerpt)"
        columns={mapColumns}
        rows={buttonFigmaMap}
        getRowId={(r) => r.id}
        density="compact"
        mobileLayout="stack"
      />
      <figure className="code-sample">
        <figcaption className="ds-text-label-md">Button.figma.ts (Code Connect, excerpt)</figcaption>
        <pre tabIndex={0}><code>{buttonCodeConnect}</code></pre>
      </figure>
    </div>
  );
}

function LockInSection() {
  return (
    <section id="lock-in" className="section section--subtle" aria-labelledby="lock-in-title">
      <div className="container">
        <div className="section__head">
          <p className="ds-text-overline eyebrow">Personal project · 2026 · Solo, design and engineering</p>
          <h2 id="lock-in-title" className="ds-text-heading-xl">Lock In: a design system for people and AI agents</h2>
          <p className="ds-text-body-lg section__lede">
            Each component has one JSON spec that CI checks against the React and React Native code. The build fails if
            a color pairing misses contrast, and an MCP server lets agents read the system instead of guessing at colors.
          </p>
          <div className="tag-row">
            {['Figma', 'DTCG tokens', 'React', 'React Native', 'TypeScript', 'MCP'].map((t) => (
              <Tag key={t} variant="outline" size="sm">{t}</Tag>
            ))}
          </div>
        </div>

        <Tabs
          aria-label="How Lock In works"
          items={deepDives.map((d) => ({
            id: d.id,
            label: d.label,
            content: (
              <div className="dive">
                <div className="dive__text">
                  <h3 className="ds-text-heading-md">{d.title}</h3>
                  <p className="ds-text-heading-sm">{d.summary}</p>
                  {d.body.map((p) => (
                    <p key={p.slice(0, 24)} className="ds-text-body-md dive__para">{p}</p>
                  ))}
                </div>
                {d.figure === 'figma-map' ? (
                  <FigmaMap />
                ) : (
                  <figure className="dive__figure">
                    <img src={d.figure.src} alt={d.figure.alt} loading="lazy" />
                  </figure>
                )}
              </div>
            ),
          }))}
        />

        <p className="ds-text-body-md lock-in__status">
          Lock In is a personal project and isn’t published for other teams yet. The source, specs, Storybook and
          Figma library are all public.
        </p>
        <ul className="artifact-links artifact-links--tight" aria-label="Lock In artifacts">
          <li><Link href={lockIn.repo} external>Source and specs on GitHub</Link></li>
          <li><Link href={lockIn.figma} external>Figma library</Link></li>
          {lockIn.storybook && <li><Link href={lockIn.storybook} external>Storybook</Link></li>}
          {lockIn.hub && <li><Link href={lockIn.hub} external>Hub (read-only)</Link></li>}
        </ul>
      </div>
    </section>
  );
}

function CaseStudies() {
  if (caseStudies.length === 0) return null;
  return (
    <section id="case-studies" className="section" aria-labelledby="case-studies-title">
      <div className="container">
        <div className="section__head">
          <p className="ds-text-overline eyebrow">In production</p>
          <h2 id="case-studies-title" className="ds-text-heading-xl">Case studies</h2>
        </div>
        <ol className="studies">
          {caseStudies.map((s) => (
            <li key={s.slug} className="study">
              <div className="study__body">
                <div className="study__meta">
                  {/* Decorative: the company name is in the text next to it. */}
                  <span className="study__logo">
                    <img src={s.logo} alt="" width={28} height={28} />
                  </span>
                  <p className="ds-text-overline eyebrow">{s.org} · {s.role}</p>
                </div>
                <h3 className="ds-text-heading-md">{s.title}</h3>
                <p className="ds-text-body-lg study__summary">{s.summary}</p>
                <dl className="study__outline">
                  {s.outline.map((o) => (
                    <div key={o.label} className="study__outline-row">
                      <dt className="ds-text-label-md">{o.label}</dt>
                      <dd className="ds-text-body-md">{o.text}</dd>
                    </div>
                  ))}
                </dl>
                <div className="tag-row">
                  {s.tags.map((t) => (
                    <Tag key={t} size="sm" variant="outline">{t}</Tag>
                  ))}
                </div>
                <Link href={caseStudyPath(s.slug)} variant="standalone">Read the {s.name} case study</Link>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Work() {
  return (
    <section id="work" className="section" aria-labelledby="work-title">
      <div className="container">
        <div className="section__head">
          <p className="ds-text-overline eyebrow">Work</p>
          <h2 id="work-title" className="ds-text-heading-xl">Experience</h2>
        </div>
        <ol className="cases">
          {experience.map((c) => (
            <li key={c.id} className="case">
              <div className="case__meta">
                <p className="ds-text-body-sm case__role">{c.role}</p>
                {c.period && <p className="ds-text-body-sm case__period">{c.period}</p>}
              </div>
              <div className="case__body">
                <h3 className="ds-text-heading-md">{c.title}</h3>
                <p className="ds-text-body-md case__summary">{c.summary}</p>
                <ul className="case__points">
                  {c.points.map((p) => (
                    <li key={p} className="ds-text-body-md">{p}</li>
                  ))}
                </ul>
                <div className="tag-row">
                  {c.tags.map((t) => (
                    <Tag key={t} size="sm">{t}</Tag>
                  ))}
                </div>
                {c.caseStudy && findCaseStudy(c.caseStudy) && (
                  <Link href={caseStudyPath(c.caseStudy)} variant="standalone">
                    Read the {findCaseStudy(c.caseStudy)!.name} case study
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ol>
        {background && <p className="ds-text-body-md background">{background}</p>}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="section section--subtle" aria-labelledby="contact-title">
      <div className="container">
        <h2 id="contact-title" className="ds-text-heading-lg">Get in touch</h2>
        <p className="ds-text-body-lg section__lede">
          I’m looking for senior design systems and design technologist roles in New York or remote.
        </p>
        <ul className="artifact-links">
          <li><Link href={person.links.linkedin} external>LinkedIn</Link></li>
          <li><Link href={person.links.github} external>GitHub</Link></li>
        </ul>
      </div>
    </section>
  );
}

export function App() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <main id="main">
        <span id="top" />
        <Hero />
        <LockInSection />
        <CaseStudies />
        <Work />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
