import { useState } from 'react';
import {
  DataTable,
  Icon,
  Link,
  Tabs,
  Tag,
  Toggle,
  getResolvedColorMode,
  setColorMode,
  type DataTableColumn,
} from '@stillxp/react';
import {
  background,
  buttonCodeConnect,
  buttonFigmaMap,
  caseStudies,
  deepDives,
  lockIn,
  person,
  type FigmaMapRow,
  type MapStatus,
} from './content';

function ThemeToggle() {
  const [dark, setDark] = useState(() => getResolvedColorMode() === 'dark');
  return (
    <Toggle
      label="Dark mode"
      size="sm"
      labelPosition="start"
      checked={dark}
      onCheckedChange={(on) => {
        setDark(on);
        setColorMode(on ? 'dark' : 'light');
      }}
    />
  );
}

function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a className="site-header__name ds-text-label-lg" href="#top">
          {person.name}
        </a>
        <nav aria-label="Sections" className="site-header__nav">
          <Link href="#lock-in" variant="subtle">Lock In</Link>
          <Link href="#work" variant="subtle">Work</Link>
          <Link href="#contact" variant="subtle">Contact</Link>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero container" aria-labelledby="hero-title">
      <p className="ds-text-overline eyebrow">
        {person.role} · {person.location}
      </p>
      <h1 id="hero-title" className="ds-text-display hero__title">
        {person.headline}
      </h1>
      <p className="ds-text-body-lg hero__intro">{person.intro}</p>
      <div className="hero__links">
        <Link href="#lock-in" variant="standalone">See how Lock In works</Link>
        <Link href={lockIn.repo} external>Lock In on GitHub</Link>
      </div>
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
          <p className="ds-text-overline eyebrow">Featured · 2026 · Solo, design and engineering</p>
          <h2 id="lock-in-title" className="ds-text-heading-xl">Lock In: a design system for people and AI agents</h2>
          <p className="ds-text-body-lg section__lede">
            One JSON spec per component, checked in CI against the React and React Native code. Semantic tokens with a
            contrast gate in the build. An MCP server so agents read the system instead of inventing hex values.
          </p>
          <div className="tag-row">
            {['Figma', 'DTCG tokens', 'React', 'React Native', 'TypeScript', 'MCP'].map((t) => (
              <Tag key={t} variant="outline" size="sm">{t}</Tag>
            ))}
          </div>
        </div>

        <dl className="stats">
          {lockIn.stats.map((s) => (
            <div key={s.label} className="stat">
              <dt className="ds-text-body-sm stat__label">{s.label}</dt>
              <dd className="ds-text-heading-lg stat__value">{s.value}</dd>
            </div>
          ))}
        </dl>

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

        <ul className="artifact-links" aria-label="Lock In artifacts">
          <li><Link href={lockIn.repo} external>Source and specs on GitHub</Link></li>
          <li><Link href={lockIn.figma} external>Figma library</Link></li>
          {lockIn.storybook && <li><Link href={lockIn.storybook} external>Storybook</Link></li>}
          {lockIn.hub && <li><Link href={lockIn.hub} external>Hub (read-only)</Link></li>}
        </ul>
      </div>
    </section>
  );
}

function Work() {
  return (
    <section id="work" className="section" aria-labelledby="work-title">
      <div className="container">
        <div className="section__head">
          <p className="ds-text-overline eyebrow">In production</p>
          <h2 id="work-title" className="ds-text-heading-xl">Design systems work</h2>
        </div>
        <ol className="cases">
          {caseStudies.map((c) => (
            <li key={c.id} className="case">
              <div className="case__meta">
                <Icon name={c.icon} size="md" color="brand" />
                <p className="ds-text-label-lg">{c.org}</p>
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
              </div>
            </li>
          ))}
        </ol>
        <p className="ds-text-body-md background">{background}</p>
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
          I’m looking for senior design systems and design technologist roles, in New York or remote.
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
        <Work />
        <Contact />
      </main>
      <footer className="site-footer">
        <div className="container">
          <p className="ds-text-body-sm">
            Built with <Link href={lockIn.repo} variant="subtle" external>Lock In</Link> Design System
          </p>
        </div>
      </footer>
    </>
  );
}
