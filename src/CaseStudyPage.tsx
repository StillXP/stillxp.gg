import { useEffect } from 'react';
import { Link, Tag } from '@stillxp/react';
import { caseStudies, caseStudyPath, person, type CaseStudy, type CaseStudyBlock, type CaseStudyImage } from './content';
import { Footer, Header } from './SiteChrome';

function Figure({ image }: { image: CaseStudyImage }) {
  return (
    <figure className="article__figure">
      <img src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" />
      {image.caption && <figcaption className="ds-text-body-sm">{image.caption}</figcaption>}
    </figure>
  );
}

// Case study text can include [label](url) links. Links starting with http open in a new tab.
function RichText({ text }: { text: string }) {
  const parts = text.split(/\[([^\]]+)\]\(([^)\s]+)\)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (i % 3 === 0) return part;
        if (i % 3 === 2) return null;
        const href = parts[i + 1];
        return (
          <Link key={i} href={href} external={/^https?:/.test(href)}>
            {part}
          </Link>
        );
      })}
    </>
  );
}

function Block({ block }: { block: CaseStudyBlock }) {
  switch (block.type) {
    case 'p':
      return (
        <p className="ds-text-body-lg article__para">
          <RichText text={block.text} />
        </p>
      );
    case 'h':
      return <h3 className="ds-text-heading-md article__subhead">{block.text}</h3>;
    case 'list': {
      const List = block.ordered ? 'ol' : 'ul';
      return (
        <List className="article__list">
          {block.items.map((item) => (
            <li key={item} className="ds-text-body-lg">
              <RichText text={item} />
            </li>
          ))}
        </List>
      );
    }
    case 'image':
      return <Figure image={block} />;
  }
}

function Article({ study }: { study: CaseStudy }) {
  const index = caseStudies.indexOf(study);
  const next = caseStudies[index + 1];

  return (
    <article className="article container" aria-labelledby="article-title">
      <Link href="/#case-studies" variant="subtle">All case studies</Link>

      <header className="article__head">
        <p className="ds-text-overline eyebrow">{study.org}</p>
        <h1 id="article-title" className="ds-text-display article__title">{study.title}</h1>
        <p className="ds-text-body-lg article__summary">{study.summary}</p>
        <dl className="article__meta">
          <div>
            <dt className="ds-text-label-md">Role</dt>
            <dd className="ds-text-body-md">{study.role}</dd>
          </div>
          {study.team && (
            <div>
              <dt className="ds-text-label-md">Team</dt>
              <dd className="ds-text-body-md">{study.team}</dd>
            </div>
          )}
        </dl>
        <div className="tag-row">
          {study.tags.map((t) => (
            <Tag key={t} size="sm" variant="outline">{t}</Tag>
          ))}
        </div>
      </header>

      <img
        className="article__cover"
        src={study.cover.src}
        alt={study.cover.alt}
        width={study.cover.width}
        height={study.cover.height}
      />

      <aside className="article__glance" aria-labelledby="glance-title">
        <h2 id="glance-title" className="ds-text-heading-sm">At a glance</h2>
        <dl className="study__outline">
          {study.outline.map((o) => (
            <div key={o.label} className="study__outline-row">
              <dt className="ds-text-label-md">{o.label}</dt>
              <dd className="ds-text-body-md">{o.text}</dd>
            </div>
          ))}
        </dl>
      </aside>

      {study.sections.map((section) => (
        <section key={section.heading} className="article__section">
          <h2 className="ds-text-heading-lg">{section.heading}</h2>
          {section.blocks.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </section>
      ))}

      <nav className="article__end" aria-label="More work">
        {next && <Link href={caseStudyPath(next.slug)} variant="standalone">Next: the {next.name} case study</Link>}
        <Link href="/#case-studies" variant="standalone">Back to all case studies</Link>
      </nav>
    </article>
  );
}

function NotFound() {
  return (
    <div className="article container">
      <h1 className="ds-text-heading-xl">Case study not found</h1>
      <p className="ds-text-body-lg article__summary">That page doesn’t exist, or it has moved.</p>
      <Link href="/#case-studies" variant="standalone">See all case studies</Link>
    </div>
  );
}

export function CaseStudyPage({ slug }: { slug: string }) {
  const study = caseStudies.find((c) => c.slug === slug);

  useEffect(() => {
    document.title = study ? `${study.title} · ${person.name}` : `Not found · ${person.name}`;
  }, [study]);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <main id="main">{study ? <Article study={study} /> : <NotFound />}</main>
      <Footer />
    </>
  );
}
