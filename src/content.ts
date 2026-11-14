// All site copy lives here so it can be edited without touching layout.
// Anything in [TODO: ...] needs your own words or a fact only you can confirm.
// Numbers about Lock In were checked against the repo on 14 November 2026:
// 15 component specs, 165 props, 486/486 contrast checks.

import type { IconName } from '@stillxp/react';

export const person = {
  name: 'Andrew Still',
  role: 'Senior design systems designer',
  location: 'New York',
  headline: 'Design systems for people and AI agents.',
  intro:
    'I keep Figma, tokens, React and the agents that build with them working from the same contract. Most recently I built Lock In, a cross-platform design system with specs that CI checks against the code and an MCP server that lets agents read and edit it under the same rules as a person.',
  links: {
    linkedin: 'https://www.linkedin.com/in/a-still/',
    github: 'https://github.com/StillXP',
  },
};

export const lockIn = {
  repo: 'https://github.com/StillXP/lock-in-design-system',
  figma: 'https://www.figma.com/design/1dgB7LeRgTrVIenTmmrlvr/Lock-In-Design-System?node-id=3-140',
  storybook: 'https://stillxp.github.io/lock-in-design-system/', // GitHub Pages, deployed from Lock In main
  hub: '', // [TODO: public read-only hub URL]
  stats: [
    { value: '15', label: 'components on web and native, same props' },
    { value: '165', label: 'spec props, each mapped to Figma or marked code-only' },
    { value: '486', label: 'contrast checks on every token build' },
    { value: 'MCP', label: 'read and write tools for agents, plus REST' },
  ],
};

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

export const deepDives: DeepDive[] = [
  {
    id: 'spec',
    label: 'Spec',
    title: 'The spec is the contract',
    summary: 'CI fails when React, React Native and the spec disagree.',
    body: [
      'Each component has one JSON spec: props, states, tokens, accessibility rules and usage. Code, Figma, docs and agents all read from it.',
      'A check script reads the React and React Native prop types with the TypeScript compiler API and compares them with the spec. A missing prop, a different default or a mismatched set of string values fails the build on every pull request.',
      'Figma cannot mirror code exactly, so every prop gets a row saying how the two relate: aligned, differs, code-only or figma-only. The 52 "differs" rows document where the tools disagree on purpose.',
    ],
    figure: {
      src: '/diagrams/spec-drift.svg',
      alt: 'A component spec feeds the Figma props map and the get_component tool. A check script compares it with the React and React Native prop types and fails the build on drift.',
    },
  },
  {
    id: 'contrast',
    label: 'Contrast',
    title: 'Contrast is a build condition',
    summary: '486 checks across light, dark and two themes.',
    body: [
      'Tokens are DTCG JSON. Semantic colors reference the base palette for light and dark, and themes only remap semantic tokens, so no raw values leak in.',
      'The token build resolves every alias per mode and theme, then runs 81 foreground and background pairs in each. Text needs 4.5:1, borders and focus rings need 3:1. A miss fails the build and lists the pairs.',
      'The rule in the repo: never lower a contrast pair. If the check fails, change the token mapping.',
    ],
    figure: {
      src: '/diagrams/contrast-gate.svg',
      alt: 'A token edit resolves aliases per mode and theme and runs the contrast pairs. If every pair passes, outputs are emitted; otherwise the build fails with the failing pairs.',
    },
  },
  {
    id: 'agents',
    label: 'Agents',
    title: 'Agents can use it and can’t break it',
    summary: 'The same validation for people, REST and MCP.',
    body: [
      'A hub server exposes tokens, specs and docs over MCP. An agent in another project searches the system, reads the component spec, styles with semantic tokens and checks any new color pairing before using it.',
      'Writes need an editor key. When an agent edits a token, the store rechecks contrast. If a pair fails, the file is restored byte for byte and the agent gets a 422 naming the failing pairs, so it can try another value.',
      'This portfolio was built that way: the agent that wrote it pulled component specs and tokens from the lockin MCP server instead of guessing.',
    ],
    figure: {
      src: '/diagrams/agent-edit-loop.svg',
      alt: 'An agent reads a component spec, then updates a token. Three contrast pairs fail, the file is restored and the agent receives a 422 listing them.',
    },
  },
  {
    id: 'figma',
    label: 'Figma',
    title: 'Figma and code, mapped prop by prop',
    summary: 'Variables generated from tokens, and Code Connect on every component.',
    body: [
      'Code is the source of truth and sync runs one way. A script turns the DTCG tokens into a Figma Variables payload in four collections: Primitives, Color, Dimensions and Typography. Color has Light and Dark modes plus a Light and Dark pair for each theme, so a new theme file adds its modes on the next run. Every variable carries the same var(--ds-*) code syntax the CSS build emits.',
      'Each spec has a Figma props map: 214 rows across 15 components. 45 are aligned, 52 differ on purpose, 75 are code-only and 42 are Figma-only. Every row that isn’t aligned has a note, so a designer knows that state=loading in Figma is the loading prop in code, and that fullWidth means setting the instance to Fill container.',
      'Code Connect templates cover 20 Figma components and 33 icons. Dev Mode shows real @stillxp/react code with the props the designer set, and icon swaps resolve to the code icon name. When a proposal is released, the workflow can publish Code Connect too.',
    ],
    figure: 'figma-map',
  },
  {
    id: 'governance',
    label: 'Governance',
    title: 'Gaps become proposals, not workarounds',
    summary: 'Every addition comes in as a proposal with evidence. The owner decides.',
    body: [
      'When a product needs something Lock In doesn’t have, it files a Lock In proposal (LIP) instead of keeping a private stand-in. A proposal holds the problem, evidence of reuse with Figma and code links, the closest existing component and why it can’t be extended, a draft spec and contrast results. Agents file through MCP, people through a GitHub issue form, and both become one JSON file validated against a schema.',
      'Proposals move from proposed through triage, accepted and in code to released, or get declined. Only the owner moves a proposal past triage. The checklist asks whether more than one product needs it, whether an existing component could take a variant instead, and whether the accessibility pattern is settled. Status labels on the issue run a workflow that records each decision in the file, and an accepted proposal gets a draft PR with spec, React, React Native, stories and docs.',
      'Components go experimental, beta, stable, deprecated. A deprecated component stays for at least one minor release, with a note in its usage rules pointing to the replacement. Specs are versioned with semver, bumped by the hub.',
      'LIP-001, Textarea, was filed by an agent working on VolleyXP with four pieces of evidence. InputField couldn’t be extended: an <input> can’t wrap, Enter behaves differently and the native mapping changes. It was accepted and released as Textarea 0.1.0 on web and native with Code Connect, and VolleyXP replaced its local stand-in with it.',
    ],
    figure: {
      src: '/diagrams/proposal-lifecycle.svg',
      alt: 'Lifecycle of a Lock In proposal: filed through the hub by an agent or through the GitHub issue form, it moves from proposed through triage, accepted and in code to released, with an optional in-design route and declined as the other outcome. Each status label runs the proposals workflow, which records it in the proposal file.',
    },
  },
];

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

export interface CaseStudy {
  id: string;
  org: string;
  title: string;
  period?: string;
  icon: IconName;
  tags: string[];
  summary: string;
  points: string[];
}

// [TODO: confirm titles and dates, and replace each summary with your own account.]
export const caseStudies: CaseStudy[] = [
  {
    id: 'paramount',
    org: 'Paramount',
    title: 'Playbook: multi-brand tokens in production',
    period: '[TODO: dates] · about 2.5 years',
    icon: 'sliders',
    tags: ['Tokens', 'Figma Variables', 'React', 'Storybook'],
    summary:
      'Paramount’s Playbook design system serves several brands from one set of components. [TODO: the problem you were hired to solve and what changed because of your work.]',
    points: [
      'Multi-brand token model and Figma libraries built on Variables.',
      'Component updates shipped in both Figma and React/Storybook, including my own pull requests.',
      'Ran Figma Academy sessions so designers used the system, not just had access to it.',
    ],
  },
  {
    id: 'figma',
    org: 'Figma',
    title: 'Enablement is systems work',
    period: '[TODO: dates] · about 11 months',
    icon: 'user',
    tags: ['Enablement', 'Onboarding', 'Maturity models'],
    summary:
      'At Figma I worked on customer enablement and onboarding. [TODO: who you supported and one outcome you can name.]',
    points: [
      'Design-system maturity framework used in conversations with customer teams.',
      'Onboarding for teams adopting libraries, Variables and shared workflows.',
    ],
  },
  {
    id: 'verizon',
    org: 'Verizon',
    title: 'Specs and Figma-to-Storybook QA',
    period: '[TODO: dates]',
    icon: 'check-circle',
    tags: ['Specs', 'Visual QA', 'Handoff'],
    summary: 'A short senior design systems engagement focused on handoff quality.',
    points: [
      'Wrote component specs for engineering handoff.',
      'Visual QA between the Figma library and Storybook.',
    ],
  },
];

export const background =
  'I started as a sales engineer, which is where I learned to explain systems to the people who have to adopt them. [TODO: one or two sentences on how you moved into UX and design systems.]';
