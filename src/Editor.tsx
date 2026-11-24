// Dev-only content editor at /#edit. Saves to src/content.json through the
// content-editor plugin in vite.config.ts. Not included in the production build.
import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { Button, InputField, Link, Tabs, Textarea } from '@stillxp/react';
import { content, type SiteContent } from './content';

// Lists are edited as plain text: paragraphs split on a blank line, points one per
// line, tags separated by commas. They are converted back when saving.
interface DiveForm { label: string; title: string; summary: string; body: string }
interface CaseForm { org: string; role: string; title: string; period: string; tags: string; summary: string; points: string }
interface Form {
  person: SiteContent['person'];
  links: SiteContent['lockIn'];
  dives: DiveForm[];
  cases: CaseForm[];
  background: string;
}

const lines = (s: string) => s.split('\n').map((l) => l.trim()).filter(Boolean);
const paragraphs = (s: string) => s.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
const commaList = (s: string) => s.split(',').map((t) => t.trim()).filter(Boolean);

function toForm(c: SiteContent): Form {
  return {
    person: structuredClone(c.person),
    links: { ...c.lockIn },
    dives: c.deepDives.map((d) => ({ label: d.label, title: d.title, summary: d.summary, body: d.body.join('\n\n') })),
    cases: c.experience.map((s) => ({
      org: s.org,
      role: s.role,
      title: s.title,
      period: s.period ?? '',
      tags: s.tags.join(', '),
      summary: s.summary,
      points: s.points.join('\n'),
    })),
    background: c.background,
  };
}

// Fields the editor doesn't show (ids, icons, diagrams) come from the current content.
function fromForm(f: Form, base: SiteContent): SiteContent {
  return {
    person: f.person,
    lockIn: f.links,
    deepDives: base.deepDives.map((d, i) => ({
      ...d,
      label: f.dives[i].label,
      title: f.dives[i].title,
      summary: f.dives[i].summary,
      body: paragraphs(f.dives[i].body),
    })),
    experience: base.experience.map((s, i) => {
      const { period: _period, ...rest } = s;
      const period = f.cases[i].period.trim();
      return {
        ...rest,
        org: f.cases[i].org,
        role: f.cases[i].role,
        title: f.cases[i].title,
        ...(period ? { period } : {}),
        tags: commaList(f.cases[i].tags),
        summary: f.cases[i].summary,
        points: lines(f.cases[i].points),
      };
    }),
    background: f.background,
  };
}

const todoHint = (value: string, hint?: string) =>
  value.includes('[TODO') ? `Still has a [TODO] placeholder.${hint ? ` ${hint}` : ''}` : hint;

type Status = { kind: 'idle' | 'saving' | 'saved' | 'error'; message?: string };

export default function Editor() {
  const [form, setForm] = useState<Form>(() => toForm(content));
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  const todos = useMemo(() => (JSON.stringify(fromForm(form, content)).match(/\[TODO/g) ?? []).length, [form]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  // Immutable update by path, e.g. update(['cases', 0, 'title'])(event).
  const update =
    (path: (string | number)[]) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setForm((prev) => {
        const next = structuredClone(prev) as unknown as Record<string | number, unknown>;
        let node = next;
        for (const key of path.slice(0, -1)) node = node[key] as Record<string | number, unknown>;
        node[path[path.length - 1]] = value;
        return next as unknown as Form;
      });
      setDirty(true);
      setStatus({ kind: 'idle' });
    };

  async function save() {
    setStatus({ kind: 'saving' });
    setDirty(false);
    try {
      const res = await fetch('/__content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fromForm(form, content)),
      });
      if (!res.ok) throw new Error((await res.text()) || `Save failed (${res.status})`);
      setStatus({ kind: 'saved', message: 'Saved to src/content.json.' });
    } catch (err) {
      setDirty(true);
      setStatus({ kind: 'error', message: err instanceof Error ? err.message : 'Save failed.' });
    }
  }

  const intro = (
    <div className="editor__panel">
      <InputField label="Name" value={form.person.name} onChange={update(['person', 'name'])} autoComplete="name" />
      <InputField label="Role" value={form.person.role} onChange={update(['person', 'role'])} />
      <InputField label="Location" value={form.person.location} onChange={update(['person', 'location'])} />
      <InputField label="Tagline" hint="Shown under your name in the hero." value={form.person.headline} onChange={update(['person', 'headline'])} />
      <Textarea label="Intro" value={form.person.intro} onChange={update(['person', 'intro'])} rows={4} autoGrow />
      <InputField label="LinkedIn URL" type="url" value={form.person.links.linkedin} onChange={update(['person', 'links', 'linkedin'])} />
      <InputField label="GitHub URL" type="url" value={form.person.links.github} onChange={update(['person', 'links', 'github'])} />
      <Textarea
        label="Background"
        hint={todoHint(form.background, 'Shown under the case studies.')}
        value={form.background}
        onChange={update(['background'])}
        rows={3}
        autoGrow
      />
    </div>
  );

  const lockInPanel = (
    <div className="editor__panel">
      <InputField label="GitHub repo URL" type="url" value={form.links.repo} onChange={update(['links', 'repo'])} />
      <InputField label="Figma library URL" type="url" value={form.links.figma} onChange={update(['links', 'figma'])} />
      <InputField label="Storybook URL" type="url" value={form.links.storybook} onChange={update(['links', 'storybook'])} showOptional />
      <InputField label="Hub URL" type="url" hint="Leave empty to hide the link." value={form.links.hub} onChange={update(['links', 'hub'])} showOptional />
    </div>
  );

  const divesPanel = (
    <div className="editor__panel">
      {form.dives.map((d, i) => (
        <fieldset key={content.deepDives[i].id} className="editor__group">
          <legend className="ds-text-heading-sm">{d.label || `Deep dive ${i + 1}`}</legend>
          <InputField label="Tab label" hint="One or two words." value={d.label} onChange={update(['dives', i, 'label'])} />
          <InputField label="Title" value={d.title} onChange={update(['dives', i, 'title'])} />
          <InputField label="Summary" value={d.summary} onChange={update(['dives', i, 'summary'])} />
          <Textarea
            label="Body"
            hint={todoHint(d.body, 'Leave a blank line between paragraphs.')}
            value={d.body}
            onChange={update(['dives', i, 'body'])}
            rows={8}
            autoGrow
            maxRows={20}
          />
        </fieldset>
      ))}
    </div>
  );

  const workPanel = (
    <div className="editor__panel">
      {form.cases.map((c, i) => (
        <fieldset key={content.experience[i].id} className="editor__group">
          <legend className="ds-text-heading-sm">{c.org || `Case study ${i + 1}`}</legend>
          <InputField label="Company" value={c.org} onChange={update(['cases', i, 'org'])} autoComplete="organization" />
          <InputField label="Job title" value={c.role} onChange={update(['cases', i, 'role'])} autoComplete="organization-title" />
          <InputField label="Case study title" value={c.title} onChange={update(['cases', i, 'title'])} />
          <InputField label="Period" hint={todoHint(c.period)} value={c.period} onChange={update(['cases', i, 'period'])} showOptional />
          <Textarea label="Summary" hint={todoHint(c.summary)} value={c.summary} onChange={update(['cases', i, 'summary'])} rows={3} autoGrow />
          <Textarea
            label="Points"
            hint={todoHint(c.points, 'One point per line.')}
            value={c.points}
            onChange={update(['cases', i, 'points'])}
            rows={3}
            autoGrow
          />
          <InputField label="Tags" hint="Separate tags with commas." value={c.tags} onChange={update(['cases', i, 'tags'])} />
        </fieldset>
      ))}
    </div>
  );

  return (
    <main className="editor container">
      <div className="editor__bar">
        <div className="editor__heading">
          <h1 className="ds-text-heading-lg">Edit content</h1>
          <p className="ds-text-body-sm editor__meta" role="status">
            {status.kind === 'saving'
              ? 'Saving…'
              : status.message ?? (dirty ? 'Unsaved changes.' : 'No changes.')}
            {' '}
            {todos > 0 ? `${todos} [TODO] placeholder${todos === 1 ? '' : 's'} left.` : 'No [TODO] placeholders left.'}
          </p>
        </div>
        <div className="editor__actions">
          <Link href="#" variant="standalone">View site</Link>
          <Button onClick={save} loading={status.kind === 'saving'} loadingLabel="Saving">
            Save
          </Button>
        </div>
      </div>
      <Tabs
        aria-label="Content sections"
        items={[
          { id: 'intro', label: 'Intro', content: intro },
          { id: 'lock-in', label: 'Lock In', content: lockInPanel },
          { id: 'dives', label: 'Deep dives', content: divesPanel },
          { id: 'work', label: 'Work', content: workPanel },
        ]}
      />
    </main>
  );
}
