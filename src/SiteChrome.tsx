// Header and footer shared by the home page and case study pages. Section links use
// "/#id" so they also work from /work/<slug>/.
import { useState } from 'react';
import { Link, Toggle, getResolvedColorMode, setColorMode } from '@stillxp/react';
import { caseStudies, lockIn, person } from './content';

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

export function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a className="site-header__name ds-text-label-lg" href="/">
          {person.name}
        </a>
        <nav aria-label="Sections" className="site-header__nav">
          <Link href="/#lock-in" variant="subtle">Lock In</Link>
          {caseStudies.length > 0 && <Link href="/#case-studies" variant="subtle">Case studies</Link>}
          <Link href="/#work" variant="subtle">Work</Link>
          <Link href="/#contact" variant="subtle">Contact</Link>
          {import.meta.env.DEV && <Link href="/#edit" variant="subtle">Edit content</Link>}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <p className="ds-text-body-sm">
          Built with the <Link href={lockIn.repo} variant="subtle" external>Lock In</Link> design system
        </p>
      </div>
    </footer>
  );
}
