# Agent guide: stillxp.gg

Personal portfolio site. It is a **consumer** of the Lock In design system (sibling repo `../lock-in-design-system`), not part of it.

- Use the `lockin` MCP server (`.mcp.json`): `get_component` before using a component, `get_tokens` for styling.
- UI comes from `@stillxp/react`. Custom CSS (`src/styles.css`) is layout only and may reference `--ds-*` semantic tokens only. `npm run lint:tokens` enforces it.
- Lock In has nothing that fits? Don't build a private workaround. File a proposal (`propose_to_lockin` prompt).
- Copy lives in `src/content.ts`. Never invent career facts; leave `[TODO: ...]` for the owner.
- Verify with `npm run lint:tokens && npm run build`.
