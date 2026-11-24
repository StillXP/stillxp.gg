// Site copy lives in content.json. Edit it in the browser: npm run dev, then open
// http://localhost:5173/#edit (dev only). Anything in [TODO: ...] needs your own words
// or a fact only you can confirm.
// Numbers about Lock In were checked against the repo on 14 November 2026:
// 15 component specs, 486/486 contrast checks (used in the deep dives).

import data from './content.json';

export interface Person {
  name: string;
  role: string;
  location: string;
  headline: string;
  intro: string;
  links: { linkedin: string; github: string };
}

export interface LockInInfo {
  repo: string;
  figma: string;
  storybook: string;
  hub: string;
}

export interface DeepDive {
  id: string;
  /** Tab label. The Tabs spec asks for one or two words. */
  label: string;
  title: string;
  summary: string;
  body: string[];
  /** An SVG diagram, or 'figma-map' for the Button props map and Code Connect sample. */
  figure: { src: string; alt: string } | 'figma-map';
}

export interface ExperienceItem {
  id: string;
  org: string;
  /** Job title, as on the resume. */
  role: string;
  title: string;
  period?: string;
  tags: string[];
  summary: string;
  points: string[];
  /** Slug of a case study in src/case-studies/ to link from this job. */
  caseStudy?: string;
}

export interface SiteContent {
  person: Person;
  lockIn: LockInInfo;
  deepDives: DeepDive[];
  experience: ExperienceItem[];
  background: string;
}

export const content = data as SiteContent;
export const { person, lockIn, deepDives, experience, background } = content;

// Case studies: one JSON file per study in src/case-studies/, images in
// public/case-studies/<slug>/. A new file shows up on the home page and at /work/<slug>.
export interface CaseStudyImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

export type CaseStudyBlock =
  | { type: 'p'; text: string }
  | { type: 'h'; text: string }
  | { type: 'list'; ordered?: boolean; items: string[] }
  | ({ type: 'image' } & CaseStudyImage);

export interface CaseStudy {
  slug: string;
  /** Sort order on the home page, lowest first. */
  order: number;
  /** Short name for link text, e.g. 'Read the CBS Sports design tokens case study'. */
  name: string;
  title: string;
  org: string;
  role: string;
  /** Square-ish logo of the company the work was done at, shown as a badge on the home page card. */
  logo: string;
  team?: string;
  tags: string[];
  /** One or two sentences for the home page card and the page intro. */
  summary: string;
  /** Short outline for the home page card, e.g. Problem / Approach / Result. */
  outline: { label: string; text: string }[];
  cover: CaseStudyImage;
  sections: { heading: string; blocks: CaseStudyBlock[] }[];
}

const caseStudyFiles = import.meta.glob<CaseStudy>('./case-studies/*.json', { eager: true, import: 'default' });
export const caseStudies = Object.values(caseStudyFiles).sort((a, b) => a.order - b.order);
export const caseStudyPath = (slug: string) => `/work/${slug}/`;
export const findCaseStudy = (slug: string) => caseStudies.find((c) => c.slug === slug);

export type MapStatus = 'aligned' | 'differs' | 'code-only' | 'figma-only';

export interface FigmaMapRow {
  id: string;
  code: string;
  figma: string;
  status: MapStatus;
  note: string;
}

// Excerpt of packages/specs/components/button.json → figma.props in Lock In (17 rows in full).
export const buttonFigmaMap: FigmaMapRow[] = [
  { id: 'variant', code: 'variant', figma: 'variant', status: 'aligned', note: 'Same four values and default.' },
  { id: 'iconStart', code: 'iconStart', figma: 'iconStart', status: 'aligned', note: 'Swap in an icon/<name> component, where <name> is the code icon name.' },
  { id: 'showIconStart', code: '—', figma: 'showIconStart', status: 'figma-only', note: 'Visibility toggle for the swap. In code the icon renders when iconStart is set.' },
  { id: 'loading', code: 'loading', figma: 'state=loading', status: 'differs', note: 'A value of the state axis. The spinner replaces the start icon, as in code.' },
  { id: 'disabled', code: 'disabled', figma: 'state=disabled', status: 'differs', note: 'Same result, different shape.' },
  { id: 'fullWidth', code: 'fullWidth', figma: '—', status: 'code-only', note: 'In Figma, set horizontal sizing to Fill container.' },
  { id: 'loadingLabel', code: 'loadingLabel', figma: '—', status: 'code-only', note: 'Screen reader text only, so there is nothing to draw.' },
];

// Excerpt of packages/react/figma/Button.figma.ts in Lock In.
export const buttonCodeConnect = `const variant = instance.getEnum('variant', {
  primary: 'primary', secondary: 'secondary',
  tertiary: 'tertiary', danger: 'danger',
})
// state is a Figma-only axis; only disabled and loading are props.
const state = instance.getEnum('state', { /* default … loading */ })

export default {
  example: figma.code\`<Button variant=… \${state === 'loading' ? ' loading' : ''}>…\`,
  imports: ['import { Button } from "@stillxp/react"'],
}`;
